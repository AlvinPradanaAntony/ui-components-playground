'use client';
import clsx from "clsx";
import { usePlayground } from "@/store/usePlayground";
const tabs = [{key:'all',label:'All'},{key:'native',label:'Native CSS'},{key:'bootstrap',label:'Bootstrap 5'},{key:'tailwind',label:'Tailwind CSS'}] as const;
export default function FilterTabs(){
  const { styleFilter, setStyleFilter } = usePlayground();
  return (<div className="inline-flex rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
    {tabs.map(t => (<button key={t.key} className={clsx("px-3 py-1.5 text-sm", styleFilter===t.key ? "bg-gray-100 dark:bg-gray-800":"")} onClick={()=>setStyleFilter(t.key as any)}>{t.label}</button>))}
  </div>);
}
