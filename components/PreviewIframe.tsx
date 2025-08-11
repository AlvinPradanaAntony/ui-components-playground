"use client";
import React, { useEffect, useMemo, useState } from "react";
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
  const [loaded, setLoaded] = useState(false);
  const srcDoc = useMemo(() => buildDoc(styleKind, code), [styleKind, code]);

  useEffect(() => {
    // reset loading state whenever content changes
    setLoaded(false);
  }, [srcDoc]);

  const iframeClass =
    (className || "w-full h-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white") +
    " transition-opacity duration-200 " +
    (loaded ? "opacity-100" : "opacity-0");

  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <div className="absolute inset-0 rounded-xl border border-gray-200 dark:border-gray-800 bg-white overflow-hidden">
          <div className="h-full w-full skeleton" />
        </div>
      )}
      <iframe
        className={iframeClass}
        title={`Pratinjau komponen (style: ${styleKind})`} sandbox="allow-scripts allow-forms allow-same-origin"
        srcDoc={srcDoc}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
