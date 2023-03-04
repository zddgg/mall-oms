import axios from 'axios';
export function queryMyProjectList() {
    return axios.post('/api/user/my-project/list');
}
export function queryMyTeamList() {
    return axios.post('/api/user/my-team/list');
}
export function queryLatestActivity() {
    return axios.post('/api/user/latest-activity');
}
export function saveUserInfo() {
    return axios.post('/api/user/save-info');
}
export function queryCertification() {
    return axios.post('/api/user/certification');
}
export function userUploadApi(data, config) {
    // const controller = new AbortController();
    return axios.post('/api/user/upload', data, config);
}
//# sourceMappingURL=user-center.js.map