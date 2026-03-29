export interface ApiResponse<T>{
code:string;
message:string;
data: T;
errors:string[];
timestamp:string;
traceId:string;
version: string;
}

export interface ApiResponsePaginated<T> {
  code: number;
  message: string;
  data: {
    content: T[];
    totalPages: number;
    totalElements: number;
    last: boolean;
    first: boolean;
    size: number;
    number: number;
  };
  timestamp: string;
  traceId: string;
  version: string;
}

export interface ApiError {
  title: string;
  description: string;
}