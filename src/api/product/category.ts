import axios from 'axios';
import { HttpResponse, PaginationRes } from '@/types/global';
import {
  PropertyGroupRecord,
  PropertyStoreRecord,
} from '@/api/product/property';

export interface BackendCategoryRecord {
  id?: string;
  creator?: string;
  created?: string;
  updater?: string;
  updated?: string;
  categoryId?: string;
  categoryName?: string;
  parentNo?: string;
  level?: number;
  status?: string;
  groupCount?: number;
  storeCount?: number;
}

export interface BackendCategoryTree {
  categoryId: string;
  categoryName: string;
  parentNo: string;
  level: number;
  children: BackendCategoryTree[];
}

export interface BackendCategoryOptionResp {
  categoryId: string;
  categoryName: string;
  parentNo: string;
  level: number;
}

export interface BackendCategorySearchParams
  extends Partial<BackendCategoryRecord> {
  current: number;
  pageSize: number;
}

export interface BackendCategoryDetailReq {
  categoryId?: string;
  categoryName?: string;
}

export interface BackendCategoryDetailResp {
  categoryId?: string;
  categoryName: string;
  parentId?: string;
  level?: number;
  relatedProperty?: boolean;
  propertyGroupList: PropertyGroupRecord[];
  propertyStoreList: PropertyStoreRecord[];
  parentCategoryDetail?: BackendCategoryDetailResp[];
}

export interface BackendCategoryTreeParams {
  maxLevel: number;
}

export function queryCategoryList(params: BackendCategorySearchParams) {
  return axios.post<HttpResponse<PaginationRes<BackendCategoryRecord>>>(
    '/api/backendCategory/list',
    params
  );
}

export function queryBackendCategoryTree(params: BackendCategoryTreeParams) {
  return axios.post<HttpResponse<BackendCategoryTree[]>>(
    '/api/backendCategory/tree',
    params
  );
}

export function createBackendCategory(params: BackendCategoryDetailResp) {
  return axios.post<HttpResponse>('/api/backendCategory/create', params);
}

export function updateBackendCategory(params: BackendCategoryDetailResp) {
  return axios.post<HttpResponse>('/api/backendCategory/update', params);
}

export function queryBackendCategoryDetail(params: BackendCategoryDetailReq) {
  return axios.post<HttpResponse<BackendCategoryDetailResp>>(
    '/api/backendCategory/detail',
    params
  );
}

export function queryAllParentCategoryDetail(params: BackendCategoryDetailReq) {
  return axios.post<HttpResponse<BackendCategoryDetailResp[]>>(
    '/api/backendCategory/allParentDetail',
    params
  );
}

export function queryBackendCategoryOptions() {
  return axios.post<HttpResponse<BackendCategoryOptionResp[]>>(
    '/api/backendCategory/options'
  );
}

export interface BaseInfoModel {
  categoryName: string;
  parentId: string;
}
export interface PropertyInfoModel {
  propertyGroupList: PropertyGroupRecord[];
  propertyStoreList: PropertyStoreRecord[];
  salePropertyList: PropertyStoreRecord[];
  parentCategoryDetail?: BackendCategoryDetailResp[];
}

export interface SalePropertyModel {
  advertisingSource: string;
  advertisingMedia: string;
  keyword: string[];
  pushNotify: boolean;
  advertisingContent: string;
}

export type CategoryModel = BaseInfoModel &
  PropertyInfoModel &
  SalePropertyModel;
