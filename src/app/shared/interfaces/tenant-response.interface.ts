import { UnitResponse } from "./unit-response.interface";

export interface TenantResponse {
    id: number;
    createdAt: Date;
    firstName: string;
    lastName: string;
    cpf: string;
    email?: string;
    phone?: string;
    born?: Date;
    responsible?: TenantResponse | null;
    unit: UnitResponse;
    dependents: TenantResponse[];
}
