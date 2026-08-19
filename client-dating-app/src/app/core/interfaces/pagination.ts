export interface Metadata {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

export interface PaginationResult<T> {
  items: T,
  metadata: Metadata
}

export interface IQuery {
  pageNumber: number;
  pageSize: number;
}
