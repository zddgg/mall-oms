<template>
  <div class="container">
    <a-space direction="vertical">
      <a-card class="general-card" title="基础信息">
        <a-form
            ref="formRef"
            :model="propertySaleKeyData"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            style="width: 800px"
            @submit-success="handleSubmit"
        >
          <a-form-item
              field="keyName"
              label="销售属性名称"
              show-colon
              :rules="[{ required: !readonly, message: 'name is required' }]"
          >
            <a-input
                v-if="!readonly"
                v-model="propertySaleKeyData.keyName"
                placeholder="请输入类目名称"
                style="width: 80%"
            />
            <span v-else>{{ propertySaleKeyData.keyName }}</span>
          </a-form-item>
          <div class="actions">
            <a-space>
              <a-button type="primary" html-type="submit" :loading="loading">
                提交
              </a-button>
              <a-button @click="cancel">取消</a-button>
            </a-space>
          </div>
        </a-form>
      </a-card>
      <a-card class="general-card" title="属性值">
        <a-table
            :columns="showColumns"
            :data="propertySaleValueData"
            size="medium"
            :pagination="false"
        >
          <template #index="{ rowIndex }">
            <span>{{ rowIndex }}</span>
          </template>
          <template #desc="{ rowIndex }">
            <span>{{ rowIndex === 0 ? '选中' : '未选中' }}</span>
          </template>
          <template #operations="{ record}">
            <a-space>
              <a-button
                  size="small"
                  @click="deleteAttrValue(record)"
              >
                删除
              </a-button>
            </a-space>
          </template>
        </a-table>
        <div style="margin-top: 20px">
          <div v-if="showAddAttrBtn">
            <a-button
                type="primary"
                @click="showAddAttrBtn = false"
            >
              添加属性值
            </a-button>
          </div>
          <div v-else>
            <a-form-item label="添加属性值" show-colon>
              <a-input style="width: 40%" v-model="newAttrName"/>
              <a-button type="primary"
                        @click="addAttrValue"
              >确认添加
              </a-button>
            </a-form-item>
          </div>
        </div>
      </a-card>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue';
import useLoading from '@/hooks/loading';
import {FormInstance} from '@arco-design/web-vue/es/form';
import {Message, Modal} from '@arco-design/web-vue';
import {useRoute, useRouter} from 'vue-router';
import {
  addValue,
  deleteValue,
  editKey,
  PropertySaleKey,
  PropertySaleRecord,
  PropertySaleValue,
  queryKeyDetail,
  queryValueList
} from '@/api/product/property';
import {TableColumnData, TableData} from '@arco-design/web-vue/es/table/interface';
import cloneDeep from 'lodash/cloneDeep';

type Column = TableColumnData & { hiddenInTable?: false };

const formRef = ref<FormInstance>();
const showColumns = ref<Column[]>([]);
const router = useRouter();
const route = useRoute();

// 0-create, 1-view, 2-edit, 3-audit
const action = ref<string | string[]>('');
const readonly = ref<boolean>(true);
const showAddAttrBtn = ref<Boolean>(true);
const newAttrName = ref<String>('')
const propertySaleKeyData = ref<PropertySaleKey>({} as PropertySaleKey);
const propertySaleValueData = ref<PropertySaleValue[]>([]);

const columns = computed<TableColumnData[]>(() => [
  {
    title: '#',
    dataIndex: 'index',
    slotName: 'index',
  },
  {
    title: '属性值编号',
    dataIndex: 'valueId',
    slotName: 'valueId',
  },
  {
    title: '属性值名称',
    dataIndex: 'valueName',
    slotName: 'valueName',
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

const cancel = () => {
  router.push({
    name: 'PropertySale',
  });
};

const handleSubmit = async () => {
  setLoading(true);
  try {
    if (action.value === '2') {
      const result = await editKey(propertySaleKeyData.value);
      await router.push({
        name: 'PropertySale',
      });
      Message.info(result.msg);
    }
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const addAttrValue = async () => {
  if (newAttrName.value) {
    setLoading(true);
    try {
      const params = {
        keyId: propertySaleKeyData.value.keyId as string,
        valueName: newAttrName.value as string
      }
      const {msg} = await addValue(params)
      newAttrName.value = ''
      Message.info(msg);
      showAddAttrBtn.value = true;
      await refreshAttrValueList();
    } catch (err) {
      // do
    } finally {
      setLoading(false);
    }
  }
}

const deleteAttrValue = async (record: TableData) => {
  Modal.confirm(
      {
        title: `确认删除 [${record.valueName}]？`,
        content: '确认删除？？？',
        onOk: async () => {
          const params = {keyId: record.keyId, valueId: record.valueId};
          const {msg} = await deleteValue(params);
          Message.info(msg)
          await refreshAttrValueList();
        },
      }
  )
}

const refreshAttrValueList = async () => {
  const params = {
    keyId: propertySaleKeyData.value.keyId as string
  }
  const valueList = await queryValueList(params);
  propertySaleValueData.value = valueList.data
}

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
      const keyDetail = await queryKeyDetail({keyId: keyId as string});
      propertySaleKeyData.value = keyDetail.data;
      await refreshAttrValueList();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  }
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
