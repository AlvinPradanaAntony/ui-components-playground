"use client";
import { create } from "zustand";
import { Category, StyleKind, UIComponentItem } from "@/types";
import { dataSource } from "@/lib/dataSource";
type State = {
  categories: Category[];
  components: UIComponentItem[];
  styleFilter: StyleKind | "all";
  activeCategoryId: string | "all";
  query: string;
  loading: boolean;
  error?: string;
  // load
  loadAll: () => Promise<void>;
  // filters
  setStyleFilter: (f: State["styleFilter"]) => void;
  setActiveCategory: (id: State["activeCategoryId"]) => void;
  setQuery: (q: string) => void;
  // components
  upsertComponent: (item: UIComponentItem) => Promise<void>;
  deleteComponent: (id: string) => Promise<void>;
  // categories
  upsertCategory: (cat: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
};
export const usePlayground = create<State>((set, get) => ({
  categories: [],
  components: [],
  styleFilter: "all",
  activeCategoryId: "all",
  query: "",
  loading: false,
  async loadAll() {
    try {
      set({ loading: true, error: undefined });
      const [categories, components] = await Promise.all([dataSource.getCategories(), dataSource.getComponents()]);
      set({ categories, components, loading: false });
    } catch (e: any) {
      set({ error: e?.message || "Failed loading data", loading: false });
    }
  },
  setStyleFilter(f) {
    set({ styleFilter: f });
  },
  setActiveCategory(id) {
    set({ activeCategoryId: id });
  },
  setQuery(q) {
    set({ query: q });
  },
  async upsertComponent(item) {
    await dataSource.upsertComponent(item);
    const items = get().components.slice();
    const idx = items.findIndex((c) => c.id === item.id);
    if (idx >= 0) items[idx] = item;
    else items.push(item);
    set({ components: items });
  },
  async deleteComponent(id) {
    await dataSource.deleteComponent(id);
    set({ components: get().components.filter((c) => c.id !== id) });
  },
  async upsertCategory(cat) {
    await dataSource.upsertCategory(cat);
    const cats = get().categories.slice();
    const idx = cats.findIndex((c) => c.id === cat.id);
    if (idx >= 0) cats[idx] = cat;
    else cats.push(cat);
    set({ categories: cats });
  },
  async deleteCategory(id) {
    await dataSource.deleteCategory(id);
    set({ categories: get().categories.filter((c) => c.id !== id), components: get().components.filter((c) => c.categoryId !== id), activeCategoryId: get().activeCategoryId === id ? "all" : get().activeCategoryId });
  },
}));
