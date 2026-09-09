const configuredBasePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH ?? '');

export const stableRoutes = {
  home: { es: '/', en: '/en/' },
  services: { es: '/servicios/', en: '/en/services/' },
  projects: { es: '/proyectos/', en: '/en/work/' },
  studio: { es: '/estudio/', en: '/en/about/' },
  founder: {
    es: '/estudio/samuel-furlanich/',
    en: '/en/about/samuel-furlanich/',
  },
} as const;

export function appUrl(route: string): string {
  return `.${normalizeRoute(route)}`;
}

export function appPathname(route: string): string {
  return `${configuredBasePath}${normalizeRoute(route)}`;
}

export function normalizeBasePath(value: string): string {
  const trimmed = value.trim();
  if (!trimmed || trimmed === '/') return '';
  return `/${trimmed.replace(/^\/+|\/+$/g, '')}`;
}

function normalizeRoute(route: string): string {
  const pathname = route.startsWith('/') ? route : `/${route}`;
  return pathname === '/' || pathname.endsWith('/') ? pathname : `${pathname}/`;
}
