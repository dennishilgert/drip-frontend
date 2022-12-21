/**
 * It takes a full path, and returns only the name of the file
 * @param {string} path - The path to the file.
 * @returns The file name of the path.
 */
export function extractFileName (path: string): string {
  return path.replace(/^.*[\\/]/, '')
}