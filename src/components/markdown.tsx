import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renders post Markdown. Raw HTML in the source is ignored, so pasted scripts can't run. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-lg max-w-none prose-headings:text-ink prose-a:text-brand-600 prose-img:rounded-xl prose-blockquote:border-brand-500 prose-blockquote:bg-brand-50 prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:font-normal [&_blockquote_p]:before:content-none [&_blockquote_p]:after:content-none prose-table:text-base">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // eslint-disable-next-line @next/next/no-img-element
          img: ({ src, alt }) => <img src={typeof src === "string" ? src : ""} alt={alt ?? ""} loading="lazy" className="mx-auto max-h-[480px] w-auto" />,
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
