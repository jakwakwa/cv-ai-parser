import Markdown from "@/src/components/docs/Markdown";

export const dynamic = "force-dynamic";

const md = `
Coming soon...
`;

export default function Guide() {
    return <Markdown>{md}</Markdown>;
}
