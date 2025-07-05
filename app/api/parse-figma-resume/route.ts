interface FigmaNode {
  id: string;
  name: string;
  type: string;
  characters?: string;
  children?: FigmaNode[];
}

// Quick-and-dirty HTML generator. This is **not** production-grade but
// demonstrates the round-trip of taking Figma JSON → code.
function nodeToJsx(node: FigmaNode): string {
  switch (node.type) {
    case 'TEXT':
      return `<p>{\`${node.characters || ''}\`}</p>`;
    case 'RECTANGLE':
    case 'FRAME':
    case 'GROUP': {
      const childrenJsx = node.children?.map(nodeToJsx).join('\n') || '';
      return `<div className={styles.${node.name.replace(/\s+/g, '').toLowerCase()}}>${childrenJsx}</div>`;
    }
    default:
      return '';
  }
}

function extractFileKeyAndNodeId(figmaUrl: string): { fileKey: string; nodeId?: string } | null {
  try {
    const url = new URL(figmaUrl);
    const segments = url.pathname.split('/');
    const fileIndex = segments.indexOf('file');
    if (fileIndex === -1 || segments.length <= fileIndex + 1) return null;
    const fileKey = segments[fileIndex + 1];

    const nodeId = url.searchParams.get('node-id') || undefined;
    return { fileKey, nodeId };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const { FIGMA_API_KEY } = process.env;
  if (!FIGMA_API_KEY) {
    return new Response(JSON.stringify({ error: 'FIGMA_API_KEY not configured on server.' }), {
      status: 500,
    });
  }

  try {
    const { figmaLink, customColors = {} } = await req.json();

    if (!figmaLink) {
      return new Response(JSON.stringify({ error: 'figmaLink is required.' }), {
        status: 400,
      });
    }

    const ids = extractFileKeyAndNodeId(figmaLink);

    if (!ids) {
      return new Response(JSON.stringify({ error: 'Invalid Figma link.' }), {
        status: 400,
      });
    }

    const { fileKey, nodeId } = ids;

    // Fetch node(s)
    const apiBase = 'https://api.figma.com/v1';
    const headers = {
      'X-Figma-Token': FIGMA_API_KEY as string,
    } as HeadersInit;

    let nodeResponseJson: any;

    if (nodeId) {
      const nodeRes = await fetch(`${apiBase}/files/${fileKey}/nodes?ids=${encodeURIComponent(nodeId)}`, {
        headers,
      });
      if (!nodeRes.ok) {
        throw new Error(`Failed to fetch node data from Figma: ${await nodeRes.text()}`);
      }
      nodeResponseJson = await nodeRes.json();
    } else {
      const fileRes = await fetch(`${apiBase}/files/${fileKey}`, { headers });
      if (!fileRes.ok) {
        throw new Error(`Failed to fetch file JSON: ${await fileRes.text()}`);
      }
      nodeResponseJson = await fileRes.json();
    }

    // For demo purposes pick the first node in the response
    const firstNode: FigmaNode | undefined = nodeResponseJson?.nodes
      ? Object.values<any>(nodeResponseJson.nodes)[0]?.document
      : nodeResponseJson?.document;

    if (!firstNode) {
      return new Response(JSON.stringify({ error: 'Could not locate node in Figma file.' }), {
        status: 400,
      });
    }

    const componentName = `FigmaResume${firstNode.name.replace(/[^a-zA-Z0-9]/g, '')}`;
    const jsxBody = nodeToJsx(firstNode);

    const jsxCode = `import React from 'react';\nimport styles from './${componentName}.module.css';\n\nexport const ${componentName}: React.FC = () => {\n  return (\n    ${jsxBody}\n  );\n};\n`;

    const cssModule = `/* Placeholder styles generated from Figma */\n.${firstNode.name.replace(/\s+/g, '').toLowerCase()} {\n  /* TODO: add real styles */\n}\n`;

    // Return generated code so the client can write it locally (or further refine).
    return new Response(
      JSON.stringify({ jsx: jsxCode, css: cssModule, componentName, rawFigma: nodeResponseJson, customColors }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: unknown) {
    console.error(err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
}