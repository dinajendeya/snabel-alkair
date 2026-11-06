export interface PaginationParams {
  page?: number | string;
  limit?: number | string;
}

export interface PaginationResult {
  skip: number;
  take: number;
  page: number;
  limit: number;
}

export function parsePagination(params: PaginationParams, defaultLimit: number = 20, maxLimit: number = 100): PaginationResult {
  const page = Math.max(1, parseInt(String(params.page || '1'), 10) || 1);
  const requestedLimit = parseInt(String(params.limit || defaultLimit), 10) || defaultLimit;
  const limit = Math.min(Math.max(1, requestedLimit), maxLimit);
  const skip = (page - 1) * limit;

  return {
    skip,
    take: limit,
    page,
    limit,
  };
}

