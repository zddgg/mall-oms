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
              <a-form-item field="groupName" label="属性组名称">
                <a-input
                    v-model="searchFormModel.groupName"
                    placeholder="请输入SPU编号"
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
      <a-table
          row-key="groupId"
          :loading="loading"
          :pagination="pagination"
          :columns="propertyGroupColumns"
          :data="renderData"
          :bordered="false"
          :size="'medium'"
          :row-selection="rowSelection"
          v-model:selected-keys="selectedKeys"
          @page-change="onPageChange"
      >
        <template #relatedAttr="{ record }">
          <a-popover trigger="click">
            <a-button size="small">
              {{ `数量 ${record.attrUnitRecords.length}` }}
            </a-button>
            <template #content>
              <a-table
                  row-key="id"
                  :pagination="false"
                  :columns="propertyUnitColumns"
                  :data="record.propertyUnitKeys"
                  :bordered="false"
                  :size="'medium'"
              >
                <template #status="{ record }">
                  <span v-if="record.status === '0'" class="circle"></span>
                  <span v-else class="circle pass"></span>
                  {{ record.status === '0' ? '已停用' : '使用中' }}
                </template>
              </a-table>
            </template>
          </a-popover>
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
import {computed, reactive, ref} from 'vue';
import useLoading from '@/hooks/loading';
import {Pagination} from '@/types/global';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import {TableData, TableRowSelection} from '@arco-design/web-vue/es/table/interface';
import {useRouter} from 'vue-router';
import {EnumResp, queryEnum} from '@/api/common/enum';
import {AttrGroupRecord, AttrGroupSearchParam, queryAttrGroupPage} from "@/api/product/property";

const router = useRouter();
const {loading, setLoading} = useLoading(false);

const renderData = ref<AttrGroupRecord[] | undefined>([]);
const searchFormModel = ref({} as AttrGroupRecord);
const formShowTypeOptions = ref<EnumResp[]>([]);


const rowSelection = reactive({
  type: 'radio',
  showCheckedAll: true,
} as TableRowSelection);
const selectedKeys = ref([]);
const basePagination: Pagination = {
  current: 1,
  pageSize: 10,
};
const pagination = reactive({
  ...basePagination,
});
const propertyGroupColumns = computed<TableColumnData[]>(() => [
  {
    title: '属性组ID',
    dataIndex: 'groupId',
  },
  {
    title: '属性组名称',
    dataIndex: 'groupName',
  },
  {
    title: '已关联属性',
    slotName: 'relatedAttr',
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

const propertyUnitColumns = computed<TableColumnData[]>(() => [
  {
    title: '属性ID',
    dataIndex: 'attrId',
  },
  {
    title: '属性名称',
    dataIndex: 'attrName',
  },
  {
    title: '属性单位',
    dataIndex: 'unit',
  },
  {
    title: '表单展示方式',
    dataIndex: 'formShowType',
    render: (data: {
      record: TableData;
      column: TableColumnData;
      rowIndex: number;
    }) => {
      return (
          formShowTypeOptions.value.find(
              (item) => item.value === data.record.formShowType
          ) || {label: data.record.formShowType}
      ).label;
    },
  },
  {
    title: '属性值',
    dataIndex: 'attrUnitValues',
    render: (data) => {
      if (data.record.attrUnitValues) {
        return data.record.attrUnitValues
            .map((item: { attrValueName: string }) => item.attrValueName)
            .join(', ');
      }
      return '';
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    slotName: 'status',
  },
]);

const fetchData = async (
    params: AttrGroupSearchParam = {current: 1, pageSize: 20}
) => {
  setLoading(true);
  try {
    const {data} = await queryAttrGroupPage(params);
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
  } as unknown as AttrGroupSearchParam);
};
const onPageChange = (current: number) => {
  fetchData({
    ...basePagination,
    current,
  } as unknown as AttrGroupSearchParam);
};

const reset = () => {
  searchFormModel.value = {} as AttrGroupRecord;
};

const init = async () => {
  // 获取枚举值
  const enumsResponse = await queryEnum({
    moduleName: 'Property',
    enumName: 'FormShowType',
  });
  formShowTypeOptions.value = enumsResponse.data;
};

const selectedKeysHandler = () => {
  return selectedKeys.value;
};

defineExpose({selectedKeysHandler});

init();
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
