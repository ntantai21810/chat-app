export interface IQueryOption {
  paginate: IPaginate;
}

export interface IPaginate {
  page: number;
  pageSize: number;
}
