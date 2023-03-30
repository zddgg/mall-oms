<template>
  <div class="container">
    <a-card class="general-card">
      <a-row>
        <a-form
            :model="searchFormModel"
            :label-col-props="{ span: 8 }"
            :wrapper-col-props="{ span: 16 }"
            label-align="right"
        >
          <a-grid :cols="3" :col-gap="20">
            <a-grid-item>
              <a-form-item field="attrName" label="销售属性名称">
                <a-input
                    v-model="searchFormModel.attrName"
                    placeholder="请输入销售属性名称"
                    allow-clear
                />
              </a-form-item>
            </a-grid-item>
            <a-grid-item suffix #="{ overflow }">
              <a-form-item>
                <a-space :size="18">
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
              </a-form-item>
            </a-grid-item>
          </a-grid>
        </a-form>
      </a-row>
      <a-divider style="margin-top: 20px"/>
      <a-table
          row-key="attrId"
          :loading="loading"
          :pagination="pagination"
          :columns="columns"
          :data="renderData"
          :bordered="false"
          :size="size"
          :row-selection="rowSelectionParam"
          v-model:selected-keys="selectedKeys"
          @page-change="onPageChange"
      >
        <template #attrSaleValues="{record}">
          <a-space>
            <a-tag v-for="(item, index) in record.attrSaleValues" :key="index">
              {{ item.attrValueName }}
            </a-tag>
          </a-space>
        </template>
        <template #status="{ record }">
          <span v-if="record.status === '0'" class="circle"></span>
          <span v-else class="circle pass"></span>
          {{ record.status === '0' ? '已停用' : '使用中' }}
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {computed, PropType, reactive, ref} from 'vue';
import useLoading from '@/hooks/loading';
import {Pagination} from '@/types/global';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import {TableRowSelection} from "@arco-design/web-vue/es/table/interface";
import {useRouter} from 'vue-router';
import {AttrSaleRecord, AttrSaleSearchParam, queryAttrSalePage} from "@/api/product/property";

const router = useRouter();
const {loading, setLoading} = useLoading(false);

const props = defineProps({
  rowSelectionParam: {
    type: Object as PropType<TableRowSelection>,
    default: () => {
      return {
        type: 'radio',
        showCheckedAll: true,
      } as TableRowSelection
    }
  }
})

type SizeProps = 'mini' | 'small' | 'medium' | 'large';
const size = ref<SizeProps>('medium');

const renderData = ref<AttrSaleRecord[] | undefined>([]);
const searchFormModel = ref<AttrSaleRecord>({} as AttrSaleRecord);

const selectedKeys = ref([]);
const basePagination: Pagination = {
  current: 1,
  pageSize: 10,
};
const pagination = reactive({
  ...basePagination,
});
const columns = computed<TableColumnData[]>(() => [
  {
    title: '属性ID',
    dataIndex: 'attrId',
  },
  {
    title: '属性名称',
    dataIndex: 'attrName',
  },
  {
    title: '属性值',
    dataIndex: 'attrSaleValues',
    slotName: 'attrSaleValues',
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
    params: AttrSaleSearchParam = {current: 1, pageSize: 10}
) => {
  setLoading(true);
  try {
    const {data} = await queryAttrSalePage(params);
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
  } as unknown as AttrSaleSearchParam);
};
const onPageChange = (current: number) => {
  fetchData({
    ...basePagination,
    current,
  } as unknown as AttrSaleSearchParam);
};

const reset = () => {
  searchFormModel.value = {} as AttrSaleRecord;
};

const selectedKeysHandler = () => {
  return selectedKeys.value;
};

defineExpose({selectedKeysHandler});

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
