export interface documentDetailsConfig {
  id: string;
  fileName: string;
  fileBlob: Blob;
  pageInfo: Record<number, string>;
}

export interface documentDetailsState extends documentDetailsConfig {
  totalPage: number;
}
