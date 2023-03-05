<template>
  <div class="container">
    <a-form
        ref="formRef"
        :label-col-props="{ span: 8 }"
        :wrapper-col-props="{ span: 16 }"
        :model="formData"
        label-align="right"
        @submit-success="handleSubmit"
    >
      <a-space direction="vertical" :size="16">
        <a-card class="general-card" title="基础信息">
          <a-row :gutter="80">
            <a-col :span="8">
              <a-form-item
                  label="属性组名称"
                  field="propertyGroupName"
                  show-colon
                  :rules="[
                  { required: !readonly, message: '属性组名称不能为空！' },
                ]"
              >
                <a-input
                    v-if="!readonly"
                    v-model="formData.propertyGroupName"
                    placeholder="请填写属性组名称"
                />
                <span v-else>{{ formData.propertyGroupName }}</span>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card v-if="!readonly" class="general-card" title="选择属性">
          <a-row :gutter="80">
            <a-col :span="8">
              <a-form-item
                  label="属性名称"
                  field="propertySearchName"
                  show-colon
              >
                <a-input
                    v-model="propertySearchName"
                    placeholder="请填写属性名称"
                    allow-clear
                />
              </a-form-item>
            </a-col>
            <a-space :size="18">
              <a-button type="primary" @click="search">
                <template #icon>
                  <icon-search />
                </template>
                查询
              </a-button>
            </a-space>
          </a-row>
          <a-table
              v-if="propertyStoreData && propertyStoreData.length !== 0"
              row-key="id"
              :loading="loading"
              :pagination="pagination"
              :columns="columns"
              :data="propertyStoreData"
              :bordered="false"
              :size="'medium'"
              @page-change="onPageChange"
          >
            <template #operations="{ record }">
              <a-space>
                <a-button
                    size="small"
                    @click="
                    router.push({
                      name: 'PropertyUnitDetail',
                      params: {
                        propertyNo: record.unitKeyId,
                      },
                      query: {
                        actionType: '1',
                      },
                    })
                  "
                >
                  查看
                </a-button>
                <a-button
                    :disabled="
                    formData.propertyUnitKeys.find(
                      (item) => item.unitKeyId === record.unitKeyId
                    ) !== undefined
                  "
                    type="primary"
                    size="small"
                    @click="
                    () => {
                      formData.propertyUnitKeys.push(record);
                    }
                  "
                >
                  选择
                </a-button>
              </a-space>
            </template>
          </a-table>
        </a-card>
        <a-card
            v-if="formData.propertyUnitKeys.length !== 0"
            class="general-card"
            title="属性信息"
        >
          <a-table
              row-key="id"
              :loading="loading"
              :pagination="false"
              :columns="columns"
              :data="formData.propertyUnitKeys"
              :bordered="false"
              :size="'medium'"
          >
            <template #operations="{ rowIndex }">
              <a-space>
                <a-button
                    size="small"
                >
                  查看
                </a-button>
                <a-button
                    v-if="!readonly"
                    size="small"
                    @click="formData.propertyUnitKeys.splice(rowIndex, 1)"
                >
                  删除
                </a-button>
              </a-space>
            </template>
          </a-table>
        </a-card>
      </a-space>
      <div class="actions">
        <a-space>
          <a-button type="primary" html-type="submit" :loading="loading">
            提交
          </a-button>
          <a-button @click="reset"> 重置</a-button>
        </a-space>
      </div>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import {computed, reactive, ref} from 'vue';
import {FormInstance} from '@arco-design/web-vue/es/form';
import useLoading from '@/hooks/loading';

import {Pagination} from '@/types/global';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import {useRoute, useRouter} from 'vue-router';
import {
  createPropertyGroup,
  editPropertyGroup,
  PropertyGroupCreate,
  PropertyGroupRecord,
  PropertyUnitRecord,
  PropertyUnitSearchParam,
  queryPropertyGroupDetail,
  queryPropertyUnitList,
} from '@/api/product/property';
import {EnumResp, queryEnum} from '@/api/common/enum';
import {TableData} from '@arco-design/web-vue/es/table/interface.d';
import {Message, Modal} from '@arco-design/web-vue';

const router = useRouter();
const route = useRoute();

const formRef = ref<FormInstance>();
const {loading, setLoading} = useLoading();
const propertyStoreData = ref<PropertyUnitRecord[] | undefined>([]);
const formShowTypeOptions = ref<EnumResp[]>([]);
const propertySearchName = ref('');
// 0-create, 1-view, 2-edit, 3-audit
const action = ref<string | string[]>('');
const readonly = ref<boolean>(true);
const generateFormModel = () => {
  return {
    propertyGroupName: '',
    propertyUnitKeys: [],
  };
};
const formData = ref<PropertyGroupCreate>(generateFormModel());

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
          ) || {label: data.record.formShowType}
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
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
  },
]);

const fetchData = async (
    params: PropertyUnitSearchParam = {current: 1, pageSize: 10}
) => {
  setLoading(true);
  try {
    const {data} = await queryPropertyUnitList(params);
    propertyStoreData.value = data.records;
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
    propertyKeyName: propertySearchName.value,
  } as unknown as PropertyUnitSearchParam);
};

const onPageChange = (current: number) => {
  fetchData({
    ...basePagination,
    current,
  } as unknown as PropertyUnitSearchParam);
};

const reset = () => {
  formData.value = generateFormModel();
};

const handleSubmit = async () => {
  if (
      !formData.value.propertyUnitKeys ||
      formData.value.propertyUnitKeys.length === 0
  ) {
    Modal.error({
      title: '属性组属性列表为空！',
      content: `请添加属性！`,
    });
    return;
  }

  setLoading(true);
  try {
    const params = formData.value;

    if (action.value === '2') {
      const {propertyGroupId} = route.params;
      params.propertyGroupId = propertyGroupId as string;
    }

    if (action.value === '0') {
      const result = await createPropertyGroup(params);
      // await router.push({
      //   name: 'PropertyGroupList',
      // });
      Message.info(result.msg);
    } else if (action.value === '2') {
      const result = await editPropertyGroup(params);
      // await router.push({
      //   name: 'PropertyGroupList',
      // });
      Message.info(result.msg);
    }
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const init = async () => {
  // actionType: 0-create, 1-view, 2-edit, 3-audit
  const {propertyGroupId} = route.params;
  const {actionType} = route.query;
  action.value = actionType as string;
  readonly.value = (actionType as string) === '1';

  // 获取枚举值
  const enumsResponse = await queryEnum({
    moduleName: 'Property',
    enumName: 'FormShowType',
  });

  formShowTypeOptions.value = enumsResponse.data;

  // action
  // if (action.value === '0') {
  //   console.log('actionType create ', action.value);
  //   console.log(readonly.value);
  // } else
  if (action.value === '1' || action.value === '2') {
    setLoading(true);
    try {
      const params: PropertyGroupRecord = {
        propertyGroupId: propertyGroupId as string,
      };
      const {data} = await queryPropertyGroupDetail(params);
      formData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  }

  //   else if (action.value === '3') {
  //   console.log('actionType audit ', action.value);
  //   console.log(readonly.value);
  // }
};

init();

</script>

<style scoped lang="less">
.container {
  padding: 20px 20px 40px;
  overflow: hidden;
}

.actions {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  height: 60px;
  padding: 14px 20px 14px 0;
  text-align: right;
  background: var(--color-bg-2);
}
</style>
