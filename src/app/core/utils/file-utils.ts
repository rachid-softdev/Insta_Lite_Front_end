export type FileInformation = {
  fileName: string;
  fileSize: number;
  fileExtension: string;
};

// Fonction utilitaire pour récupérer les données binaires d'un fichier
export function fetchFile(url: string): Promise<ArrayBuffer> {
  return fetch(url).then((response) => response.arrayBuffer());
}

export function generateRandomFileName(prefix: string = ''): string {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2);
  return `${prefix}_${timestamp}_${randomString}`;
}

export function extractFileNameFromUrl(url: string): string {
  // Expression régulière pour extraire le nom du fichier de l'URL
  const match = url.match(/\/([^\/?#]+)[^\/]*$/);
  if (match && match[1]) {
    return match[1];
  } else {
    return generateRandomFileName();
  }
}

/**
 * Source :
 * https://stackoverflow.com/questions/190852/how-can-i-get-file-extensions-with-javascript
 */
export function getFileExtension(filename: string = '') {
  const extension = /^.+\.([^.]+)$/.exec(filename);
  return extension == null ? '' : extension[1];
}

export function formatFileSize(size: number): string {
  const units = ['octets', 'Ko', 'Mo'];
  let index = 0;
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }
  return size.toFixed(2) + ' ' + units[index];
}
