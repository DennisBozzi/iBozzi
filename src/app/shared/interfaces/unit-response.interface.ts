
import { TenantResponse } from './tenant-response.interface';
import { FloorEnum } from './enums/floor.enum';
import { UnitType } from './enums/unit-type.enum';

export interface UnitResponse {
    id: number;
    createdAt: Date;
    number: string;
    rent: number;
    floor: FloorEnum;
    type: UnitType;
    responsible?: TenantResponse | null;
}

