import axios from 'axios';
import {HttpResponse, PaginationRes} from '@/types/global';

export interface SpuMetaRecord {
    id: string;
    spuId: string;
    spuName: string;
    storeId: string;
    brandId: string;
    categoryId: string;
    statusFlag: string;
}

export interface SpuAttrSaleMap {
    spuId: string;
    attrId: string;
    attrName: string;
}

export interface SpuDetail {
    spuMeta: SpuMetaRecord;
    spuAttrSaleMaps: SpuAttrSaleMap[];
}

export interface SpuUpdate {
    spuMeta: SpuMetaRecord;
    deleteAttrIds: string[];
    addAttrNames: string[];
}

export interface SpuMetaParams extends Partial<SpuMetaRecord> {
    current: number;
    pageSize: number;
}

export function querySpuMetaList(params: SpuMetaParams) {
    return axios.post<HttpResponse<PaginationRes<SpuMetaRecord>>>('/api/product/spu/list', params);
}

export function querySpuDetail(params: SpuMetaRecord) {
    return axios.post<HttpResponse<SpuDetail>>('/api/product/spu/detail', params);
}

export function createSpu(params: SpuUpdate) {
    return axios.post<HttpResponse>('/api/product/spu/create', params);
}

export function updateBySpuId(params: SpuUpdate) {
    return axios.post<HttpResponse>('/api/product/spu/update', params);
}

export function deleteBySpuId(params: SpuMetaRecord) {
    return axios.post<HttpResponse>('/api/product/spu/delete', params);
}
