export interface PagedRequest {
  page: number;
  size: number;
  sortField?: string;
  sortDirection?: string;
  searchValue?: string;
  searchId?: string;
  searchNumber?: string;
}

export function buildPagedParams(dto: PagedRequest) {
  return {
    page: dto.page,
    size: dto.size,
    sortField: dto.sortField,
    sortDirection: dto.sortDirection,
    searchValue: dto.searchValue,
    searchId: dto.searchId,
    searchNumber: dto.searchNumber,
  };
}

export const sizeOptions = [5, 10, 20, 50];

export const sortDirections = [
  { value: "asc", label: "Asc" },
  { value: "desc", label: "Des" },
];