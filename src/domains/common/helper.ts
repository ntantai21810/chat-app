export interface IQueryOption {
  paginate: IPaginate;
}

export interface IPaginate {
  page: number;
  pageSize: number;
}

export interface IFile {
  name: string;
  size: number;
  type: string;
  data: string;
}
