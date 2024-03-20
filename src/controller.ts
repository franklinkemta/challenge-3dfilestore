/**
 * This module provides functions for handling 3D files in various formats,
 * primarily focusing on the OBJ format for now.
 */

import { Request, Response } from 'express';
import { getObjFile, transformObjFile } from './utils';

/**
 * Load and transform a 3D file.
 * @param fileId The ID of the file to transform.
 * @param scale The scale vector for transformation.
 * @param translation The translation vector for transformation.
 * @param res The response object to stream the transformed file.
 */
const loadAndTransformFile = async (fileId: string, scale: number[], translation: number[], res: Response) => {
    try {
        const [filePath, fileFormat] = await getObjFile(fileId);

        // Handle different file formats, currently only supporting OBJ
        switch (fileFormat) {
            case 'obj':
                await transformObjFile(filePath, scale, translation, res);
                break;
            default:
                console.error('Unsupported file format');
                res.status(500).send('Unsupported file format');
                break;
        }

    } catch (error) {
        console.error('Error transforming file:', error);
        res.status(500).send('Failed to transform file');
    }
}


/**
 * Endpoint to download an original 3D file.
 * @param req The request object containing the file ID.
 * @param res The response object for streaming the file.
 */
export const downloadFile = async (req: Request, res: Response) => {
    // Logic to download an original 3D file
    const fileId = req.params.fileId;
    const format = 'obj';
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${fileId}.${format}"`);
    res.sendStatus(200);
};

/**
 * Endpoint for downloading a transformed file.
 * @param req The request object containing parameters.
 * @param res The response object for streaming the file.
 */
export const downloadTransformedFile = async (req: Request, res: Response) => {
    try {
        const fileId = req.params.fileId;
        const scale = Array.isArray(req.query.scale) ? req.query.scale.map(Number) : [1, 1, 1];
        const translation = Array.isArray(req.query.translation) ? req.query.translation.map(Number) : [0, 0, 0];

        console.info(`File transformation started for file id: ${fileId}`);

        // Set response headers for progressive streaming
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${fileId}-transformed.obj"`);
        res.setHeader('Transfer-Encoding', 'chunked');

        await loadAndTransformFile(fileId, scale, translation, res);

        console.info(`File transformation ended for file id: ${fileId}`);

    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to transform and download file');
    }
};

/**
 * Endpoint to list all available 3D files.
 * @param req The request object.
 * @param res The response object to send the list of files.
 */
export const listFiles = (req: Request, res: Response) => {
    // Logic to list all 3D files
    res.json({ files_list: [] });
};

/**
 * Endpoint to rename a 3D file.
 * @param req The request object containing file ID and new name.
 * @param res The response object to send the updated file information.
 */
export const renameFile = (req: Request, res: Response) => {
    // Logic to rename a file
    const fileId = req.params.fileId;
    const newName = req.body.newName;
    res.json({ fileId, name: newName })
};

/**
 * Endpoint to delete a 3D file.
 * @param req The request object containing the file ID to delete.
 * @param res The response object to send the status of the deletion.
 */
export const deleteFile = (req: Request, res: Response) => {
    // Logic to delete a file
    const fileId = req.params.fileId;
    console.info(`File ${fileId} has been deleted`)
    res.sendStatus(200);
};

