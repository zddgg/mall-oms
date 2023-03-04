import axios from 'axios';
import qs from 'query-string';
export function queryCategoryList(params) {
    return axios.post('/api/category/list', {
        ...params,
        paramsSerializer: (obj) => {
            return qs.stringify(obj);
        },
    });
}
//# sourceMappingURL=category.js.map