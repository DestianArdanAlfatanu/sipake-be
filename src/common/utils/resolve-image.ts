import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Resolve the actual image filename for a given code (e.g., 'GE01', 'PS01').
 * Checks for common image extensions (.jpg, .jpeg, .png, .webp) in the specified
 * subdirectory of public/images/.
 * 
 * @param code - The image code/ID (e.g., 'GE01', 'PS01', 'GS01')
 * @param subDir - Subdirectory under public/images/ (e.g., 'symptoms', 'problems')
 * @returns The filename with extension if found (e.g., 'GS01.jpg'), or null if not found
 */
export function resolveImageFilename(code: string, subDir: string): string | null {
    const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const basePath = join(__dirname, '..', '..', '..', 'public', 'images', subDir);

    for (const ext of extensions) {
        const filePath = join(basePath, `${code}${ext}`);
        if (existsSync(filePath)) {
            return `${code}${ext}`;
        }
    }

    return null;
}
