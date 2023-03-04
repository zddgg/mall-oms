import axios from 'axios';
import { HttpResponse } from '@/types/global';

export interface EnumParam {
  moduleName?: string;
  enumName?: string;
}

export interface EnumResp {
  value?: string;
  label?: string;
  disabled?: boolean;
}

export function queryEnum(params: EnumParam) {
  return axios.post<HttpResponse<EnumResp[]>>('/api/enum/query', params);
}
