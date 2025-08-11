"use client";
import { seedCategories, seedComponents } from "@/data/seed";
import { Category, UIComponentItem } from "@/types";
const hasFirebaseEnv = process.env.NEXT_PUBLIC_USE_FIREBASE !== "false" && Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
export type DataSource = {
  useFirebase: boolean;
  // read
  getCategories: () => Promise<Category[]>;
  getComponents: () => Promise<UIComponentItem[]>;
  getComponentById: (id: string) => Promise<UIComponentItem | undefined>;
  // write components
  upsertComponent: (item: UIComponentItem) => Promise<void>;
  deleteComponent: (id: string) => Promise<void>;
  // write categories
  upsertCategory: (cat: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
};
let memoryCategories: Category[] = [...seedCategories];
let memoryComponents = [...seedComponents];
const localSource: DataSource = {
  useFirebase: false,
  async getCategories() {
    return memoryCategories;
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
  async deleteComponent(id) {
    memoryComponents = memoryComponents.filter((c) => c.id !== id);
  },
  async upsertCategory(cat) {
    const i = memoryCategories.findIndex((c) => c.id === cat.id);
    if (i >= 0) memoryCategories[i] = cat;
    else memoryCategories.push(cat);
  },
  async deleteCategory(id) {
    memoryCategories = memoryCategories.filter((c) => c.id !== id);
    // also unlink components in this category (optional: delete or mark)
    memoryComponents = memoryComponents.filter((c) => c.categoryId !== id);
  },
};
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
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
  async deleteComponent(id) {
    try {
      await deleteDoc(doc(db, "components", id));
    } catch (e: any) {
      if (process.env.NODE_ENV !== "production") console.warn("Firestore deleteComponent failed:", e?.message || e);
    }
  },
  async upsertCategory(cat) {
    try {
      const ref = doc(db, "categories", cat.id);
      await setDoc(ref, cat, { merge: true });
    } catch (e: any) {
      if (process.env.NODE_ENV !== "production") console.warn("Firestore upsertCategory failed:", e?.message || e);
    }
  },
  async deleteCategory(id) {
    try {
      await deleteDoc(doc(db, "categories", id));
    } catch (e: any) {
      if (process.env.NODE_ENV !== "production") console.warn("Firestore deleteCategory failed:", e?.message || e);
    }
  },
};
export const dataSource: DataSource = hasFirebaseEnv ? firebaseSource : localSource;
