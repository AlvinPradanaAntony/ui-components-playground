'use client';
import { create } from "zustand";
import { Category, StyleKind, UIComponentItem } from "@/types";
import { dataSource } from "@/lib/dataSource";
type State = { categories: Category[]; components: UIComponentItem[]; styleFilter: StyleKind | 'all'; activeCategoryId: string | 'all'; loading: boolean; error?: string; loadAll: () => Promise<void>; setStyleFilter: (f: State['styleFilter']) => void; setActiveCategory: (id: State['activeCategoryId']) => void; upsertComponent: (item: UIComponentItem) => Promise<void>; };
export const usePlayground = create<State>((set, get) => ({
  categories: [], components: [], styleFilter: 'all', activeCategoryId: 'all', loading: false,
  async loadAll(){ try{ set({loading:true,error:undefined}); const [categories, components] = await Promise.all([dataSource.getCategories(), dataSource.getComponents()]); set({categories, components, loading:false}); } catch(e:any){ set({error:e?.message||'Failed loading data', loading:false}); } },
  setStyleFilter(f){ set({ styleFilter: f }); },
  setActiveCategory(id){ set({ activeCategoryId: id }); },
  async upsertComponent(item){ await dataSource.upsertComponent(item); const items = get().components.slice(); const idx = items.findIndex(c=>c.id===item.id); if(idx>=0) items[idx]=item; else items.push(item); set({ components: items }); }
}));
