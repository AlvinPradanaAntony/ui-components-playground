"use client";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import CodeEditor from "@/components/CodeEditor";
import IconUploader from "@/components/IconUploader";
import PreviewIframe from "@/components/PreviewIframe";
import type { ComponentCode, StyleKind } from "@/types";
import { useToast } from "@/components/ui/Toast";

// Extract EditorContent as a separate component to prevent unnecessary re-renders
type EditorContentProps = {
  inDrawer?: boolean;
  onIconChange?: (url: string) => void;
  iconLabel?: string;
  iconUrl?: string;
  styleKind: StyleKind;
  combined: ComponentCode;
  tab: "html" | "css" | "js";
  setTab: (tab: "html" | "css" | "js") => void;
  wrap: boolean;
  setWrap: (wrap: boolean) => void;
  html: string;
  css: string;
  js: string;
  setHtml: (html: string) => void;
  setCss: (css: string) => void;
  setJs: (js: string) => void;
  onCopy: () => void;
  onFormatAll: () => void;
  onReset: () => void;
  onDownload: () => void;
};

const EditorContent = ({
  inDrawer = false,
  onIconChange,
  iconLabel,
  iconUrl,
  styleKind,
  combined,
  tab,
  setTab,
  wrap,
  setWrap,
  html,
  css,
  js,
  setHtml,
  setCss,
  setJs,
  onCopy,
  onFormatAll,
  onReset,
  onDownload
}: EditorContentProps) => (
  <div className="p-2 xl:p-3">
    {/* On desktop (aside), keep IconUploader here; on mobile/tablet it's rendered in main */}
    {onIconChange && !inDrawer && (
      <div className="mb-3">
        <IconUploader label={iconLabel || "Icon/Thumbnail"} value={iconUrl || ""} onChange={onIconChange} />
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
          <button key={lang} onClick={() => setTab(lang)} className={`px-2 xl:px-3 py-1.5 text-xs xl:text-sm rounded-xl transition-colors ${tab === lang ? "bg-brand-500 text-white" : "bg-gray-100 hover:bg-gray-200 dark:bg-surface-100 dark:hover:bg-brand-500/40"}`}>
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
        className="px-2 xl:px-3 py-1.5 text-xs xl:text-sm rounded-xl  bg-slate-200 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-800 hover:text-white dark:hover:bg-slate-700 transition-colors"
        title={wrap ? "Matikan word wrap" : "Nyalakan word wrap"}
      >
        <span suppressHydrationWarning>{wrap ? "No Wrap" : "Wrap"}</span>
      </button>
    </div>

    <CodeEditor language={tab === "js" ? "javascript" : tab} value={tab === "html" ? html : tab === "css" ? css : js} onChange={tab === "html" ? setHtml : tab === "css" ? setCss : setJs} height={340} wrap={wrap} />

    <div className="mt-3 flex gap-1 xl:gap-2 flex-wrap">
      {[
        { label: "Copy", onClick: onCopy, className: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50" },
        { label: "Format", onClick: onFormatAll, className: "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50" },
        { label: "Reset", onClick: onReset, className: "bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/50" },
        { label: "Download", onClick: onDownload, className: "bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50" },
      ].map(({ label, onClick, className }) => (
        <button key={label} onClick={onClick} className={`px-2 xl:px-3 py-1.5 text-xs xl:text-sm rounded-xl border transition-colors ${className}`}>
          {label}
        </button>
      ))}
    </div>
    <div className="mt-6 text-xs text-gray-500">Edit kode lalu lihat hasilnya pada preview di tengah.</div>
  </div>
);
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
  
  // Resizable sidebar state
  const [sidebarWidth, setSidebarWidth] = useState<number>(0);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);
  
  // Constants for resize constraints
  const MIN_WIDTH = 280;
  const MAX_WIDTH = 600;
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("editor.wrap");
      if (saved) setWrap(saved === "on");
    } catch {}
  }, []);

  // Initialize sidebar width from CSS variable
  useEffect(() => {
    const updateWidthFromCSS = () => {
      const rootStyles = getComputedStyle(document.documentElement);
      const currentWidth = rootStyles.getPropertyValue('--rightbar-width').trim();
      if (currentWidth) {
        const widthValue = parseInt(currentWidth.replace('px', ''));
        setSidebarWidth(widthValue);
      }
    };
    
    updateWidthFromCSS();
    
    // Listen for window resize to update width based on responsive breakpoints
    const handleResize = () => updateWidthFromCSS();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update CSS variable when sidebar width changes
  useEffect(() => {
    if (sidebarWidth > 0) {
      document.documentElement.style.setProperty('--rightbar-width', `${sidebarWidth}px`);
    }
  }, [sidebarWidth]);

  // Mouse event handlers for resizing
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = sidebarWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [sidebarWidth]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const deltaX = startXRef.current - e.clientX; // Negative deltaX increases width
    const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidthRef.current + deltaX));
    setSidebarWidth(newWidth);
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    if (!isResizing) return;
    
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    
    // Save the new width to localStorage
    try {
      localStorage.setItem('rightbar-width', sidebarWidth.toString());
    } catch {}
  }, [isResizing, sidebarWidth]);

  // Add global mouse event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Load saved width from localStorage
  useEffect(() => {
    try {
      const savedWidth = localStorage.getItem('rightbar-width');
      if (savedWidth) {
        const width = parseInt(savedWidth);
        if (width >= MIN_WIDTH && width <= MAX_WIDTH) {
          setSidebarWidth(width);
        }
      }
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

  return (
    <>
      {/* Desktop (xl+) sidebar */}
      <aside
        ref={sidebarRef}
        aria-label="Panel editor kode"
        className="h-[calc(100vh-3.5rem)] sticky top-14 w-[var(--rightbar-width)] shrink-0 overflow-y-auto border-l border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 hidden xl:block relative"
      >
        {/* Resize handle */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 cursor-col-resize bg-transparent hover:bg-blue-500/20 transition-colors z-10 ${
            isResizing ? 'bg-blue-500/30' : ''
          }`}
          onMouseDown={handleMouseDown}
          title="Drag to resize sidebar"
        >
          {/* Visible handle indicator */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gray-300 dark:bg-gray-600 rounded-r opacity-0 hover:opacity-100 transition-opacity" />
        </div>
        
        <EditorContent
          inDrawer={false}
          onIconChange={onIconChange}
          iconLabel={iconLabel}
          iconUrl={iconUrl}
          styleKind={styleKind}
          combined={combined}
          tab={tab}
          setTab={setTab}
          wrap={wrap}
          setWrap={setWrap}
          html={html}
          css={css}
          js={js}
          setHtml={setHtml}
          setCss={setCss}
          setJs={setJs}
          onCopy={copy}
          onFormatAll={formatAll}
          onReset={reset}
          onDownload={download}
        />
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
            <EditorContent
              inDrawer={true}
              onIconChange={onIconChange}
              iconLabel={iconLabel}
              iconUrl={iconUrl}
              styleKind={styleKind}
              combined={combined}
              tab={tab}
              setTab={setTab}
              wrap={wrap}
              setWrap={setWrap}
              html={html}
              css={css}
              js={js}
              setHtml={setHtml}
              setCss={setCss}
              setJs={setJs}
              onCopy={copy}
              onFormatAll={formatAll}
              onReset={reset}
              onDownload={download}
            />
          </section>
        </div>
      )}
    </>
  );
}
