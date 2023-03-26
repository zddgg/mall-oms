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

export interface AttrSaleValue {
    attrId?: string;
    attrValueId?: string;
    attrValueName?: string;
    attrSaleOrder?: number;
    status?: string;
    confirmed?: boolean;
}

export interface AttrSaleRecord {
    attrId?: string;
    attrName?: string;
    status?: string;
    attrSaleValues?: AttrSaleValue[]
}

export interface AttrSaleCreate {
    attrName: string;
    attrSaleValues?: { attrValueName: string, confirmed?: boolean }[]
}

export interface PropertySaleCreate {
    keyName: string;
}

export interface AttrSaleSearchParam extends Partial<AttrSaleRecord> {
    current: number;
    pageSize: number;
}

export function queryAttrSalePage(params: AttrSaleSearchParam) {
    return axios.post<HttpResponse<PaginationRes<AttrSaleRecord>>>(
        '/api/attr/sale/page',
        params
    );
}

export function createAttrSale(params: AttrSaleCreate) {
    return axios.post<HttpResponse>('/api/attr/sale/create', params);
}

export function queryAttrSaleDetail(params: AttrSaleRecord) {
    return axios.post<HttpResponse<AttrSaleRecord>>(
        '/api/attr/sale/detail',
        params
    );
}

export function queryValueList(params: { attrId: string }) {
    return axios.post<HttpResponse<AttrSaleValue[]>>(
        '/api/attr/sale/value/list',
        params
    );
}

export function updateKeyInfo(params: AttrSaleRecord) {
    return axios.post<HttpResponse>('/api/attr/sale/key/update', params);
}

export function deleteAttrSaleByAttrId(params: AttrSaleRecord) {
    return axios.post<HttpResponse>('/api/attr/sale/delete', params);
}

export function deleteValue(params: { attrId: string, attrValueId: string }) {
    return axios.post<HttpResponse>('/api/attr/sale/deleteValue', params);
}

export function addAttrValueByAttrId(params: { attrId: string, attrValueName: string }) {
    return axios.post<HttpResponse>('/api/attr/sale/addValue', params);
}
