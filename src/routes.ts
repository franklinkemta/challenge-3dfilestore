import { Router, Request, Response } from 'express';
import { listFiles, renameFile, deleteFile, downloadFile, downloadTransformedFile }
    from './controller';

const router = Router();

// Route for listing all 3D files
router.get('/files', listFiles);

// Route for renaming a file
router.put('/files/:fileId', renameFile);

// Route for deleting a file
router.delete('/files/:fileId', deleteFile);

// Route for downloading original and transformed file
router.get('/files/:fileId', async function (req: Request, res: Response) {
    if (Object.keys(req.query).length) return await downloadTransformedFile(req, res);
    await downloadFile(req, res);
});

export default router;
