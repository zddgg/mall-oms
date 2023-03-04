import debug from './env';

const closeMock = false;

export default ({ mock, setup }: { mock?: boolean; setup: () => void }) => {
  if (!closeMock && mock !== false && debug) setup();
};

export const successResponseWrap = (data: unknown) => {
  return {
    data,
    status: 'ok',
    msg: '请求成功',
    code: '0000',
  };
};

export const failResponseWrap = (
  data: unknown,
  msg: string,
  code = '50000'
) => {
  return {
    data,
    status: 'fail',
    msg,
    code,
  };
};
