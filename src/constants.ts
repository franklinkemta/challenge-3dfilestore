/**
 * The path where downloaded 3D object files are stored.
 * This avoids the need to repeatedly access remote files.
 */
export const FILES_STORE_PATH = './files-store/';

/**
 * Chunk size for reading 3D OBJ files line by line, set to 8 kilobytes (KB).
 * This ensures low memory usage and can be adjusted for faster file loading.
 * Increasing this value will speed up the processing of a 3D object but will increase memory usage.
 */
export const FILE_READ_CHUNK_SIZE = 8 * 1024;

/**
 * URL for the test 3D object file 'buggy.obj'.
 * Used as a placeholder for remote 3D objects.
 */
export const REMOTE_3D_OBJECT_PLACEHOLDER_URL = 'https://storage.googleapis.com/corp-dev-challenge-3dfilestore-assets/buggy.obj';
