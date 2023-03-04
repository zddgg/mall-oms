import axios from 'axios';
export function queryProfileBasic() {
    return axios.get('/api/profile/basic');
}
export function queryOperationLog() {
    return axios.get('/api/operation/log');
}
//# sourceMappingURL=profile.js.map