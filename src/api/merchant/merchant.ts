import axios from 'axios';
import {HttpResponse, PaginationRes} from '@/types/global';

export interface MerchantRecord {
    id?: string;
    creator?: string;
    created?: string;
    updater?: string;
    updated?: string;
    merNo?: string;
    merName?: string;
    statusFlag?: string;
}

export interface MerchantParams extends Partial<MerchantRecord> {
    current: number;
    pageSize: number;
}

export function queryMerchantList(params: MerchantParams) {
    return axios.post<HttpResponse<PaginationRes<MerchantRecord>>>(
        '/api/merchant/list',
        params
    );
}

export function createMerchant(params: MerchantRecord) {
    return axios.post<HttpResponse>('/api/merchant/create', params);
}

export function updateMerchant(params: MerchantRecord) {
    return axios.post<HttpResponse>('/api/merchant/update', params);
}

export function queryMerchantDetail(params: MerchantRecord) {
    return axios.post<HttpResponse<MerchantRecord>>('/api/merchant/detail', params);
}

export function deleteByMerNo(params: MerchantRecord) {
    return axios.post<HttpResponse<MerchantRecord>>('/api/merchant/delete', params);
}
