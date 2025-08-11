"use client";
import dynamic from "next/dynamic";
import { useMemo } from "react";
const Monaco = dynamic(() => import("@monaco-editor/react"), { ssr: false });
type Props = { language: "html" | "css" | "javascript"; value: string; onChange: (v: string) => void; height?: string | number; wrap?: boolean };
export default function CodeEditor({ language, value, onChange, height = 260, wrap = true }: Props) {
  const options = useMemo(() => ({ minimap: { enabled: false }, scrollBeyondLastLine: false, fontSize: 13, roundedSelection: true, automaticLayout: true, tabSize: 2, wordWrap: wrap ? "on" : "off", wrappingIndent: "same" }), [wrap]);
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <Monaco height={height} language={language} value={value} onChange={(v) => onChange(v || "")} options={options as any} />
    </div>
  );
}
