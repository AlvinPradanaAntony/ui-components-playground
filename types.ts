export type StyleKind = 'native' | 'bootstrap' | 'tailwind';
export interface ComponentCode { html: string; css: string; js: string; }
export interface ComponentPropsMap { width?: string; height?: string; padding?: string; radius?: string; shadow?: string; fontSize?: string; color?: string; contentText?: string; }
export interface UIComponentItem { id: string; name: string; slug: string; categoryId: string; style: StyleKind; tags: string[]; code: ComponentCode; props: ComponentPropsMap; previewThumbUrl?: string; createdAt?: number; updatedAt?: number; isDraft?: boolean; isFeatured?: boolean; }
export interface Category { id: string; name: string; slug: string; thumbUrl?: string; createdAt?: number; updatedAt?: number; }
