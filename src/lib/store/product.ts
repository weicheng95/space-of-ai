import type { Product } from "$lib/types/product";
import { writable } from "svelte/store";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const products = writable<Product[]>([]);
export const searchMode = writable<boolean>(false);
export const searchMeta = writable<any>();