import type { ComponentProps } from "@/types/page";

export function stringProp(props: ComponentProps, key: string, fallback = "") {
  const value = props[key];
  return typeof value === "string" ? value : fallback;
}

export function numberProp(props: ComponentProps, key: string, fallback: number) {
  const value = props[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function optionProp<T extends string>(
  props: ComponentProps,
  key: string,
  allowed: readonly T[],
  fallback: T
) {
  const value = props[key];
  return typeof value === "string" && allowed.includes(value as T) ? (value as T) : fallback;
}
