import axios from 'axios';
export function queryDataChainGrowth(data) {
    return axios.post('/api/data-chain-growth', data);
}
export function queryPopularAuthor() {
    return axios.get('/api/popular-author/list');
}
export function queryContentPublish() {
    return axios.get('/api/content-publish');
}
export function queryContentPeriodAnalysis() {
    return axios.post('/api/content-period-analysis');
}
export function queryPublicOpinionAnalysis(data) {
    return axios.post('/api/public-opinion-analysis', data);
}
export function queryDataOverview() {
    return axios.post('/api/data-overview');
}
//# sourceMappingURL=visualization.js.map