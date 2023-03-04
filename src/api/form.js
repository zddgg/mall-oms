import axios from 'axios';
export function submitChannelForm(data) {
    return axios.post('/api/channel-form/submit', { data });
}
//# sourceMappingURL=form.js.map