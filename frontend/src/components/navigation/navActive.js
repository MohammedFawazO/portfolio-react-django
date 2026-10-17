// Shared "which link is active" helper for the navbars.
// Routes are compared normalised so a trailing slash, a query string or a hash
// still resolves to the right link instead of leaving the previous page's item
// highlighted.

export function normalizePath(path) {
  if (!path) return '/'
  const trimmed = String(path).split('?')[0].split('#')[0].replace(/\/+$/, '')
  return trimmed === '' ? '/' : trimmed
}

export function findActiveIndex(items, pathname) {
  const current = normalizePath(pathname)
  return items.findIndex((item) => normalizePath(item.href) === current)
}