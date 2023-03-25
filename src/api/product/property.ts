import axios from 'axios';
import {HttpResponse, PaginationRes} from '@/types/global';

export interface AttrUnitValue {
    attrId?: string;
    attrValueName: string;
    attrValueOrder: number;
    confirmed: boolean;
}

export interface AttrUnitRecord {
    attrId?: string;
    attrName?: string;
    unit?: string;
    formShowType?: string;
    status?: string;
    attrUnitValues?: AttrUnitValue[];
}

export interface AttrUnitSearchParam extends Partial<AttrUnitRecord> {
    current: number;
    pageSize: number;
}

export function queryAttrUnitPage(params: AttrUnitSearchParam) {
    return axios.post<HttpResponse<PaginationRes<AttrUnitRecord>>>(
        '/api/attr/unit/page',
        params
    );
}

export function createAttrUnit(params: AttrUnitRecord) {
    return axios.post<HttpResponse>('/api/attr/unit/create', params);
}

export function queryAttrUnitDetail(params: AttrUnitRecord) {
    return axios.post<HttpResponse<AttrUnitRecord>>(
        '/api/attr/unit/detail',
        params
    );
}

export function updateAttrUnit(params: AttrUnitRecord) {
    return axios.post<HttpResponse>('/api/attr/unit/update', params);
}

export function deleteByAttrId(params: AttrUnitRecord) {
    return axios.post<HttpResponse>('/api/attr/unit/delete', params);
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

export interface AttrGroupRecord {
    groupId?: string;
    groupName?: string;
    status?: string;
    attrUnitRecords?: AttrUnitRecord[]
}

export interface AttrGroupSearchParam extends Partial<AttrGroupRecord> {
    current: number;
    pageSize: number;
}

export interface PropertyGroupSearchParam extends Partial<PropertyGroupRecord> {
    current: number;
    pageSize: number;
}

export interface AttrGroupCreate {
    groupId?: string;
    groupName?: string;
    attrIds?: string[];
}

export interface AttrGroupUnit {
    groupId?: string;
    attrId?: string;
}

export function queryPropertyGroupList(params: PropertyGroupSearchParam) {
    return axios.post<HttpResponse<PaginationRes<PropertyGroupRecord>>>(
        '/api/property/group/list',
        params
    );
}

export function queryAttrGroupPage(params: AttrGroupSearchParam) {
    return axios.post<HttpResponse<PaginationRes<AttrGroupRecord>>>(
        '/api/attr/group/page',
        params
    );
}

export function createAttrGroup(params: AttrGroupCreate) {
    return axios.post<HttpResponse>('/api/attr/group/create', params);
}

export function queryAttrGroupDetail(params: AttrGroupRecord) {
    return axios.post<HttpResponse<AttrGroupRecord>>(
        '/api/attr/group/detail',
        params
    );
}

export function updateAttrGroup(params: AttrGroupCreate) {
    return axios.post<HttpResponse>('/api/attr/group/update', params);
}

export function deleteByGroupId(params: AttrGroupRecord) {
    return axios.post<HttpResponse>('/api/attr/group/delete', params);
}

export function unBindAttrUnitByAttrId(params: AttrGroupUnit) {
    return axios.post<HttpResponse>('/api/attr/group/unBindAttrUnit', params);
}

export function getBindAttrUnitByGroupId(params: AttrGroupUnit) {
    return axios.post<HttpResponse<AttrUnitRecord[]>>('/api/attr/group/getBindAttrUnit', params);
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
