/**
 * It replaces all instances of &, <, >, ", and ' with their HTML entity equivalents
 * @param {string} unsafe - The string to escape
 * @returns A function that takes a unsafe string and returns a safe string
 */
export function escapeHtml (unsafe: string) {
  return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}