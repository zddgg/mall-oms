import axios from 'axios';
import qs from 'query-string';
export function queryPolicyList(params) {
    return axios.get('/api/list/policy', {
        params,
        paramsSerializer: (obj) => {
            return qs.stringify(obj);
        },
    });
}
export function queryInspectionList() {
    return axios.get('/api/list/quality-inspection');
}
export function queryTheServiceList() {
    return axios.get('/api/list/the-service');
}
export function queryRulesPresetList() {
    return axios.get('/api/list/rules-preset');
}
//# sourceMappingURL=list.js.map