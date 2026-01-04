import { FileModel } from './file.interface';
import { TenantResponse } from './tenant-response.interface';
import { UnitResponse } from './unit-response.interface';
import { StatusContract } from './enums/status-contract.enum';

export interface ContractResponse {
    id: number;
    createdAt: Date;
    validSince: Date;
    validUntil: Date;
    paymentDay: number;
    status: StatusContract;
    file?: FileModel | null;
    tenant?: TenantResponse | null;
    unit?: UnitResponse | null;
    rent: number;
}
