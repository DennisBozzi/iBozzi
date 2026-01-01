import { FileType } from './enums/file-type.enum';

export interface FileModel {
  id: number;
  createdAt: string;
  idStorage: string;
  url: string;
  fileName: string;
  contentType?: string | null;
  fileSize: number;
  type: FileType;
}
