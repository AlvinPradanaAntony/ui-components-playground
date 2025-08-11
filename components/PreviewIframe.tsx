"use client";
import type { ComponentCode, StyleKind } from "@/types";
type Props = { styleKind: StyleKind; code: ComponentCode; className?: string };
function buildDoc(styleKind: StyleKind, code: ComponentCode) {
  const bootstrap = `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" /><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>`;
  const tailwind = `<script src="https://cdn.tailwindcss.com"></script><script>tailwind.config={theme:{extend:{}}}</script>`;
  const base = "<style>*,*:before,*:after{box-sizing:border-box}html,body{height:100%}body{padding:16px;font-family:ui-sans-serif,system-ui,Segoe UI,Roboto}</style>";
  const deps = styleKind === "bootstrap" ? bootstrap : styleKind === "tailwind" ? tailwind : "";
  const html = `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>${base}${deps}<style>${code.css || ""}</style></head><body>${code.html || ""}<script>${code.js || ""}<\/script></body></html>`;
  return html; // sandboxed iframe provides isolation; avoid sanitizing so frameworks work
}
export default function PreviewIframe({ styleKind, code, className }: Props) {
  const srcDoc = buildDoc(styleKind, code);
  // allow-same-origin lets framework runtime query document; still isolated to this iframe content
  return <iframe className={className || "w-full h-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white"} sandbox="allow-scripts allow-forms allow-same-origin" srcDoc={srcDoc} />;
}
