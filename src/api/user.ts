import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import {HttpResponse} from "@/types/global";
import {RoleType} from "@/types/role";

export interface LoginData {
  username: string;
  password: string;
}

export interface UserInfo {
  name?: string;
  avatar?: string;
  job?: string;
  organization?: string;
  location?: string;
  email?: string;
  introduction?: string;
  personalWebsite?: string;
  jobName?: string;
  organizationName?: string;
  locationName?: string;
  phone?: string;
  registrationDate?: string;
  accountId?: string;
  certification?: number;
  role: RoleType;
}

export interface LoginRes {
  token: string;
}
export function login(data: LoginData) {
  return axios.post<HttpResponse<LoginRes>>('/oms/user/login', data);
}

export function logout() {
  return axios.post<HttpResponse<LoginRes>>('/oms/user/logout');
}

export function getUserInfo() {
  return axios.post<HttpResponse<UserInfo>>('/oms/user/info');
}

export function getMenuList() {
  return axios.post<HttpResponse<RouteRecordNormalized[]>>('/oms/user/menu');
}
