export enum FileTypes {
  'html' = 'html',
  'xml' = 'xml',
  'pdf' = 'pdf',
  'doc' = 'doc',
  'xls' = 'xls',
  'ppt' = 'ppt',
  'odt' = 'odt',
  'ods' = 'ods',
  'odp' = 'odp',
}

export type FileType = keyof typeof FileTypes;
