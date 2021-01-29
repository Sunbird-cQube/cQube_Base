import { saveAs } from 'file-saver';
import { HttpResponse } from '@angular/common/http';

/**
 * Saves a file by opening file-save-as dialog in the browser
 * using file-save library.
 * @param blobContent file content as a Blob
 * @param fileName name file should be saved as
 */
export const saveFile = (blobContent: Blob, fileName: string, mimeType: string) => {
  console.log(fileName);
    const blob = new Blob([blobContent], { type: mimeType });
    saveAs(blob, fileName);
};

/**
 * Derives file name from the http response
 * by looking inside content-disposition
 * @param res http Response
 */
export const getFileNameFromResponseContentDisposition = (res: HttpResponse<any>) => {
    const contentDisposition = res.headers.get('Content-Disposition') || '';
    const matches = /filename=([^;]+)/ig.exec(contentDisposition);
    const fileName = (matches[1] || 'untitled').replace(/\"/g, "").trim();
    return fileName;
};

/**
 * Derives mime type from the http response
 * by looking inside content-type
 * @param res http Response
 */
export const getMimeTypeFromResponseContentDisposition = (res: HttpResponse<any>) => {
    const contentType = res.headers.get('Content-Type') || '';
    const mimeType = contentType.trim();
    return mimeType;
};