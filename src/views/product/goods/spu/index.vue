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
                <a-form-item field="spuId" label="SPU编号">
                  <a-input
                      v-model="searchFormModel.spuId"
                      placeholder="请输入SPU编号"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="spuName" label="SKU名称">
                  <a-input
                      v-model="searchFormModel.spuName"
                      placeholder="请输入SPU名称"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="brandCode" label="品牌">
                  <a-select
                      v-model="searchFormModel.brandId"
                      :options="brandTypeOptions"
                      placeholder="请选择品牌"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="categoryCode" label="类目">
                  <a-select
                      v-model="searchFormModel.categoryId"
                      :options="categoryTypeOptions"
                      placeholder="请选择类目"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" label="状态">
                  <a-select
                      v-model="searchFormModel.statusFlag"
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
      <a-divider style="margin-top: 0"/>
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button
                type="primary"
                @click="
                router.push({
                  name: 'SpuCreate',
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
        <template #operations="{ record }">
          <a-space>
            <a-button
                size="small"
                @click="
              router.push({
                  name: 'SpuDetail',
                  params: {
                    spuId: record.spuId,
                  },
                  query: {
                    actionType: '1',
                  },
                })"
            >
              查看
            </a-button>
            <a-button
                size="small"
                @click="router.push({
                          name: 'SpuDetail',
                          params: {
                            spuId: record.spuId,
                          },
                          query: {
                            actionType: '2',
                          },
                })"
            >
              编辑
            </a-button>
            <a-button
                size="small"
                @click="deleteSpu(record)"
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
import {useRouter} from 'vue-router';
import {deleteBySpuId, querySpuMetaList, SpuMetaParams, SpuMetaRecord} from "@/api/product/goods";
import {Modal} from "@arco-design/web-vue";

const router = useRouter();

type SizeProps = 'mini' | 'small' | 'medium' | 'large';

const {loading, setLoading} = useLoading(false);

const renderData = ref<SpuMetaRecord[] | undefined>([]);
const searchFormModel = ref<SpuMetaRecord>({} as SpuMetaRecord);

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
    title: 'SPU编号',
    dataIndex: 'spuId',
  },
  {
    title: 'SPU名称',
    dataIndex: 'spuName',
  },
  {
    title: '店铺',
    dataIndex: 'storeId',
  },
  {
    title: '品牌',
    dataIndex: 'brandId',
  },
  {
    title: '类目',
    dataIndex: 'categoryId',
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
const brandTypeOptions = computed<SelectOptionData[]>(() => [
  {
    label: '华为',
    value: '1001',
  },
  {
    label: '小米',
    value: '1002',
  },
]);
const categoryTypeOptions = computed<SelectOptionData[]>(() => [
  {
    label: '手机',
    value: '2001',
  },
  {
    label: '电脑',
    value: '2002',
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
    params: SpuMetaParams = {current: 1, pageSize: 20}
) => {
  setLoading(true);
  try {
    const {data} = await querySpuMetaList(params);
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
  } as unknown as SpuMetaParams);
};
const onPageChange = (current: number) => {
  fetchData({...basePagination, current} as unknown as SpuMetaParams);
};

const deleteSpu = (record: TableData) => {
  Modal.confirm({
    title: `确认删除 [${record.spuName}]？`,
    content: '确认删除？？？',
    onOk: async () => {
      const params = {
        spuId: record.spuId,
      } as SpuMetaRecord;
      const {msg} = await deleteBySpuId(params);
        console.log(msg)
      await fetchData();
    },
  });
};

const reset = () => {
  searchFormModel.value = {} as SpuMetaRecord;
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
