import { FileModel } from './file.interface';

export interface ContractModelResponse {
  file?: FileModel | null;
  params: string[];
}