import debug from './env';
export default ({ mock, setup }) => {
    if ((mock === undefined || mock) && debug)
        setup();
};
export const successResponseWrap = (data) => {
    return {
        data,
        status: 'ok',
        msg: '请求成功',
        code: '0000',
    };
};
export const failResponseWrap = (data, msg, code = '50000') => {
    return {
        data,
        status: 'fail',
        msg,
        code,
    };
};
//# sourceMappingURL=setup-mock.js.map