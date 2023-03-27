import axios from 'axios';
import {HttpResponse, PaginationRes} from '@/types/global';
import {AttrGroupRecord, AttrSaleRecord, AttrUnitRecord} from "@/api/product/property";

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
    relatedAttr?: boolean;
    attrUnitRecords: AttrUnitRecord[];
    attrGroupRecords: AttrGroupRecord[];
    attrSaleRecords: AttrSaleRecord[];
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


export interface BackendCategoryCreateReq {
    categoryName?: string;
    parentId?: string;
    level?: number;
    relatedProperty?: boolean;
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
        '/api/category/backend/list',
        params
    );
}

export function queryBackendCategoryTree(params: BackendCategoryTreeParams) {
    return axios.post<HttpResponse<BackendCategoryTree[]>>(
        '/api/category/backend/tree',
        params
    );
}

export function createBackendCategory(params: BackendCategoryCreateReq) {
    return axios.post<HttpResponse>('/api/category/backend/create', params);
}

export function updateBackendCategory(params: BackendCategoryUpdateReq) {
    return axios.post<HttpResponse>('/api/category/backend/update', params);
}

export function queryBackendCategoryDetail(params: BackendCategoryDetailReq) {
    return axios.post<HttpResponse<BackendCategoryDetail>>(
        '/api/category/backend/detail',
        params
    );
}

export function queryParentCategoryDetail(params: BackendCategoryDetailReq) {
    return axios.post<HttpResponse<BackendCategoryDetail[]>>(
        '/api/category/backend/parentDetail',
        params
    );
}

export function queryParentAndSelfDetail(params: BackendCategoryDetailReq) {
    return axios.post<HttpResponse<BackendCategoryDetail[]>>(
        '/api/category/backend/parentAndSelfDetail',
        params
    );
}

export function addAttrSale(params: { categoryId: string, attrId: string }) {
    return axios.post<HttpResponse>(
        '/api/category/backend/addAttrSale', params
    );
}

export function deleteAttrSale(params: { categoryId: string, attrId: string }) {
    return axios.post<HttpResponse>(
        '/api/category/backend/deleteAttrSale', params
    );
}

export function queryAttrSaleListByCategoryId(params: { categoryId: string }) {
    return axios.post<HttpResponse<AttrSaleRecord[]>>(
        '/api/category/backend/queryAttrSaleList', params
    );
}