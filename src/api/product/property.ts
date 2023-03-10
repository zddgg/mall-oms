import axios from 'axios';
import {HttpResponse, PaginationRes} from '@/types/global';

export interface PropertyUnitValue {
    unitKeyId?: string;
    unitValue: string;
    unitValueOrder: number;
    confirmed: boolean;
}

export interface PropertyUnitRecord {
    id?: string;
    creator?: string;
    created?: string;
    updater?: string;
    updated?: string;
    unitKeyId?: string;
    unitKeyName?: string;
    unitKeyUnit?: string;
    formShowType?: string;
    unitValue?: string;
    status?: string;
    propertyUnitValues?: PropertyUnitValue[];
}

export interface PropertyUnitSearchParam extends Partial<PropertyUnitRecord> {
    current: number;
    pageSize: number;
}

export function queryPropertyUnitList(params: PropertyUnitSearchParam) {
    return axios.post<HttpResponse<PaginationRes<PropertyUnitRecord>>>(
        '/api/property/unit/list',
        params
    );
}

export function createPropertyUnit(params: PropertyUnitRecord) {
    return axios.post<HttpResponse>('/api/property/unit/create', params);
}

export function queryPropertyUnitDetail(params: PropertyUnitRecord) {
    return axios.post<HttpResponse<PropertyUnitRecord>>(
        '/api/property/unit/detail',
        params
    );
}

export function editPropertyUnit(params: PropertyUnitRecord) {
    return axios.post<HttpResponse>('/api/property/unit/edit', params);
}

export function deleteByUnitKeyId(params: PropertyUnitRecord) {
    return axios.post<HttpResponse>('/api/property/unit/delete', params);
}

export interface PropertyGroupRecord {
    id?: string;
    creator?: string;
    created?: string;
    updater?: string;
    updated?: string;
    propertyGroupId?: string;
    propertyGroupName?: string;
    status?: string;
    propertyUnitKeys?: PropertyUnitRecord[]
}

export interface PropertyGroupSearchParam extends Partial<PropertyGroupRecord> {
    current: number;
    pageSize: number;
}

export interface PropertyGroupCreate {
    propertyGroupId?: string;
    propertyGroupName: string;
    propertyUnitKeys: PropertyUnitRecord[];
}

export function queryPropertyGroupList(params: PropertyGroupSearchParam) {
    return axios.post<HttpResponse<PaginationRes<PropertyGroupRecord>>>(
        '/api/property/group/list',
        params
    );
}

export function createPropertyGroup(params: PropertyGroupCreate) {
    return axios.post<HttpResponse>('/api/property/group/create', params);
}

export function queryPropertyGroupDetail(params: PropertyGroupRecord) {
    return axios.post<HttpResponse<PropertyGroupRecord>>(
        '/api/property/group/detail',
        params
    );
}

export function editPropertyGroup(params: PropertyGroupCreate) {
    return axios.post<HttpResponse>('/api/property/group/edit', params);
}

export function deleteByPropertyGroupId(params: PropertyGroupRecord) {
    return axios.post<HttpResponse>('/api/property/group/delete', params);
}

export interface PropertySaleValue {
    id?: string;
    creator?: string;
    created?: string;
    updater?: string;
    updated?: string;
    keyId?: string;
    valueId?: string;
    valueName?: string;
    propertyOrder?: number;
    status?: string;
    confirmed?: boolean;
}
export interface PropertySaleKey {
    id?: string;
    creator?: string;
    created?: string;
    updater?: string;
    updated?: string;
    keyId?: string;
    keyName?: string;
    status?: string;
}

export interface PropertySaleRecord {
    id?: string;
    creator?: string;
    created?: string;
    updater?: string;
    updated?: string;
    keyId?: string;
    keyName?: string;
    status?: string;
    propertySaleValues?: PropertySaleValue[]
}

export interface PropertySaleCreate {
    keyName: string;
}

export interface PropertySaleSearchParam extends Partial<PropertySaleRecord> {
    current: number;
    pageSize: number;
}

export function queryPropertySaleList(params: PropertySaleSearchParam) {
    return axios.post<HttpResponse<PaginationRes<PropertySaleRecord>>>(
        '/api/property/sale/list',
        params
    );
}

export function queryPropertySaleByCategoryId(params: { categoryId: string | undefined }) {
    return axios.post<HttpResponse<PropertySaleRecord[]>>(
        '/api/property/sale/queryByCategoryId',
        params
    );
}

export function createPropertySale(params: PropertySaleCreate) {
    return axios.post<HttpResponse>('/api/property/sale/create', params);
}

export function queryPropertySaleDetail(params: PropertySaleRecord) {
    return axios.post<HttpResponse<PropertySaleRecord>>(
        '/api/property/sale/detail',
        params
    );
}

export function queryKeyDetail(params: { keyId: string }) {
    return axios.post<HttpResponse<PropertySaleKey>>(
        '/api/property/sale/key/detail',
        params
    );
}

export function queryValueList(params: { keyId: string }) {
    return axios.post<HttpResponse<PropertySaleValue[]>>(
        '/api/property/sale/value/list',
        params
    );
}

export function editKey(params: PropertySaleRecord) {
    return axios.post<HttpResponse>('/api/property/sale/key/edit', params);
}

export function deleteSaleByKeyId(params: PropertySaleRecord) {
    return axios.post<HttpResponse>('/api/property/sale/delete', params);
}

export function deleteValue(params: { keyId: string, valueId: string }) {
    return axios.post<HttpResponse>('/api/property/sale/deleteValue', params);
}

export function addValue(params: { keyId: string, valueName: string }) {
    return axios.post<HttpResponse>('/api/property/sale/addValue', params);
}
