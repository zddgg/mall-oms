import axios from 'axios';
import qs from 'query-string';
export function queryProductList(params) {
    return axios.post('/api/product/list', {
        ...params,
        paramsSerializer: (obj) => {
            return qs.stringify(obj);
        },
    });
}
//# sourceMappingURL=goods.js.map