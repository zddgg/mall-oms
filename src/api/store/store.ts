import axios from 'axios';
import {HttpResponse, PaginationRes} from '@/types/global';
import {MerchantRecord} from "@/api/merchant/merchant";

export interface StoreRecord {
    id?: string;
    creator?: string;
    created?: string;
    updater?: string;
    updated?: string;
    merNo?: string;
    storeNo?: string;
    storeName?: string;
    statusFlag?: string;
}

export interface StoreParams extends Partial<StoreRecord> {
    current: number;
    pageSize: number;
}

export function queryStoreList(params: StoreParams) {
    return axios.post<HttpResponse<PaginationRes<StoreRecord>>>(
        '/api/store/list',
        params
    );
}

export function createStore(params: StoreRecord) {
    return axios.post<HttpResponse>('/api/store/create', params);
}

export function updateStore(params: StoreRecord) {
    return axios.post<HttpResponse>('/api/store/update', params);
}

export function queryStoreDetail(params: StoreRecord) {
    return axios.post<HttpResponse<StoreRecord>>('/api/store/detail', params);
}

export function deleteByStoreNo(params: StoreRecord) {
    return axios.post<HttpResponse<StoreRecord>>('/api/store/delete', params);
}

