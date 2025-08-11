"use client";
import { seedCategories, seedComponents } from "@/data/seed";
import { Category, UIComponentItem } from "@/types";
const hasFirebaseEnv = process.env.NEXT_PUBLIC_USE_FIREBASE !== "false" && Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
export type DataSource = { useFirebase: boolean; getCategories: () => Promise<Category[]>; getComponents: () => Promise<UIComponentItem[]>; getComponentById: (id: string) => Promise<UIComponentItem | undefined>; upsertComponent: (item: UIComponentItem) => Promise<void> };
let memoryComponents = [...seedComponents];
const localSource: DataSource = {
  useFirebase: false,
  async getCategories() {
    return seedCategories;
  },
  async getComponents() {
    return memoryComponents;
  },
  async getComponentById(id) {
    return memoryComponents.find((c) => c.id === id);
  },
  async upsertComponent(item) {
    const i = memoryComponents.findIndex((c) => c.id === item.id);
    if (i >= 0) memoryComponents[i] = item;
    else memoryComponents.push(item);
  },
};
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
const firebaseSource: DataSource = {
  useFirebase: true,
  async getCategories() {
    try {
      const snap = await getDocs(collection(db, "categories"));
      if (snap.empty) return seedCategories;
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    } catch (e: any) {
      if (process.env.NODE_ENV !== "production") console.warn("Firestore getCategories failed, falling back to seed:", e?.message || e);
      return seedCategories;
    }
  },
  async getComponents() {
    try {
      const snap = await getDocs(collection(db, "components"));
      if (snap.empty) return seedComponents;
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    } catch (e: any) {
      if (process.env.NODE_ENV !== "production") console.warn("Firestore getComponents failed, falling back to seed:", e?.message || e);
      return seedComponents;
    }
  },
  async getComponentById(id) {
    try {
      const ref = doc(db, "components", id);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        // Fallback search in local seed in case reads are blocked
        return seedComponents.find((c) => c.id === id);
      }
      return { id: snap.id, ...(snap.data() as any) };
    } catch (e: any) {
      if (process.env.NODE_ENV !== "production") console.warn("Firestore getComponentById failed, falling back to seed:", e?.message || e);
      return seedComponents.find((c) => c.id === id);
    }
  },
  async upsertComponent(item) {
    try {
      const ref = doc(db, "components", item.id);
      await setDoc(ref, item, { merge: true });
    } catch (e: any) {
      if (process.env.NODE_ENV !== "production") console.warn("Firestore upsertComponent failed (write likely blocked by rules). UI state will still update locally:", e?.message || e);
      // No throw: keep UI responsive even if Firestore write is blocked
    }
  },
};
export const dataSource: DataSource = hasFirebaseEnv ? firebaseSource : localSource;
