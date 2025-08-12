"use client";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
const Monaco = dynamic(() => import("@monaco-editor/react"), { ssr: false });
type Props = { language: "html" | "css" | "javascript"; value: string; onChange: (v: string) => void; height?: string | number; wrap?: boolean };
export default function CodeEditor({ language, value, onChange, height = 260, wrap = true }: Props) {
  const [theme, setTheme] = useState<string | undefined>(undefined);

  // Observe attribute changes on html[data-theme]
  useEffect(() => {
    const update = () => {
      const t = document.documentElement.getAttribute("data-theme");
      setTheme(t === "dark" ? "vs-dark" : "light");
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const options = useMemo(
    () => ({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 13,
      roundedSelection: true,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: wrap ? "on" : "off",
      wrappingIndent: "same",
      theme: theme,
    }),
    [wrap, theme]
  );
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-surface-100">
      <Monaco height={height} language={language} value={value} onChange={(v) => onChange(v || "")} theme={theme} options={options as any} />
    </div>
  );
}
