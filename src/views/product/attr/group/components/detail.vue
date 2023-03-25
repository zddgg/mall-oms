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
                  field="groupName"
                  show-colon
                  :rules="[
                  { required: !readonly, message: '属性组名称不能为空！' },
                ]"
              >
                <a-input
                    v-if="!readonly"
                    v-model="formData.groupName"
                    placeholder="请填写属性组名称"
                />
                <span v-else>{{ formData.groupName }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="8" v-if="!readonly">
              <a-form-item
                  label="选择属性"
                  show-colon
              >
                <a-button type="primary" @click="attrUnitModalShow = true">
                  添加
                </a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card
            class="general-card"
            title="已绑定属性信息"
        >
          <a-table
              row-key="id"
              :loading="loading"
              :pagination="false"
              :columns="columns"
              :data="formData.attrUnitRecords"
              :bordered="false"
              :size="'medium'"
          >
            <template #operations="{ record }">
              <a-space>
                <a-button
                    v-if="!readonly"
                    size="small"
                    @click="unBindAttrUnit(record.attrId)"
                >
                  删除
                </a-button>
              </a-space>
            </template>
          </a-table>
        </a-card>
        <a-card v-if="!readonly" class="general-card" title="新添加属性信息">
          <a-table
              row-key="id"
              :loading="loading"
              :pagination="false"
              :columns="columns"
              :data="newAttrUnitRecords"
              :bordered="false"
              :size="'medium'"
          >
            <template #operations="{ rowIndex }">
              <a-space>
                <a-button
                    v-if="!readonly"
                    size="small"
                    @click="newAttrUnitRecords.splice(rowIndex, 1)"
                >
                  删除
                </a-button>
              </a-space>
            </template>
          </a-table>
        </a-card>
      </a-space>
      <div v-if="!readonly" class="actions">
        <a-space>
          <a-button type="primary" html-type="submit" :loading="loading">
            提交
          </a-button>
          <a-button @click="reset"> 重置</a-button>
        </a-space>
      </div>
    </a-form>
    <a-modal
        v-model:visible="attrUnitModalShow"
        title="属性单元信息"
        unmount-on-close
        width="auto"
        :body-style="{ padding: 0, width: '1080px' }"
        @ok="propertyUnitModalOk"
        @cancel="modalCancel"
    >
      <property-unit-table
          ref="propertyUnitTableRef"
          :row-selection-param="{type: 'checkbox', showCheckedAll: true}"
      />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {FormInstance} from '@arco-design/web-vue/es/form';
import useLoading from '@/hooks/loading';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import {useRoute, useRouter} from 'vue-router';
import {
  AttrGroupCreate,
  AttrGroupRecord,
  AttrUnitRecord,
  createAttrGroup,
  getBindAttrUnitByGroupId,
  queryAttrGroupDetail,
  queryAttrUnitDetail,
  unBindAttrUnitByAttrId,
  updateAttrGroup,
} from '@/api/product/property';
import {EnumResp, queryEnum} from '@/api/common/enum';
import {TableData} from '@arco-design/web-vue/es/table/interface.d';
import {Message} from '@arco-design/web-vue';
import PropertyUnitTable from "@/views/product/property/components/propertyUnitTable.vue";

const router = useRouter();
const route = useRoute();

const formRef = ref<FormInstance>();
const {loading, setLoading} = useLoading();
const formShowTypeOptions = ref<EnumResp[]>([]);
// 0-create, 1-view, 2-edit, 3-audit
const action = ref<string | string[]>('');
const readonly = ref<boolean>(true);
const attrUnitModalShow = ref<boolean>(false);

const formData = ref<AttrGroupRecord>({} as AttrGroupRecord);
const newAttrUnitRecords = ref<AttrUnitRecord[]>([]);
const propertyUnitTableRef = ref({
  selectedKeysHandler: () => [],
})

const addNewAttrUnit = async (attrId: string) => {
  const {data} = await queryAttrUnitDetail({attrId});
  console.log(data)
  newAttrUnitRecords.value.push(data);
}

const propertyUnitModalOk = async () => {
  const keyIds = propertyUnitTableRef.value.selectedKeysHandler();
  console.log(keyIds)
  if (!keyIds || keyIds.length === 0) {
    Message.warning('没有选择属性数据！');
  } else {
    keyIds.forEach((item) => {
      const find = formData.value.attrUnitRecords?.find((attrUnit) => attrUnit.attrId === item);
      if (!!find) {
        Message.error(`属性[${find.attrName}]已添加!`)
      } else {
        addNewAttrUnit(item);
      }
    })
  }
  modalCancel();
}

const modalCancel = () => {
  attrUnitModalShow.value = false;
}

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
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
  },
]);

const reset = () => {
  formData.value = {};
};

const unBindAttrUnit = async (attrId: string) => {
  if (!attrId) {
    return;
  }
  try {
    const {msg} = await unBindAttrUnitByAttrId({groupId: formData.value.groupId, attrId});
    const {data} = await getBindAttrUnitByGroupId({groupId: formData.value.groupId});
    formData.value.attrUnitRecords = data;
    Message.info(msg)
  } catch (err) {
    // ddd
  }
}

const handleSubmit = async () => {
  setLoading(true);
  try {
    const params: AttrGroupCreate = {
      groupName: formData.value.groupName,
      attrIds: newAttrUnitRecords.value.map((item) => item.attrId) as []
    };

    if (action.value === '2') {
      const {groupId} = route.params;
      params.groupId = groupId as string;
    }

    if (action.value === '0') {
      const result = await createAttrGroup(params);
      await router.push({
        name: 'AttrGroup',
      });
      Message.info(result.msg);
    } else if (action.value === '2') {
      const result = await updateAttrGroup(params);
      await router.push({
        name: 'AttrGroup',
      });
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
  const {groupId} = route.params;
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
      const params: AttrGroupRecord = {
        groupId: groupId as string,
      };
      const {data} = await queryAttrGroupDetail(params);
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
