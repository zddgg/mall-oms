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
                <a-form-item field="propertyKeyName" label="属性名称">
                  <a-input
                    v-model="searchFormModel.propertyKeyName"
                    placeholder="请输入SPU编号"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              查询
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 20px" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button
              type="primary"
              @click="
                () =>
                  router.push({
                    name: 'PropertyUnitCreate',
                    query: {
                      actionType: '0',
                    },
                  })
              "
            >
              <template #icon>
                <icon-plus />
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
                    name: 'PropertyUnitDetail',
                    params: {
                      unitKeyId: record.unitKeyId,
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
                    name: 'PropertyUnitDetail',
                    params: {
                      unitKeyId: record.unitKeyId,
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
  import { computed, ref, reactive } from 'vue';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useRouter } from 'vue-router';
  import {
    PropertyUnitRecord,
    PropertyUnitSearchParam,
    queryPropertyUnitList,
    deleteByUnitKeyId,
  } from '@/api/product/property';
  import { EnumResp, queryEnum } from '@/api/common/enum';
  import { TableData } from '@arco-design/web-vue/es/table/interface.d';
  import { Modal } from '@arco-design/web-vue';

  const router = useRouter();

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  const size = ref<SizeProps>('medium');

  const { loading, setLoading } = useLoading(false);

  const renderData = ref<PropertyUnitRecord[] | undefined>([]);
  const searchFormModel = ref<PropertyUnitRecord>({} as PropertyUnitRecord);
  const formShowTypeOptions = ref<EnumResp[]>([]);


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
      dataIndex: 'unitKeyId',
    },
    {
      title: '属性名称',
      dataIndex: 'unitKeyName',
    },
    {
      title: '属性单位',
      dataIndex: 'unitKeyUnit',
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
          ) || { label: data.record.formShowType }
        ).label;
      },
    },
    {
      title: '属性值',
      dataIndex: 'propertyUnitValues',
      render: (data) => {
        if (data.record.propertyUnitValues) {
          return data.record.propertyUnitValues
            .map((item: { unitValue: string }) => item.unitValue)
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
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);
  const fetchData = async (
    params: PropertyUnitSearchParam = { current: 1, pageSize: 20 }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryPropertyUnitList(params);
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
    searchFormModel.value = {} as PropertyUnitRecord;
  };

  const init = async () => {
    // 获取枚举值
    const enumsResponse = await queryEnum({
      moduleName: 'Property',
      enumName: 'FormShowType',
    });
    formShowTypeOptions.value = enumsResponse.data;
  };

  const deleteCategoryStore = (record: TableData) => {
    Modal.confirm({
      title: `确认删除 [${record.propertyKeyName}]？`,
      content: '确认删除？？？',
      onOk: async () => {
        const params = {
          unitKeyId: record.unitKeyId,
        } as PropertyUnitRecord;
        await deleteByUnitKeyId(params);
        search();
      },
    });
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
