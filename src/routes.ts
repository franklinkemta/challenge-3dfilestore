import express from 'express';
import { listFiles, renameFile, deleteFile, downloadFile, downloadTransformedFile }
    from './controller';

const router = express.Router();

// Route for listing all 3D files
router.get('/files', listFiles);

// Route for renaming a file
router.put('/files/:fileId', renameFile);

// Route for deleting a file
router.delete('/files/:fileId', deleteFile);

// Route for downloading original file
router.get('/files/:fileId/download', downloadFile);

// Route for downloading transformed file
router.get('/files/:fileId/download-transformed', downloadTransformedFile);

export default router;
