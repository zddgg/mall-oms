<template>
  <div class="container">
    <a-card class="general-card" :title="$t('menu.list.searchTable')">
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
                <a-form-item field="brandId" label="品牌编号">
                  <a-input
                      v-model="searchFormModel.brandId"
                      placeholder="请输入品牌编号"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="brandName" label="品牌名称">
                  <a-input
                      v-model="searchFormModel.brandName"
                      placeholder="请输入品牌名称"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" label="状态">
                  <a-select
                      v-model="searchFormModel.status"
                      :options="statusOptions"
                      placeholder="全部"
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
              {{ $t('searchTable.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh/>
              </template>
              {{ $t('searchTable.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0"/>
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="routeToStoreCreate">
              <template #icon>
                <icon-plus/>
              </template>
              {{ $t('searchTable.operation.create') }}
            </a-button>
            <a-upload action="/">
              <template #upload-button>
                <a-button>
                  {{ $t('searchTable.operation.import') }}
                </a-button>
              </template>
            </a-upload>
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
        <template #operations="{ record }">
          <a-space>
            <a-button
                v-permission="['admin']"
                size="small"
                @click="routeToStoreDetail(record.storeNo, '1')"
            >
              查看
            </a-button>
            <a-button
                v-permission="['admin']"
                size="small"
                @click="routeToStoreDetail(record.storeNo, '2')"
            >
              编辑
            </a-button>
            <a-button
                v-permission="['admin']"
                size="small"
                @click="deleteStore(record)"
            >
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
import type {SelectOptionData} from '@arco-design/web-vue/es/select/interface';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import {TableData} from "@arco-design/web-vue/es/table/interface";
import {useI18n} from 'vue-i18n';
import {useRouter} from 'vue-router';
import {deleteByStoreNo, queryStoreList, StoreParams, StoreRecord} from "@/api/store/store";
import {Modal} from "@arco-design/web-vue";

type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };

const {loading, setLoading} = useLoading(false);
const {t} = useI18n();
const router = useRouter();

const renderData = ref<StoreRecord[] | undefined>([]);
const searchFormModel = ref<StoreRecord>({} as StoreRecord);
const size = ref<SizeProps>('medium');

const basePagination: Pagination = {
  current: 1,
  pageSize: 20,
};
const pagination = reactive({
  ...basePagination,
});
const densityList = computed(() => [
  {
    name: t('searchTable.size.mini'),
    value: 'mini',
  },
  {
    name: t('searchTable.size.small'),
    value: 'small',
  },
  {
    name: t('searchTable.size.medium'),
    value: 'medium',
  },
  {
    name: t('searchTable.size.large'),
    value: 'large',
  },
]);
const columns = computed<TableColumnData[]>(() => [
  {
    title: '商户编号',
    dataIndex: 'merNo',
  },
  {
    title: '店铺编号',
    dataIndex: 'storeNo',
  },
  {
    title: '店铺名称',
    dataIndex: 'storeName',
  },
  {
    title: '状态',
    dataIndex: 'statusFlag',
  },
  {
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
  },
]);
const statusOptions = computed<SelectOptionData[]>(() => [
  {
    label: '已上线',
    value: 'online',
  },
  {
    label: '已下线',
    value: 'offline',
  },
]);
const fetchData = async (
    params: StoreParams = {current: 1, pageSize: 20}
) => {
  setLoading(true);
  try {
    const {data} = await queryStoreList(params);
    renderData.value = data.records;
    pagination.current = data.current;
    pagination.pageSize = data.pageSize;
    pagination.total = data.total;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

fetchData();

const search = () => {
  fetchData({
    ...basePagination,
    ...searchFormModel.value,
  } as unknown as StoreParams);
};
const onPageChange = (current: number) => {
  fetchData({...basePagination, current} as unknown as StoreParams);
};

const reset = () => {
  searchFormModel.value = {} as StoreRecord;
};

const routeToStoreDetail = (storeNo: string, actionType: string) => {
  router.push({
    name: 'StoreDetail',
    params: {
      storeNo,
    },
    query: {
      // 0-创建， 1-查看，2-编辑
      actionType,
    },
  });
};

const routeToStoreCreate = () => {
  router.push({
    name: 'StoreCreate',
    query: {
      // 0-创建， 1-查看，2-编辑
      actionType: '0',
    },
  });
};
const deleteStore = (record: TableData) => {
  Modal.confirm({
    title: `确认删除 [${record.storeName}]？`,
    content: '确认删除？？？',
    onOk: async () => {
      const params = {
        storeNo: record.storeNo,
      };
      await deleteByStoreNo(params);
      await fetchData();
    },
  });
};
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
