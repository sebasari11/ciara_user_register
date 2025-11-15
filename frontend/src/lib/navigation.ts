/**
 * Navigation utilities for handling redirects in static sites
 * Handles URL construction correctly for production environments
 */

/**
 * Gets the base URL without port (for production)
 * Removes standard ports (80 for HTTP, 443 for HTTPS) and common proxy ports
 */
function getBaseUrl(): string {
  if (typeof window === 'undefined') return '';
  
  const { protocol, hostname, port } = window.location;
  
  // Puertos estándar que no deben incluirse en la URL
  const standardPorts = {
    'http:': ['80', ''],
    'https:': ['443', '']
  };
  
  // Si el puerto es estándar o está vacío, no incluirlo
  const isStandardPort = 
    (protocol === 'http:' && (!port || port === '80')) ||
    (protocol === 'https:' && (!port || port === '443'));
  
  if (isStandardPort) {
    return `${protocol}//${hostname}`;
  }
  
  // Para desarrollo local (localhost), incluir el puerto
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//${hostname}:${port}`;
  }
  
  // Para producción, siempre omitir el puerto (incluso si es 8080)
  // Esto asegura que las redirecciones funcionen correctamente
  // cuando hay un proxy reverso que maneja el puerto
  return `${protocol}//${hostname}`;
}

/**
 * Builds an absolute URL for navigation
 * @param path - Path relative to base (e.g., '/ciara/users')
 * @returns Absolute URL without port if it's standard
 */
export function buildUrl(path: string): string {
  const baseUrl = getBaseUrl();
  // Asegurar que el path empiece con /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

/**
 * Redirects to a path using replace (doesn't add to history)
 * Automatically handles port removal for standard ports
 * @param path - Path relative to base (e.g., '/ciara/users')
 */
export function redirectTo(path: string): void {
  if (typeof window === 'undefined') return;
  const url = buildUrl(path);
  window.location.replace(url);
}

