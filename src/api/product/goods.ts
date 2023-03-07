import axios from 'axios';
import qs from 'query-string';
import {HttpResponse, PaginationRes} from '@/types/global';

export interface ProductRecord {
  id: string;
  skuCode: string;
  spuCode: string;
  skuName: string;
  brandCode: string;
  categoryCode: string;
  retailPrice: string;
  quantity: string;
  status: string;
}

export interface ProductParams extends Partial<ProductRecord> {
  current: number;
  pageSize: number;
}

export function queryProductList(params: ProductParams) {
  return axios.post<HttpResponse<PaginationRes<ProductRecord>>>('/api/product/spu/list', {
    ...params,
    paramsSerializer: (obj: PaginationRes<ProductRecord>) => {
      return qs.stringify(obj);
    },
  });
}
