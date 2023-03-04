import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

const { Random } = Mock;

const data = Mock.mock({
  'list|55': [
    {
      'id|8': /[A-Z][a-z][-][0-9]/,
      'brandCode|2-3': /[0-9]/,
      'brandName|4-8': /[A-Z]/,
      'logo|4-8': /[A-Z]/,
      'status|1': ['online', 'offline'],
      'creator': Random.datetime(),
    },
  ],
});

setupMock({
  mock: false,
  setup() {
    Mock.mock('/api/brand/list', (params: { body: string }) => {
      const { current = 1, pageSize = 10 } = JSON.parse(params.body);
      const p = current as number;
      const ps = pageSize as number;
      return successResponseWrap({
        list: data.list.slice((p - 1) * ps, p * ps),
        current,
        pageSize,
        total: 55,
      });
    });
  },
});
