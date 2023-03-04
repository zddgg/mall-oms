import axios from 'axios';
import qs from 'query-string';
export function queryBrandList(params) {
    return axios.post('/api/brand/list', {
        ...params,
        paramsSerializer: (obj) => {
            return qs.stringify(obj);
        },
    });
}
//# sourceMappingURL=brand.js.map