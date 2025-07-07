import { type NextRequest, NextResponse } from 'next/server';
import type {
  FigmaAdaptationRequest,
  FigmaAdaptationResult,
} from '@/lib/ai-agents/figma-mcp-agent';
import { figmaMCPAgent } from '@/lib/ai-agents/figma-mcp-agent';
import type { ParsedResume } from '@/lib/resume-parser/schema';

export interface AdaptFigmaResumeRequest {
  figmaLink: string;
  resumeData: ParsedResume;
  adaptationStrategy?:
    | 'content-mapping'
    | 'layout-preservation'
    | 'style-extraction'
    | 'hybrid';
  customMappings?: Record<string, string>;
  preserveElements?: string[];
  colorScheme?: 'original' | 'resume-colors' | 'adaptive';
}

export interface AdaptFigmaResumeResponse {
  success: boolean;
  message: string;
  result?: FigmaAdaptationResult;
  error?: string;
  details?: string;
}

function extractFileKeyAndNodeId(
  figmaUrl: string
): { fileKey: string; nodeId?: string } | null {
  try {
    const url = new URL(figmaUrl);
    const segments = url.pathname.split('/');
    const fileSegmentIndex = segments.findIndex(
      (seg) => seg === 'file' || seg === 'design'
    );
    if (fileSegmentIndex === -1 || segments.length <= fileSegmentIndex + 1)
      return null;
    const fileKey = segments[fileSegmentIndex + 1];
    const nodeId = url.searchParams.get('node-id') || undefined;
    return { fileKey, nodeId };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as AdaptFigmaResumeRequest;

    const {
      figmaLink,
      resumeData,
      adaptationStrategy = 'hybrid',
      customMappings = {},
      preserveElements = [],
      colorScheme = 'adaptive',
    } = body;

    // Validate required fields
    if (!figmaLink) {
      return NextResponse.json(
        {
          success: false,
          message: 'Figma link is required',
          error: 'MISSING_FIGMA_LINK',
        } as AdaptFigmaResumeResponse,
        { status: 400 }
      );
    }

    if (!resumeData || !resumeData.name) {
      return NextResponse.json(
        {
          success: false,
          message: 'Resume data is required and must include at least a name',
          error: 'INVALID_RESUME_DATA',
        } as AdaptFigmaResumeResponse,
        { status: 400 }
      );
    }

    // Extract file key and node ID from Figma link
    const figmaIds = extractFileKeyAndNodeId(figmaLink);
    if (!figmaIds) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid Figma link format',
          error: 'INVALID_FIGMA_LINK',
          details:
            'The Figma link must be in the format: https://www.figma.com/file/FILE_KEY/... or https://www.figma.com/design/FILE_KEY/...',
        } as AdaptFigmaResumeResponse,
        { status: 400 }
      );
    }

    // Check if MCP agent is ready
    const isAgentReady = await figmaMCPAgent.isReady();
    if (!isAgentReady) {
      return NextResponse.json(
        {
          success: false,
          message: 'Figma MCP agent is not ready',
          error: 'MCP_AGENT_NOT_READY',
          details:
            'The MCP server connection could not be established. Please check your configuration.',
        } as AdaptFigmaResumeResponse,
        { status: 503 }
      );
    }

    // Prepare adaptation request
    const adaptationRequest: FigmaAdaptationRequest = {
      sourceFileKey: figmaIds.fileKey,
      sourceNodeId: figmaIds.nodeId,
      targetResumeData: resumeData,
      adaptationStrategy,
      customMappings,
      preserveElements,
      colorScheme,
    };

    // Perform adaptation using MCP agent
    const adaptationResult =
      await figmaMCPAgent.adaptDesignForResume(adaptationRequest);

    if (!adaptationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to adapt Figma design',
          error: 'ADAPTATION_FAILED',
          details: adaptationResult.errors.join('; '),
          result: adaptationResult,
        } as AdaptFigmaResumeResponse,
        { status: 500 }
      );
    }

    // Persist the generated component files
    try {
      const fs = await import('node:fs/promises');
      const path = await import('node:path');

      const genDir = path.join(process.cwd(), 'src', 'generated-resumes');
      await fs.mkdir(genDir, { recursive: true });

      const kebabName = adaptationResult.componentName
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();

      const tsxPath = path.join(genDir, `${kebabName}.tsx`);
      const cssPath = path.join(genDir, `${kebabName}.module.css`);

      await fs.writeFile(tsxPath, adaptationResult.jsxCode, 'utf8');
      await fs.writeFile(cssPath, adaptationResult.cssCode, 'utf8');

      adaptationResult.adaptationLog.push(
        `Files saved: ${kebabName}.tsx, ${kebabName}.module.css`
      );
    } catch (writeError) {
      console.warn('Failed to persist generated files:', writeError);
      adaptationResult.warnings.push('Could not save generated files to disk');
    }

    return NextResponse.json({
      success: true,
      message: `Successfully adapted Figma design for resume: ${adaptationResult.componentName}`,
      result: adaptationResult,
    } as AdaptFigmaResumeResponse);
  } catch (error) {
    console.error('Error in adapt-figma-resume:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error during Figma adaptation',
        error: 'INTERNAL_ERROR',
        details: errorMessage,
      } as AdaptFigmaResumeResponse,
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      success: false,
      message: 'This endpoint only accepts POST requests',
      error: 'METHOD_NOT_ALLOWED',
    } as AdaptFigmaResumeResponse,
    { status: 405 }
  );
}
