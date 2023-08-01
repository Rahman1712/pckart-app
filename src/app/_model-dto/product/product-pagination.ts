export class ProductPagination<T>{
  totalItems: number;
  listProducts: T[];
  totalPages: number;
  sortField: string;
  reverseSortDir: string;
  pageNum: number;
  sortDir: string;
  limit: number;
  startCount: number;
  endCount: number;
}

/*
{
  "totalItems": 0,
  "listProducts": [],
  "totalPages": 0,
  "sortField": "name",
  "reverseSortDir": "desc",
  "currentPage": 1,
  "sortDir": "asc"
}


*/