
import { TenantResponse } from './tenant-response.interface';
import { FloorEnum } from './enums/floor.enum';
import { ApartmentTypeEnum } from './enums/apartment-type.enum';

export interface ApartmentResponse {
    id: number;
    createdAt: Date;
    number: string;
    rent: number;
    floor: FloorEnum;
    type: ApartmentTypeEnum;
    responsible?: TenantResponse | null;
    residents: TenantResponse[];
}

