// File: components/MockCode.tsx
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// specific Prism themes to avoid missing module errors
import atomDark from "react-syntax-highlighter/dist/esm/styles/prism/atom-dark";

export interface MockCodeProps {
  /** Multiline code string to render */
  code: string;
}

/**
 * MockCode renders a code block using react-markdown and react-syntax-highlighter
 * wrapped in a DaisyUI "mockup-code" container.
 */
export default function MockCode({ code }: MockCodeProps) {
  // Wrap code in fenced block for markdown parser
  const markdown = `~~~typescript
${code}
~~~`;

  return (
    <Markdown
      components={{
        code(props) {
          // eslint-disable-next-line react/prop-types
          const { children } = props;
          return (
            <SyntaxHighlighter
              PreTag="div"
              language="typescript"
              style={atomDark}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          );
        },
      }}
    >
      {markdown}
    </Markdown>
  );
}
