"use client";
import React, { useEffect, useRef, useState } from "react";
import type { ComponentCode, StyleKind } from "@/types";

type Props = { styleKind: StyleKind; code: ComponentCode; className?: string };

function buildInitialDoc(styleKind: StyleKind) {
  const bootstrap = `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" /><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>`;
  const tailwind = `<script src="https://cdn.tailwindcss.com"></script><script>tailwind.config={theme:{extend:{}}}</script>`;
  const base = "<style>*,*:before,*:after{box-sizing:border-box}html,body{height:100%}body{padding:16px;font-family:ui-sans-serif,system-ui,Segoe UI,Roboto}</style>";
  const deps = styleKind === "bootstrap" ? bootstrap : styleKind === "tailwind" ? tailwind : "";
  
  // Create initial HTML with message listener for real-time updates
  // The body will be directly replaced with user's HTML content
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  ${base}
  ${deps}
  <style id="user-css"></style>
  <script>
    // Global message handler that persists in head
    let currentUserScript = null;
    
    function updateContent(html, css, js) {
      // Update CSS
      const cssElement = document.getElementById('user-css');
      if (cssElement) {
        cssElement.textContent = css || '';
      }
      
      // Update body content directly with user's HTML
      document.body.innerHTML = html || '';
      
      // Remove previous user script if exists
      if (currentUserScript) {
        currentUserScript.remove();
        currentUserScript = null;
      }
      
      // Execute user's JavaScript
      if (js && js.trim()) {
        try {
          currentUserScript = document.createElement('script');
          currentUserScript.textContent = js;
          document.body.appendChild(currentUserScript);
        } catch (e) {
          console.error('JavaScript execution error:', e);
        }
      }
    }
    
    // Listen for messages from parent window
    window.addEventListener('message', function(event) {
      if (event.data && event.data.type === 'UPDATE_CODE') {
        const { html, css, js } = event.data.code;
        updateContent(html, css, js);
      }
    });
    
    // Notify parent that iframe is ready
    document.addEventListener('DOMContentLoaded', function() {
      window.parent.postMessage({ type: 'IFRAME_READY' }, '*');
    });
  </script>
</head>
<body>
  <!-- User's HTML content will be inserted here -->
</body>
</html>`;
  
  return html;
}

export default function PreviewIframe({ styleKind, code, className }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const currentStyleKind = useRef(styleKind);

  // Build initial document only when styleKind changes
  const srcDoc = React.useMemo(() => {
    currentStyleKind.current = styleKind;
    setReady(false); // Reset ready state when styleKind changes
    return buildInitialDoc(styleKind);
  }, [styleKind]);

  // Listen for iframe ready message
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'IFRAME_READY') {
        setReady(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Send code updates to iframe when ready and code changes
  useEffect(() => {
    if (ready && iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'UPDATE_CODE',
        code: code
      }, '*');
    }
  }, [ready, code]);

  // Reset ready state when srcDoc changes (styleKind change)
  useEffect(() => {
    setReady(false);
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
        ref={iframeRef}
        className={iframeClass}
        title={`Pratinjau komponen (style: ${styleKind})`}
        sandbox="allow-scripts allow-forms"
        srcDoc={srcDoc}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
