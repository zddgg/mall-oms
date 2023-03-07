import axios from 'axios';
import { HttpResponse, PaginationRes } from '@/types/global';
import {
  PropertyGroupRecord, PropertySaleRecord,
  PropertyUnitRecord,
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
  saleCount?: number;
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

export interface BackendCategoryDetail {
  categoryId?: string;
  categoryName: string;
  parentId?: string;
  level?: number;
  relatedProperty?: boolean;
  propertyUnitKeys: PropertyUnitRecord[];
  propertyGroups: PropertyGroupRecord[];
  propertySaleKeys: PropertySaleRecord[];
}

export interface BackendCategoryUpdateReq {
  categoryId?: string;
  categoryName?: string;
  parentId?: string;
  level?: number;
  relatedProperty?: boolean;
  propertyUnitIds?: string[];
  propertyGroupIds?: string[];
  propertySaleIds?: string[];
}

export interface BackendCategoryDetailResp {
  detail?: BackendCategoryDetailResp;
  parentDetails?: BackendCategoryDetailResp[];
}

export interface BackendCategoryTreeParams {
  maxLevel: number;
  rootHelp: boolean,
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

export function createBackendCategory(params: BackendCategoryUpdateReq) {
  return axios.post<HttpResponse>('/api/backendCategory/create', params);
}

export function updateBackendCategory(params: BackendCategoryUpdateReq) {
  return axios.post<HttpResponse>('/api/backendCategory/update', params);
}

export function queryBackendCategoryDetail(params: BackendCategoryDetailReq) {
  return axios.post<HttpResponse<BackendCategoryDetail>>(
    '/api/backendCategory/detail',
    params
  );
}

export function queryParentCategoryDetail(params: BackendCategoryDetailReq) {
  return axios.post<HttpResponse<BackendCategoryDetail[]>>(
    '/api/backendCategory/parentDetail',
    params
  );
}

export function queryParentAndSelfDetail(params: BackendCategoryDetailReq) {
  return axios.post<HttpResponse<BackendCategoryDetail[]>>(
      '/api/backendCategory/parentAndSelfDetail',
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
  propertyUnitList: PropertyUnitRecord[];
  salePropertyList: PropertyUnitRecord[];
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
