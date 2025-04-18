export interface FindUsersOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  filters: {
    username?: string;
    email?: string;
    country?: string;
  };
  search?: string;
}
