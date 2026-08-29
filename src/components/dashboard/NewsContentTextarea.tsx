import type { ClipboardEvent, TextareaHTMLAttributes } from "react";
import { useEffect, useRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import {
  Bold, Code, Eraser, Heading2, Image as ImageIcon, Italic,
  Link as LinkIcon, List, ListOrdered, Quote,
} from "lucide-react";

import { isImageUrl, normalizeNewsImageLinks } from "@/lib/news-content";

type Props = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange"> & {
  value: string;
  onValueChange: (value: string) => void;
};

function childrenToMarkdown(element: Element) {
  return Array.from(element.childNodes).map(nodeToMarkdown).join("");
}

function listToMarkdown(element: Element, ordered: boolean) {
  return Array.from(element.children)
    .filter((child) => child.tagName === "LI")
    .map((item, index) =>
      `${ordered ? `${index + 1}. ` : "- "}${childrenToMarkdown(item).trim()}`,
    )
    .join("\n");
}

function nodeToMarkdown(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
  if (!(node instanceof Element)) return "";

  const content = childrenToMarkdown(node);
  switch (node.tagName) {
    case "BR": return "\n";
    case "P": case "DIV": return `${content}\n\n`;
    case "H1": return `# ${content.trim()}\n\n`;
    case "H2": return `## ${content.trim()}\n\n`;
    case "H3": return `### ${content.trim()}\n\n`;
    case "STRONG": case "B": return `**${content}**`;
    case "EM": case "I": return `*${content}*`;
    case "BLOCKQUOTE":
      return `${content.trim().split("\n").map((line) => `> ${line}`).join("\n")}\n\n`;
    case "UL": return `${listToMarkdown(node, false)}\n\n`;
    case "OL": return `${listToMarkdown(node, true)}\n\n`;
    case "A": return `[${content}](${node.getAttribute("href") ?? ""})`;
    case "IMG":
      return `![${node.getAttribute("alt") ?? ""}](${node.getAttribute("src") ?? ""})\n\n`;
    case "PRE": return `\`\`\`\n${node.textContent ?? ""}\n\`\`\`\n\n`;
    case "CODE": return `\`${content}\``;
    default: return content;
  }
}

function editorToMarkdown(editor: HTMLElement) {
  return childrenToMarkdown(editor)
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd();
}

function markdownToHtml(markdown: string) {
  return renderToStaticMarkup(<ReactMarkdown>{markdown}</ReactMarkdown>);
}

export function NewsContentTextarea({
  value, onValueChange, onBlur, className, id, placeholder,
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editorToMarkdown(editor) !== value) {
      editor.innerHTML = markdownToHtml(value);
    }
  }, [value]);

  function syncValue() {
    if (editorRef.current) onValueChange(editorToMarkdown(editorRef.current));
  }

  function command(name: string, commandValue?: string) {
    const editor = editorRef.current;
    editor?.focus();

    if (selectionRef.current) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(selectionRef.current);
    }

    document.execCommand(name, false, commandValue);
    syncValue();
  }

  function rememberSelection() {
    const selection = window.getSelection();

    if (
      selection?.rangeCount &&
      editorRef.current?.contains(selection.anchorNode)
    ) {
      selectionRef.current = selection.getRangeAt(0).cloneRange();
    }
  }

  function insertLink() {
    const url = window.prompt("آدرس لینک را وارد کنید:", "https://");
    if (url) command("createLink", url.trim());
  }

  function insertImage() {
    const url = window.prompt("لینک مستقیم تصویر را وارد کنید:", "https://");
    if (!url) return;
    try {
      const parsed = new URL(url.trim());
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
    } catch {
      window.alert("لینک تصویر معتبر نیست.");
      return;
    }
    command("insertImage", url.trim());
  }

  function clearFormatting() {
    const anchor = window.getSelection()?.anchorNode;
    const parent = anchor instanceof Element ? anchor : anchor?.parentElement;
    command("removeFormat");
    command("unlink");
    if (parent?.closest("ul")) command("insertUnorderedList");
    else if (parent?.closest("ol")) command("insertOrderedList");
    command("formatBlock", "p");
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain").trim();
    command(isImageUrl(text) ? "insertImage" : "insertText", text);
  }

  const tools = [
    { label: "معمولی", icon: Eraser, action: clearFormatting },
    { label: "بولد", icon: Bold, action: () => command("bold") },
    { label: "ایتالیک", icon: Italic, action: () => command("italic") },
    { label: "عنوان", icon: Heading2, action: () => command("formatBlock", "h2") },
    { label: "نقل‌قول", icon: Quote, action: () => command("formatBlock", "blockquote") },
    { label: "فهرست", icon: List, action: () => command("insertUnorderedList") },
    { label: "شماره‌دار", icon: ListOrdered, action: () => command("insertOrderedList") },
    { label: "لینک", icon: LinkIcon, action: insertLink },
    { label: "تصویر", icon: ImageIcon, action: insertImage },
    { label: "کد", icon: Code, action: () => command("formatBlock", "pre") },
  ];

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-1 rounded-md border border-border bg-muted/40 p-2" role="toolbar" aria-label="ابزار قالب‌بندی متن مطلب">
        {tools.map(({ label, icon: Icon, action }) => (
          <button key={label} type="button" onMouseDown={(event) => { event.preventDefault(); rememberSelection(); }} onClick={action} title={label} className="inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-bold transition hover:bg-background hover:text-brand">
            <Icon className="h-4 w-4" /><span>{label}</span>
          </button>
        ))}
      </div>

      <div className="relative">
        {!value && <span className="pointer-events-none absolute right-4 top-3 text-sm text-muted-foreground">{placeholder}</span>}
        <div
          ref={editorRef}
          id={id}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          onInput={syncValue}
          onPaste={handlePaste}
          onBlur={(event) => {
            onValueChange(normalizeNewsImageLinks(editorToMarkdown(event.currentTarget)));
            onBlur?.(event as never);
          }}
          className={`${className ?? ""} min-h-72 overflow-y-auto whitespace-pre-wrap text-right [&_blockquote]:my-2 [&_blockquote]:border-r-4 [&_blockquote]:border-brand [&_blockquote]:bg-muted/60 [&_blockquote]:px-3 [&_blockquote]:py-1 [&_h2]:my-3 [&_h2]:text-xl [&_h2]:font-black [&_img]:my-3 [&_img]:h-auto [&_img]:max-h-96 [&_img]:max-w-full [&_img]:rounded-lg [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pr-7 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pr-7`}
        />
      </div>
    </div>
  );
}
