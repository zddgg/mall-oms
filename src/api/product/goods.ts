import axios from 'axios';
import {HttpResponse, PaginationRes} from '@/types/global';
import {PropertySaleRecord} from "@/api/product/property";

export interface SpuMetaRecord {
    id: string;
    spuId: string;
    spuName: string;
    storeId: string;
    brandId: string;
    categoryId: string;
    statusFlag: string;
}

export interface SpuMetaParams extends Partial<SpuMetaRecord> {
    current: number;
    pageSize: number;
}

export function querySpuMetaList(params: SpuMetaParams) {
    return axios.post<HttpResponse<PaginationRes<SpuMetaRecord>>>('/api/product/spu/list', params);
}

export function querySpuDetail(params: SpuMetaRecord) {
    return axios.post<HttpResponse<SpuMetaRecord>>('/api/product/spu/detail', params);
}

export function createSpu(params: SpuMetaRecord) {
    return axios.post<HttpResponse>('/api/product/spu/create', params);
}

export function updateBySpuId(params: SpuMetaRecord) {
    return axios.post<HttpResponse>('/api/product/spu/update', params);
}

export function deleteBySpuId(params: SpuMetaRecord) {
    return axios.post<HttpResponse>('/api/product/spu/delete', params);
}

export function queryAttrListBySpuId(params: { spuId: string }) {
    return axios.post<HttpResponse<PropertySaleRecord[]>>(
        '/api/product/spu/queryAttrList', params
    );
}

export function addAttrSale(params: { spuId: string, attrId: string }) {
    return axios.post<HttpResponse<PropertySaleRecord[]>>(
        '/api/product/spu/addAttrSale', params
    );
}

export function deleteAttrSale(params: { spuId: string, attrId: string }) {
    return axios.post<HttpResponse<PropertySaleRecord[]>>(
        '/api/product/spu/deleteAttrSale', params
    );
}

export interface SkuMetaRecord {
    id: string;
    spuId: string;
    skuId: string;
    skuName: string;
    retailPrice: number;
    statusFlag: string;
}

export interface SkuMetaParams extends Partial<SkuMetaRecord> {
    current: number;
    pageSize: number;
}

export function querySkuMetaList(params: SkuMetaParams) {
    return axios.post<HttpResponse<PaginationRes<SkuMetaRecord>>>(
        '/api/product/sku/list', params
    );
}

export function createSku(params: SkuMetaRecord) {
    return axios.post<HttpResponse>(
        '/api/product/sku/create', params
    );
}

export interface AttrFlatMapItem {
    attrId?: string;
    attrName?: string;
    attrValueId?: string;
    attrValueName?: string;
}

export interface SkuItem {
    spuName?: string;
    skuName?: string;
    retailPrice?: number;
    attrList?: AttrFlatMapItem[];

    [x: string]: any;
}

export interface CategoryInfoModel {
    categoryId: string;
    storeId: string;
}

export interface BaseInfoModel {
    spuName: string;
    brandId: string;
}

export interface AttrInfoModel {
    attrSaleIds: string[];
    spuAttrSaleDataList: PropertySaleRecord[];
}

export interface SkuInfoModel {
    skuList: SkuItem[];
}

export type GoodsCreateModal = CategoryInfoModel & BaseInfoModel & AttrInfoModel & SkuInfoModel;

export function spuSkuCreate(params: GoodsCreateModal) {
    console.log(params)
    return axios.post<HttpResponse>(
        '/api/product/spu/spuSkuCreate', params
    );
}