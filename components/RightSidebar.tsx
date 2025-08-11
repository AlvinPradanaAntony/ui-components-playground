"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import CodeEditor from "@/components/CodeEditor";
import IconUploader from "@/components/IconUploader";
import PreviewIframe from "@/components/PreviewIframe";
import type { ComponentCode, StyleKind } from "@/types";
import { useToast } from "@/components/ui/Toast";
type Props = {
  initialCode: ComponentCode;
  onCodeChange?: (code: ComponentCode) => void;
  styleKind?: StyleKind;
  baselineKey?: string;
  // Optional icon controls when editing component thumbnails
  iconUrl?: string;
  onIconChange?: (url: string) => void;
  iconLabel?: string;
};
export default function RightSidebar({ initialCode, onCodeChange, styleKind = "native", baselineKey, iconUrl, onIconChange, iconLabel = "Icon/Thumbnail" }: Props) {
  const toast = useToast();
  const [tab, setTab] = useState<"html" | "css" | "js">("html");
  const [html, setHtml] = useState(initialCode.html);
  const [css, setCss] = useState(initialCode.css);
  const [js, setJs] = useState(initialCode.js);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Initialize uniformly for SSR/CSR to avoid hydration mismatch; load saved value after mount
  const [wrap, setWrap] = useState<boolean>(true);
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("editor.wrap");
      if (saved) setWrap(saved === "on");
    } catch {}
  }, []);
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
  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.cssText = "position:fixed;left:-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      return true;
    } catch {
      return false;
    }
  };

  const copy = async () => {
    const success = await copyToClipboard(JSON.stringify(combined, null, 2));
    toast[success ? "success" : "error"](success ? "Disalin ke clipboard" : "Gagal menyalin");
  };

  const reset = () => {
    const { html: baseHtml, css: baseCss, js: baseJs } = baselineRef.current;
    setHtml(baseHtml);
    setCss(baseCss);
    setJs(baseJs);
  };

  const getStyleDependencies = () => {
    const deps = {
      bootstrap: `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />\n<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>`,
      tailwind: `<script src="https://cdn.tailwindcss.com"></script>\n<script>tailwind.config={theme:{extend:{}}}</script>`,
      native: "",
    };
    return deps[styleKind] || "";
  };

  const download = () => {
    const baseStyle = "<style>*,*:before,*:after{box-sizing:border-box}html,body{height:100%}body{padding:16px;font-family:ui-sans-serif,system-ui,Segoe UI,Roboto}</style>";
    const deps = getStyleDependencies();
    const fullHtml = `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>${baseStyle}${deps}<style>${css}</style></head><body>${html}<script>${js}</script></body></html>`;

    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "component.html";
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatAll = async () => {
    try {
      const [prettier, pluginHtml, pluginBabel, pluginEstree, pluginPostCss] = await Promise.all([import("prettier/standalone"), import("prettier/plugins/html"), import("prettier/plugins/babel"), import("prettier/plugins/estree"), import("prettier/plugins/postcss")]);

      const [formattedHtml, formattedCss, formattedJs] = await Promise.all([
        (prettier as any).format(html ?? "", { parser: "html", plugins: [pluginHtml] }),
        (prettier as any).format(css ?? "", { parser: "css", plugins: [pluginPostCss] }),
        (prettier as any).format(js ?? "", { parser: "babel", plugins: [pluginBabel, pluginEstree] }),
      ]);

      setHtml(formattedHtml.trim());
      setCss(formattedCss.trim());
      setJs(formattedJs.trim());
    } catch (e) {
      console.error("Format failed", e);
      toast.error("Gagal auto format. Pastikan Prettier terpasang.");
    }
  };
  const EditorContent = ({ inDrawer = false }: { inDrawer?: boolean }) => (
    <div className="p-2 xl:p-3">
      {/* On desktop (aside), keep IconUploader here; on mobile/tablet it's rendered in main */}
      {onIconChange && !inDrawer && (
        <div className="mb-3">
          <IconUploader label={iconLabel} value={iconUrl || ""} onChange={onIconChange} />
        </div>
      )}

      {/* On mobile/tablet drawer, show live preview above editor */}
      {inDrawer && (
        <div className="mb-3">
          <div className="h-[55vh] sm:h-[60vh] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
            <PreviewIframe styleKind={styleKind} code={combined} />
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-3 gap-1 xl:gap-2">
        <div className="flex gap-1 xl:gap-2">
          {(["html", "css", "js"] as const).map((lang) => (
            <button key={lang} onClick={() => setTab(lang)} className={`px-2 xl:px-3 py-1.5 text-xs xl:text-sm rounded-xl border transition-colors ${tab === lang ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-50 dark:hover:bg-gray-900"}`}>
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            const newWrap = !wrap;
            setWrap(newWrap);
            try {
              localStorage.setItem("editor.wrap", newWrap ? "on" : "off");
            } catch {}
          }}
          className="px-2 xl:px-3 py-1.5 text-xs xl:text-sm rounded-xl border hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          title={wrap ? "Matikan word wrap" : "Nyalakan word wrap"}
        >
          <span suppressHydrationWarning>{wrap ? "No Wrap" : "Wrap"}</span>
        </button>
      </div>

      <CodeEditor language={tab === "js" ? "javascript" : tab} value={tab === "html" ? html : tab === "css" ? css : js} onChange={tab === "html" ? setHtml : tab === "css" ? setCss : setJs} height={340} wrap={wrap} />

      <div className="mt-3 flex gap-1 xl:gap-2 flex-wrap">
        {[
          { label: "Copy", onClick: copy },
          { label: "Format", onClick: formatAll },
          { label: "Reset", onClick: reset },
          { label: "Download", onClick: download },
        ].map(({ label, onClick }) => (
          <button key={label} onClick={onClick} className="px-2 xl:px-3 py-1.5 text-xs xl:text-sm rounded-xl border hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
            {label}
          </button>
        ))}
      </div>
      <div className="mt-6 text-xs text-gray-500">Edit kode lalu lihat hasilnya pada preview di tengah.</div>
    </div>
  );

  return (
    <>
      {/* Desktop (xl+) sidebar */}
      <aside aria-label="Panel editor kode" className="h-[calc(100vh-3.5rem)] sticky top-14 w-[var(--rightbar-width)] shrink-0 overflow-y-auto border-l border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 hidden xl:block">
        <EditorContent inDrawer={false} />
      </aside>

      {/* Mobile/Tablet trigger button */}
      <button type="button" aria-label="Buka editor" onClick={() => setMobileOpen(true)} className="xl:hidden fixed bottom-20 right-4 z-40 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-elevated rounded-full px-4 h-10 inline-flex items-center gap-2 text-sm">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="14" rx="2" ry="2" />
          <path d="M8 10h8M8 14h5" />
        </svg>
        Editor
      </button>

      {/* Mobile/Tablet drawer */}
      {mobileOpen && (
        <div className="xl:hidden fixed inset-0 z-50">
          {/* Scrim */}
          <div aria-hidden className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          {/* Panel: starts below topbar */}
          <section aria-label="Panel editor kode" className="absolute top-14 bottom-0 right-0 left-0 bg-white dark:bg-gray-950 rounded-t-xl shadow-elevated overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between px-3 h-12 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur">
              <div className="font-medium">Editor</div>
              <button aria-label="Tutup editor" onClick={() => setMobileOpen(false)} className="p-2 rounded-md border border-gray-200 dark:border-gray-800 hover:bg-black/5 dark:hover:bg-white/5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <EditorContent inDrawer={true} />
          </section>
        </div>
      )}
    </>
  );
}
