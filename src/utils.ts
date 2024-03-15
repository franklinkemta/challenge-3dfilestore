import fs from 'fs';
import axios from 'axios';
import readline from 'readline';
import { Response } from 'express';

import { FILES_STORE_PATH, REMOTE_3D_OBJECT_PLACEHOLDER_URL, FILE_READ_CHUNK_SIZE } from './constants';

/**
 * Function to multiply each element of a vertex array by the corresponding element of scaleArr
 * @param vertex The vertex array
 * @param scale The scale array
 * @returns The transformed vertex array
 */
export function multiplyArray(vertex: number[], scale: number[]): number[] {
    return [vertex[0] * scale[0], vertex[1] * scale[1], vertex[2] * scale[2]];
}

/**
 * Function to add the translation vector to each element of the vertex array
 * @param vertex The vertex array
 * @param translation The translation vector array
 * @returns The translated vertex array
 */
export function addArrays(vertex: number[], translation: number[]): number[] {
    return [vertex[0] + translation[0], vertex[1] + translation[1], vertex[2] + translation[2]];
}

/**
 * Function to ensure that a folder exists synchronously
 * @param folderPath The path of the folder to ensure exists
 */
export function ensureFolderExistsSync(folderPath: string): void {
    try {
        fs.mkdirSync(folderPath, { recursive: true });
        console.info(`Checked folder: ${folderPath}`);
    } catch (err: any) {
        // Silent if the folder already exists
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }
}

/**
 * Function to download a remote file progressively
 * @param remoteUrl The URL of the remote file to download
 * @param filePath The local file path to save the downloaded file
 * @returns A promise that resolves when the download is complete
 */
export async function downloadFile(remoteUrl: string, filePath: string): Promise<void> {
    const response = await axios.get(remoteUrl, { responseType: 'stream' });
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

/**
 * Function to get the file path of a 3D object using its ID and download the object if not found locally
 * @param fileId The ID of the 3D object
 * @returns A promise resolving to an array containing the file path and the file format
 */
export async function getObjFile(fileId: string): Promise<[string, string]> {
    const fileFormat = 'obj';
    const filePath = `${FILES_STORE_PATH}${fileId}.${fileFormat}`;
    if (!fs.existsSync(filePath)) {
        console.log(`File id: ${fileId} does not exist locally. Downloading...`);
        const remoteFileIdUrl = REMOTE_3D_OBJECT_PLACEHOLDER_URL; // Use a placeholder buggy source
        await downloadFile(remoteFileIdUrl, filePath);
        console.log(`File id: ${fileId} downloaded successfully from ${remoteFileIdUrl}`);
    }
    return [filePath, fileFormat];
}

/**
 * Function to process each line of an OBJ file
 * @param line The line to process
 * @param scale The scale array
 * @param translation The translation vector array
 * @param res The Express response object to write transformed lines
 */
export function processObjLine(line: string, scale: number[], translation: number[], res: Response): void {
    const vertexRegex = /^v\s+([-+]?\d+\.\d+)\s+([-+]?\d+\.\d+)\s+([-+]?\d+\.\d+)/;
    const vertexMatch = line.match(vertexRegex);
    if (vertexMatch) {
        const x = parseFloat(vertexMatch[1]);
        const y = parseFloat(vertexMatch[2]);
        const z = parseFloat(vertexMatch[3]);
        const vertex = [x, y, z];
        const transformedVertex = addArrays(multiplyArray(vertex, scale), translation);
        const transformedLine = `v ${transformedVertex[0]} ${transformedVertex[1]} ${transformedVertex[2]}`;
        res.write(transformedLine + '\n'); // Write the transformed line to the response
    } else {
        // If the line doesn't match the vertex format, write it unchanged
        res.write(line + '\n');
    }
}

/**
 * Function to process an OBJ file and transform it
 * @param filePath The file path of the OBJ file to transform
 * @param scale The scale array
 * @param translation The translation vector array
 * @param res The Express response object to write transformed lines
 */
export async function transformObjFile(filePath: string, scale: number[], translation: number[], res: Response): Promise<void> {
    // Create a read stream
    const fileStream = fs.createReadStream(filePath, { highWaterMark: FILE_READ_CHUNK_SIZE });

    // Create a readline interface
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    // Process each line of the OBJ file
    for await (const line of rl) {
        processObjLine(line, scale, translation, res);
    }

    // Close the response stream when all lines have been read
    res.end();
}
