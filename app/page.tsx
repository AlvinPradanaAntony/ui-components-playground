'use client';
import { useEffect } from "react"; import LeftSidebar from "@/components/LeftSidebar"; import FilterTabs from "@/components/FilterTabs"; import ComponentGrid from "@/components/ComponentGrid"; import FAB from "@/components/FAB"; import { usePlayground } from "@/store/usePlayground";
export default function HomePage(){ const { loadAll } = usePlayground(); useEffect(()=>{ loadAll(); },[]);
  return (<div className="flex"><LeftSidebar /><main className="flex-1 min-h-screen p-4 md:p-6"><header className="flex items-center justify-between mb-4"><div><h1 className="text-xl font-semibold">UI Components Playground</h1><p className="text-sm text-gray-500">Filter berdasarkan style</p></div><FilterTabs /></header><ComponentGrid /></main><FAB /></div>);
}
