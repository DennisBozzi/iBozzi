import { ApartmentResponse } from "./apartment-response.interface";

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
    apartment: ApartmentResponse;
    dependents: TenantResponse[];
}
