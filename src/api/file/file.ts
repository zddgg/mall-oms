import axios from 'axios';

export interface UploadRes {
  uid?: string;
  name?: string;
  url?: string;
}

export function fileUploadApi(
  data: FormData,
  config: {
    controller: AbortController;
    onUploadProgress?: (progressEvent: any) => void;
  }
) {
  return axios.post('/file/upload', data, config);
}
