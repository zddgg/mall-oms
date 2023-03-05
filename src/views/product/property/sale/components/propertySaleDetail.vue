<template>
  <div class="container">
    <a-card class="general-card">
      <a-form
          ref="formRef"
          :model="propertySaleData"
          :label-col-props="{ span: 6 }"
          :wrapper-col-props="{ span: 18 }"
          style="width: 800px"
          @submit-success="handleSubmit"
      >
        <a-space direction="vertical" :size="16">
          <a-card class="general-card" title="基础信息">
            <a-form-item
                field="keyName"
                label="销售属性名称"
                show-colon
                :rules="[{ required: !readonly, message: 'name is required' }]"
            >
              <a-input
                  v-if="!readonly"
                  v-model="propertySaleData.keyName"
                  placeholder="请输入类目名称"
              />
              <span v-else>{{ propertySaleData.keyName }}</span>
            </a-form-item>
            <a-form-item
                label="属性可选值"
                :help="readonly ? null : '可拖拽调整属性值顺序'"
                show-colon
            >
              <a-table
                  :columns="showColumns"
                  :data="propertySaleData.propertySaleValues"
                  size="medium"
                  style="width: 100%"
                  :pagination="false"
                  :draggable="readonly ? null : { type: 'handle', width: 40 }"
                  @change="handleChange"
              >
                <template #index="{ rowIndex }">
                  <span>{{ rowIndex }}</span>
                </template>
                <template #desc="{ rowIndex }">
                  <span>{{ rowIndex === 0 ? '选中' : '未选中' }}</span>
                </template>
                <template #propertyValue="{ record }">
                  <a-input
                      v-if="!readonly"
                      v-model="record.propertyValue"
                      :disabled="record.confirmed"
                      @change="
                      (value) => {
                        record.propertyValue = value.trim();
                      }
                    "
                  />
                  <span v-else>{{ record.propertyValue }}</span>
                </template>
                <template #operations="{ record, rowIndex }">
                  <a-space>
                    <a-button
                        size="small"
                        :type="record.confirmed ? 'secondary' : 'primary'"
                        @click="
                        () => {
                          if (!record.confirmed && !record.propertyValue) {
                            Modal.error({
                              title: '新增属性值不能为空！',
                              content: null,
                            });
                            return;
                          }
                          record.confirmed = !record.confirmed;
                        }
                      "
                    >
                      {{ record.confirmed ? '编辑' : '确认' }}
                    </a-button>
                    <a-button
                        size="small"
                        @click="
                        () => {
                          propertySaleData.propertySaleValues?.splice(
                            rowIndex,
                            1
                          );
                        }
                      "
                    >
                      删除
                    </a-button>
                  </a-space>
                </template>
              </a-table>
            </a-form-item>
            <a-form-item
                v-if="!readonly"
            >
              <a-space>
                <a-button type="primary" @click="handleAdd">
                  添加属性值
                </a-button>
              </a-space>
            </a-form-item>
          </a-card>
          <a-card v-if="showPreview" class="general-card" title="预览">
            <a-form-item :label="propertySaleData.keyName" show-colon>
              <a-input>
              </a-input>
            </a-form-item>
          </a-card>
        </a-space>
        <div class="actions" v-if="!readonly">
          <a-space>
            <a-button type="primary" html-type="submit" :loading="loading">
              提交
            </a-button>
            <a-button @click="reset"> 重置</a-button>
          </a-space>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue';
import useLoading from '@/hooks/loading';
import {FormInstance} from '@arco-design/web-vue/es/form';
import {Message, Modal} from '@arco-design/web-vue';
import {useRoute, useRouter} from 'vue-router';
import {
  createPropertySale,
  editPropertySale,
  PropertySaleRecord,
  PropertySaleValue,
  queryPropertySaleDetail
} from '@/api/product/property';
import {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import cloneDeep from 'lodash/cloneDeep';

type Column = TableColumnData & { hiddenInTable?: false };

const formRef = ref<FormInstance>();
const showColumns = ref<Column[]>([]);
const showPreview = ref<boolean>(false);
const router = useRouter();
const route = useRoute();

// 0-create, 1-view, 2-edit, 3-audit
const action = ref<string | string[]>('');
const readonly = ref<boolean>(true);

const propertySaleData = ref<PropertySaleRecord>({
  propertySaleValues: []
} as PropertySaleRecord);

const handleAdd = () => {
  propertySaleData.value.propertySaleValues?.push({
    propertyValue: '',
    propertyOrder: 0,
    confirmed: false,
  });
};

const handleChange = (newData: PropertySaleValue[]) => {
  propertySaleData.value.propertySaleValues = newData;
};

const columns = computed<TableColumnData[]>(() => [
  {
    title: '#',
    dataIndex: 'index',
    slotName: 'index',
  },
  {
    title: '属性值',
    dataIndex: 'propertyValue',
    slotName: 'propertyValue',
  },
  {
    title: '操作',
    slotName: 'operations',
    hiddenInTable: readonly.value,
  },
  {
    title: '属性值顺序',
    dataIndex: 'propertyOrder',
    hiddenInTable: !readonly.value,
  },
]);

const {loading, setLoading} = useLoading(false);

const reset = () => {
  propertySaleData.value = {} as PropertySaleRecord;
};

const handleSubmit = async () => {
  const find = propertySaleData.value.propertySaleValues?.find(
      (value: PropertySaleValue) => !value.confirmed
  );
  if (find) {
    Modal.error({
      title: '确认添加属性值步骤未完成！',
      content: `请确认属性值[${find.propertyValue}]是否正确！`,
    });
    return;
  }

  propertySaleData.value.propertySaleValues?.forEach((item, index) => {
    item.propertyOrder = index;
  });

  setLoading(true);
  try {
    let params = propertySaleData.value;

    if (action.value === '2') {
      const {keyId} = route.params;
      params = {
        keyId: keyId as string,
        ...propertySaleData.value,
      };
    }

    if (action.value === '0') {
      const result = await createPropertySale(params);
      // await router.push({
      //   name: 'PropertyStoreList',
      // });
      Message.info(result.msg);
    } else if (action.value === '2') {
      const result = await editPropertySale(params);
      // await router.push({
      //   name: 'PropertyStoreList',
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
  const {keyId} = route.params;
  const {actionType} = route.query;
  action.value = actionType as string;
  readonly.value = (actionType as string) === '1';

  // action
  // if (action.value === '0') {
  //   console.log('actionType create ', action.value);
  //   console.log(readonly.value);
  // } else
  if (action.value === '1' || action.value === '2') {
    setLoading(true);
    try {
      const params: PropertySaleRecord = {
        keyId: keyId as string,
      };
      const {data} = await queryPropertySaleDetail(params);
      propertySaleData.value = data;
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

watch(
    () => columns.value,
    (val) => {
      showColumns.value = cloneDeep(val);
      showColumns.value = showColumns.value.filter((item) => {
        return !item.hiddenInTable;
      });
    },
    {deep: true, immediate: true}
);
</script>

<style scoped lang="less">
.container {
  width: 100%;
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
