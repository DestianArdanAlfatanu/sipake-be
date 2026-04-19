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

/**
 * Resolve the actual media filename for a given code (e.g., 'GE01', 'GS01').
 * Checks for video (.mp4, .webm), audio (.mp3, .wav, .ogg), and animation (.gif)
 * files in the specified subdirectory of public/media/.
 * 
 * @param code - The media code/ID (e.g., 'GE01', 'GS01')
 * @param subDir - Subdirectory under public/media/ (e.g., 'symptoms')
 * @returns Object with filename and type, or null if not found
 */
export function resolveMediaFilename(code: string, subDir: string): { filename: string; type: 'video' | 'audio' | 'gif' } | null {
    const mediaExtensions = [
        { ext: '.mp4', type: 'video' as const },
        { ext: '.webm', type: 'video' as const },
        { ext: '.gif', type: 'gif' as const },
        { ext: '.mp3', type: 'audio' as const },
        { ext: '.wav', type: 'audio' as const },
        { ext: '.ogg', type: 'audio' as const },
    ];
    const basePath = join(__dirname, '..', '..', '..', 'public', 'media', subDir);

    for (const { ext, type } of mediaExtensions) {
        const filePath = join(basePath, `${code}${ext}`);
        if (existsSync(filePath)) {
            return { filename: `${code}${ext}`, type };
        }
    }

    return null;
}
