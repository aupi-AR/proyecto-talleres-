// Rutas de navegación
import { Href } from "expo-router";

export const ROUTES = {
  HOME: "/",
  CATEGORIA: "/categorias/[nombre]",
  MARCA: "/marcas/[nombre]",
  ETIQUETA: "/etiquetas/[nombre]",
  FICHA: "/ficha/[id]",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
type RouteParams = Record<string, string | number | boolean | undefined>;

export const buildRoute = (route: AppRoute, params?: RouteParams): Href => {
  if (!params) {
    return route as Href;
  }
  return { pathname: route, params } as Href;
};

export function fichaShowRoute(id: string) {
  return buildRoute(ROUTES.FICHA, { id });
}

export function categoriaShowRoute(nombre: string) {
  return buildRoute(ROUTES.CATEGORIA, { nombre });
}

export function marcaShowRoute(nombre: string) {
  return buildRoute(ROUTES.MARCA, { nombre });
}

export function etiquetaShowRoute(nombre: string) {
  return buildRoute(ROUTES.ETIQUETA, { nombre });
}
