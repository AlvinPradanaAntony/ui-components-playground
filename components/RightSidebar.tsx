"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import CodeEditor from "@/components/CodeEditor";
import type { ComponentCode, StyleKind } from "@/types";
type Props = { initialCode: ComponentCode; onCodeChange?: (code: ComponentCode) => void; styleKind?: StyleKind; baselineKey?: string };
export default function RightSidebar({ initialCode, onCodeChange, styleKind = "native", baselineKey }: Props) {
  const [tab, setTab] = useState<"html" | "css" | "js">("html");
  const [html, setHtml] = useState(initialCode.html);
  const [css, setCss] = useState(initialCode.css);
  const [js, setJs] = useState(initialCode.js);
  const [wrap, setWrap] = useState<boolean>(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("editor.wrap") : null;
    return saved ? saved === "on" : true;
  });
  // Capture a reset baseline per item; do not update on every keystroke from parent
  const baselineRef = useRef<ComponentCode>(initialCode);
  useEffect(() => {
    baselineRef.current = initialCode;
    setHtml(initialCode.html);
    setCss(initialCode.css);
    setJs(initialCode.js);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baselineKey]);
  const combined = useMemo(() => ({ html, css, js }), [html, css, js]);
  // Notify parent after render when code changes, to avoid render-time updates
  useEffect(() => {
    onCodeChange?.(combined);
  }, [combined, onCodeChange]);
  async function copy() {
    const text = JSON.stringify(combined, null, 2);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      alert("Disalin ke clipboard");
    } catch {
      alert("Gagal menyalin");
    }
  }
  function reset() {
    const base = baselineRef.current;
    setHtml(base.html);
    setCss(base.css);
    setJs(base.js);
  }
  function download() {
    const bootstrap = `<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\" />\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\"></script>`;
    const tailwind = `<script src=\"https://cdn.tailwindcss.com\"></script>\n<script>tailwind.config={theme:{extend:{}}}</script>`;
    const baseStyle = "<style>*,*:before,*:after{box-sizing:border-box}html,body{height:100%}body{padding:16px;font-family:ui-sans-serif,system-ui,Segoe UI,Roboto}</style>";
    const deps = styleKind === "bootstrap" ? bootstrap : styleKind === "tailwind" ? tailwind : "";
    const full = `<!doctype html><html><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/>${baseStyle}${deps}<style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;
    const blob = new Blob([full], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const el = document.createElement("a");
    el.href = url;
    el.download = "component.html";
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
    URL.revokeObjectURL(url);
  }
  return (
    <aside className="h-screen sticky top-0 w-[var(--rightbar-width)] shrink-0 overflow-y-auto p-3 border-l border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 hidden xl:block">
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex gap-2">
          {(["html", "css", "js"] as const).map((k) => (
            <button key={k} onClick={() => setTab(k)} className={`px-3 py-1.5 text-sm rounded-xl border ${tab === k ? "bg-gray-100 dark:bg-gray-800" : ""}`}>
              {k.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            const next = !wrap;
            setWrap(next);
            try {
              window.localStorage.setItem("editor.wrap", next ? "on" : "off");
            } catch {}
          }}
          className="px-3 py-1.5 text-sm rounded-xl border"
          title={wrap ? "Matikan word wrap" : "Nyalakan word wrap"}
        >
          {wrap ? "No Wrap" : "Wrap"}
        </button>
      </div>
      {tab === "html" && <CodeEditor language="html" value={html} onChange={setHtml} height={340} wrap={wrap} />} {tab === "css" && <CodeEditor language="css" value={css} onChange={setCss} height={340} wrap={wrap} />}{" "}
      {tab === "js" && <CodeEditor language="javascript" value={js} onChange={setJs} height={340} wrap={wrap} />}
      <div className="mt-3 flex gap-2">
        <button onClick={copy} className="px-3 py-1.5 rounded-xl border">
          Copy
        </button>
        <button onClick={reset} className="px-3 py-1.5 rounded-xl border">
          Reset
        </button>
        <button onClick={download} className="px-3 py-1.5 rounded-xl border">
          Download
        </button>
      </div>
      <div className="mt-6 text-xs text-gray-500">Edit kode lalu lihat hasilnya pada preview di tengah.</div>
    </aside>
  );
}
