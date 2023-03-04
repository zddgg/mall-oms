import axios from 'axios';
import { HttpResponse, PaginationRes } from '@/types/global';
import { SelectOptionData } from '@arco-design/web-vue/es/select/interface';

export interface BrandRecord {
  id?: string;
  creator?: string;
  created?: string;
  updater?: string;
  updated?: string;
  brandId?: string;
  brandName?: string;
  foreignBrandName?: string;
  showName?: string;
  level?: string;
  logo?: string;
  trademarkName?: string;
  status?: string;
}

export interface BrandCreateRecord {
  brandName: string;
  foreignBrandName: string;
  showName: string;
  logo?: string | undefined;
}

export interface BrandParams extends Partial<BrandRecord> {
  current: number;
  pageSize: number;
}

export function queryBrandList(params: BrandParams) {
  return axios.post<HttpResponse<PaginationRes<BrandRecord>>>(
    '/api/brand/list',
    params
  );
}

export function createBrand(params: BrandCreateRecord) {
  return axios.post<HttpResponse>('/api/brand/create', params);
}

export function updateBrand(params: BrandRecord) {
  return axios.post<HttpResponse>('/api/brand/update', params);
}

export function queryBrandDetail(params: BrandRecord) {
  return axios.post<HttpResponse<BrandRecord>>('/api/brand/detail', params);
}

export function deleteByBrandNo(params: BrandRecord) {
  return axios.post<HttpResponse<BrandRecord>>('/api/brand/delete', params);
}

export function getOptions() {
  return axios.post<HttpResponse<SelectOptionData>>('/api/brand/options');
}
