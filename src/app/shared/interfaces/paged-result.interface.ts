export interface PagedResult<T> {
    items: T[];
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}
