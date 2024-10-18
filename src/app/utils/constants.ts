export const IMAGE_SIZE = {
  SMALL: 50,
  MEDIUM: 75,
  LARGE: 100,
  EXTRA_LARGE: 150,
}

export const CHART_SIZE = {
  SMALL: 100,
  MEDIUM: 150,
  LARGE: 180,
  EXTRA_LARGE: 200,
}

export const TYPE_OF_QUESTION = {
  RESPUESTA_CORTA: 'RESPUESTA_CORTA',
  PARRAFO: 'PARRAFO',
  MULTIPLE_SELECCION: 'MULTIPLE_SELECCION',
  UNICA_SELECCION: 'UNICA_SELECCION',
  ARCHIVO: 'ARCHIVO',
  FECHA: 'FECHA',
  HORA: 'HORA',
  ESCALA: 'ESCALA'
}

export const ICON_GENERAL_FILE: string = 'general_file.png';

export const ICONS_OF_FILE_TYPE_BY_EXTENSION: any = {
  // Imágenes
  jpg: 'general_image.png',
  jpeg: 'general_image.png',
  png: 'general_image.png',
  gif: 'general_image.png',
  tiff: 'general_image.png',
  tif: 'general_image.png',
  bmp: 'general_image.png',
  webp: 'general_image.png',
  svg: 'general_image.png',

  // Documentos
  doc: 'word.png',
  docx: 'word.png',
  odt: 'general_document.png',

  // Hojas de cálculo
  xls: 'excel.png',
  xlsx: 'excel.png',
  csv: 'general_spreadsheet.png',
  xlsm: 'general_spreadsheet.png',
  ods: 'general_spreadsheet.png',

  // Presentaciones
  ppt: 'powerpoint.png',
  pptx: 'powerpoint.png',
  pps: 'general_presentation.png',
  ppsx: 'general_presentation.png',

  // PDF
  pdf: 'pdf.png',

  // Texto
  txt: 'txt.png',
  md: 'general_text.png',
  json: 'general_text.png',
  xml: 'general_text.png',
  html: 'general_text.png',
  css: 'general_text.png',
  js: 'general_text.png',

  // Comprimidos
  zip: 'zip.png',
  rar: 'rar.png',
  tar: 'zip.png',
  gz: 'zip.png',
  '7z': 'zip.png',

  // Multimedia
  mp3: 'audio.png',
  wav: 'audio.png',
  ogg: 'audio.png',
  aac: 'audio.png',
  mp4: 'video.png',
  avi: 'video.png',
  mkv: 'video.png',
  ogv: 'video.png',
  webm: 'video.png',

  // Binarios
  bin: 'general_file.png',

  // Otros
  swf: 'general_file.png',
  ttf: 'general_file.png',
  otf: 'general_file.png',
  woff: 'general_file.png',
  woff2: 'general_file.png',
  config: 'general_file.png',
  env: 'general_file.png'
};

export const MIMETYPE_TO_EXTENSION: any = {
  // Texto
  'text/plain': 'txt',
  'text/html': 'html',
  'text/css': 'css',
  'text/csv': 'csv',
  'text/javascript': 'js',
  'application/javascript': 'js',
  'application/json': 'json',
  'text/xml': 'xml',
  'application/xml': 'xml',
  'text/markdown': 'md',
  
  // Imágenes
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/bmp': 'bmp',
  'image/svg+xml': 'svg',
  'image/tiff': 'tif',
  'image/vnd.microsoft.icon': 'ico',

  // Documentos
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'application/vnd.oasis.opendocument.text': 'odt',
  'application/vnd.oasis.opendocument.spreadsheet': 'ods',
  
  // Archivos comprimidos
  'application/zip': 'zip',
  'application/x-zip-compressed': 'zip',
  'application/gzip': 'gz',
  'application/x-rar-compressed': 'rar',
  'application/x-compressed': 'rar',
  'application/x-tar': 'tar',
  'application/x-7z-compressed': '7z',
  
  // Multimedia
  'audio/mpeg': 'mp3',
  'audio/wav': 'wav',
  'audio/ogg': 'ogg',
  'audio/aac': 'aac',
  'video/mp4': 'mp4',
  'video/x-msvideo': 'avi',
  'video/x-matroska': 'mkv',
  'video/ogg': 'ogv',
  'video/webm': 'webm',

  // Otros
  'application/octet-stream': 'bin', 
  'application/x-www-form-urlencoded': null, 
  'application/x-shockwave-flash': 'swf',
  'application/x-font-ttf': 'ttf',
  'application/x-font-opentype': 'otf',
  'application/x-font-woff': 'woff',
  'application/x-font-woff2': 'woff2',
  'application/x-javascript': 'js',
  
  // Archivos de configuración
  'application/config': 'config',
  'application/x-env': 'env',

  // Otros formatos
  'application/vnd.api+json': 'jsonapi',
  'application/vnd.ms-cab-compressed': 'cab',
  'application/vnd.apple.mpegurl': 'm3u8',
};