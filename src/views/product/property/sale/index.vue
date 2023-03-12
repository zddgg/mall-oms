<template>
  <div class="container">
    <a-card class="general-card" title="查询表格">
      <a-row>
        <a-col :flex="1">
          <a-form
              :model="searchFormModel"
              :label-col-props="{ span: 6 }"
              :wrapper-col-props="{ span: 18 }"
              label-align="right"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="keyName" label="销售属性名称">
                  <a-input
                      v-model="searchFormModel.keyName"
                      placeholder="请输入销售属性名称"
                      allow-clear
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical"/>
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search/>
              </template>
              查询
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh/>
              </template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 20px"/>
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button
                type="primary"
                @click="
                () =>
                  router.push({
                    name: 'PropertySaleCreate',
                    query: {
                      actionType: '0',
                    },
                  })
              "
            >
              <template #icon>
                <icon-plus/>
              </template>
              新增
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-table
          row-key="id"
          :loading="loading"
          :pagination="pagination"
          :columns="columns"
          :data="renderData"
          :bordered="false"
          :size="size"
          @page-change="onPageChange"
      >
        <template #propertySaleValues="{ record }">
          <a-space>
            <a-tag v-for="(item, index) in record.propertySaleValues" :key="index">
              {{ item.valueName }}
            </a-tag>
          </a-space>
        </template>

        <template #status="{ record }">
          <span v-if="record.status === '0'" class="circle"></span>
          <span v-else class="circle pass"></span>
          {{ record.status === '0' ? '已停用' : '使用中' }}
        </template>
        <template #operations="{ record }">
          <a-space>
            <a-button
                size="small"
                @click="
                () => {
                  router.push({
                    name: 'PropertySaleDetail',
                    params: {
                      keyId: record.keyId,
                    },
                    query: {
                      actionType: '1',
                    },
                  });
                }
              "
            >
              查看
            </a-button>
            <a-button
                size="small"
                @click="
                () => {
                  router.push({
                    name: 'PropertySaleDetail',
                    params: {
                      keyId: record.keyId,
                    },
                    query: {
                      actionType: '2',
                    },
                  });
                }
              "
            >
              编辑
            </a-button>
            <a-button size="small" @click="deleteCategoryStore(record)">
              删除
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {computed, reactive, ref} from 'vue';
import useLoading from '@/hooks/loading';
import {Pagination} from '@/types/global';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import {useRouter} from 'vue-router';
import {
  deleteSaleByKeyId,
  PropertySaleRecord,
  PropertySaleSearchParam,
  PropertyUnitSearchParam,
  queryPropertySaleList
} from '@/api/product/property';
import {TableData} from '@arco-design/web-vue/es/table/interface.d';
import {Modal} from "@arco-design/web-vue";

const router = useRouter();

type SizeProps = 'mini' | 'small' | 'medium' | 'large';

const {loading, setLoading} = useLoading(false);

const renderData = ref<PropertySaleRecord[] | undefined>([]);
const searchFormModel = ref<PropertySaleRecord>({} as PropertySaleRecord);

const size = ref<SizeProps>('medium');

const basePagination: Pagination = {
  current: 1,
  pageSize: 20,
};
const pagination = reactive({
  ...basePagination,
});
const columns = computed<TableColumnData[]>(() => [
  {
    title: '属性ID',
    dataIndex: 'keyId',
  },
  {
    title: '属性名称',
    dataIndex: 'keyName',
  },
  {
    title: '属性值',
    dataIndex: 'propertySaleValues',
    slotName: 'propertySaleValues',
  },
  {
    title: '状态',
    dataIndex: 'status',
    slotName: 'status',
  },
  {
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
  },
]);
const fetchData = async (
    params: PropertySaleSearchParam = {current: 1, pageSize: 20}
) => {
  setLoading(true);
  try {
    const {data} = await queryPropertySaleList(params);
    renderData.value = data.records;
    pagination.current = params.current;
    pagination.total = data.total;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const search = () => {
  fetchData({
    ...basePagination,
    ...searchFormModel.value,
  } as unknown as PropertyUnitSearchParam);
};
const onPageChange = (current: number) => {
  fetchData({
    ...basePagination,
    current,
  } as unknown as PropertyUnitSearchParam);
};

const reset = () => {
  searchFormModel.value = {} as PropertySaleRecord;
};

const deleteCategoryStore = (record: TableData) => {
  Modal.confirm({
    title: `确认删除 [${record.keyName}]？`,
    content: '确认删除？？？',
    onOk: async () => {
      const params = {
        keyId: record.keyId,
      } as PropertySaleRecord;
      await deleteSaleByKeyId(params);
      search();
    },
  });
};

search();
</script>

<style scoped lang="less">
.container {
  padding: 20px;
}

:deep(.arco-table-th) {
  &:last-child {
    .arco-table-th-item-title {
      margin-left: 16px;
    }
  }
}

.action-icon {
  margin-left: 12px;
  cursor: pointer;
}

.active {
  color: #0960bd;
  background-color: #e3f4fc;
}

.setting {
  display: flex;
  align-items: center;
  width: 200px;

  .title {
    margin-left: 12px;
    cursor: pointer;
  }
}
</style>
