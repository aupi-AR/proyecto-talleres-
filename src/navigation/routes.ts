import { Href } from "expo-router";

export const ROUTES = {
  HOME: "/",
  BUSCAR: "/buscar",
  FAVORITOS: "/favoritos",
  CATEGORIA: "/categorias/[nombre]",
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
