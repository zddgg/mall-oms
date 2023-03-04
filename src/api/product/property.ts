import axios from 'axios';
import { HttpResponse, PaginationRes } from '@/types/global';
import { SelectOptionData } from '@arco-design/web-vue/es/select/interface';

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
//
// export interface PropertyGroupRecord {
//   id?: string;
//   creator?: string;
//   created?: string;
//   updater?: string;
//   updated?: string;
//   propertyGroupId?: string;
//   propertyGroupName?: string;
//   status?: string;
// }
//
// export interface PropertyGroupSearchParam extends Partial<PropertyGroupRecord> {
//   current: number;
//   pageSize: number;
// }
//
// export interface PropertyGroupCreate {
//   propertyGroupId?: string;
//   propertyGroupName: string;
//   propertyStoreList: PropertyStoreRecord[];
// }
//
// export function queryPropertyGroupList(params: PropertyGroupSearchParam) {
//   return axios.post<HttpResponse<PaginationRes<PropertyGroupRecord>>>(
//     '/api/property/group/list',
//     params
//   );
// }
//
// export function createPropertyGroup(params: PropertyGroupCreate) {
//   return axios.post<HttpResponse>('/api/property/group/create', params);
// }
//
// export function queryPropertyGroupDetail(params: PropertyGroupRecord) {
//   return axios.post<HttpResponse<PropertyGroupCreate>>(
//     '/api/property/group/detail',
//     params
//   );
// }
//
// export function editPropertyGroup(params: PropertyGroupCreate) {
//   return axios.post<HttpResponse>('/api/property/group/edit', params);
// }
//
// export function deleteByPropertyGroupId(params: PropertyGroupRecord) {
//   return axios.post<HttpResponse>('/api/property/group/delete', params);
// }
//
// export interface PropertyFormData {
//   type: string;
//   valueOptions?: SelectOptionData[];
//   desc?: string;
// }
