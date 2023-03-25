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
                <a-form-item field="groupId" label="属性组编号">
                  <a-input
                      v-model="searchFormModel.groupId"
                      placeholder="请输入属性组编号"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="groupName" label="属性组名称">
                  <a-input
                      v-model="searchFormModel.groupName"
                      placeholder="请输入属性组名称"
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
                () =>
                  router.push({
                    name: 'AttrGroupCreate',
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
          :columns="propertyGroupColumns"
          :data="renderData"
          :bordered="false"
          :size="'medium'"
          @page-change="onPageChange"
      >
        <template #relatedProperty="{ record }">
          <a-popover trigger="click">
            <a-button size="small">
              {{ `数量 ${record.attrUnitRecords.length}` }}
            </a-button>
            <template #content>
              <a-table
                  row-key="id"
                  :pagination="false"
                  :columns="attrUnitColumns"
                  :data="record.attrUnitRecords"
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
        <template #operations="{ record }">
          <a-space>
            <a-button
                size="small"
                @click="
                router.push({
                    name: 'AttrGroupDetail',
                    params: {
                      groupId: record.groupId,
                    },
                    query: {
                      actionType: '1',
                    },
                  });
              "
            >
              查看
            </a-button>
            <a-button
                size="small"
                @click="router.push({
                              name: 'AttrGroupDetail',
                              params: {
                                groupId: record.groupId,
                              },
                              query: {
                                actionType: '2',
                              },
                            });
              "
            >
              编辑
            </a-button>
            <a-button size="small" @click="deleteCategoryGroup(record)">
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
import {TableData} from '@arco-design/web-vue/es/table/interface';
import {useRouter} from 'vue-router';
import {AttrGroupRecord, AttrGroupSearchParam, deleteByGroupId, queryAttrGroupPage,} from '@/api/product/property';
import {EnumResp, queryEnum} from '@/api/common/enum';
import {Modal} from '@arco-design/web-vue';

const router = useRouter();

const {loading, setLoading} = useLoading(false);

const renderData = ref<AttrGroupRecord[] | undefined>([]);
const searchFormModel = ref<AttrGroupRecord>({} as AttrGroupRecord);
const formShowTypeOptions = ref<EnumResp[]>([]);

const basePagination: Pagination = {
  current: 1,
  pageSize: 20,
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
    slotName: 'relatedProperty',
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

const attrUnitColumns = computed<TableColumnData[]>(() =>
    [
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

const deleteCategoryGroup = (record: TableData) => {
  Modal.confirm({
    title: `确认删除 [${record.groupName}]？`,
    content: '确认删除？？？',
    onOk: async () => {
      const params = {
        groupId: record.groupId,
      };
      await deleteByGroupId(params);
      search();
    },
  });
};

const init = async () => {
  // 获取枚举值
  const enumsResponse = await queryEnum({
    moduleName: 'Property',
    enumName: 'FormShowType',
  });
  formShowTypeOptions.value = enumsResponse.data;
};

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
