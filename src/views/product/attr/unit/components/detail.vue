<template>
  <div class="container">
    <a-card class="general-card">
      <a-form
          ref="formRef"
          :model="formData"
          :label-col-props="{ span: 6 }"
          :wrapper-col-props="{ span: 18 }"
          style="width: 800px"
          @submit-success="handleSubmit"
      >
        <a-space direction="vertical" :size="16">
          <a-card class="general-card" title="基础信息">
            <a-form-item
                field="attrName"
                label="属性名称"
                show-colon
                :rules="[{ required: !readonly, message: 'name is required' }]"
            >
              <a-input
                  v-if="!readonly"
                  v-model="formData.attrName"
                  placeholder="请输入类目名称"
              />
              <span v-else>{{ formData.attrName }}</span>
            </a-form-item>

            <a-form-item field="unitKeyUnit" label="属性单位" show-colon>
              <a-input
                  v-if="!readonly"
                  v-model="formData.unit"
                  placeholder="请输入属性单位"
              />
              <span v-else>{{ formData.unit }}</span>
            </a-form-item>

            <a-form-item field="formShowType" label="表单展示方式" show-colon>
              <a-select
                  v-if="!readonly"
                  v-model="formData.formShowType"
                  :options="formShowTypeOptions"
                  placeholder="请选择表单展示方式"
                  @change="formShowTypeChange"
              />
              <span v-else>
                {{
                  (
                      formShowTypeOptions.find(
                          (item) => item.value === formData.formShowType
                      ) || {label: formData.formShowType}
                  ).label
                }}
              </span>
            </a-form-item>
            <a-form-item
                v-if="
                formData.formShowType === '2' ||
                formData.formShowType === '3' ||
                formData.formShowType === '4'
              "
                label="属性可选值"
                :help="
                readonly || formData.formShowType === '2'
                  ? null
                  : '可拖拽调整属性值顺序'
              "
                show-colon
            >
              <a-table
                  :columns="showColumns"
                  :data="formData.attrUnitValues"
                  size="medium"
                  :pagination="false"
                  :draggable="
                  readonly || formData.formShowType === '2'
                    ? null
                    : { type: 'handle', width: 40 }
                "
                  @change="handleChange"
              >
                <template #index="{ rowIndex }">
                  <span>{{ rowIndex }}</span>
                </template>
                <template #desc="{ rowIndex }">
                  <span>{{ rowIndex === 0 ? '选中' : '未选中' }}</span>
                </template>
                <template #attrValue="{ record }">
                  <a-input
                      v-if="!readonly"
                      v-model="record.attrValueName"
                      :disabled="record.confirmed"
                      @change="
                      (value) => {
                        record.attrValueName = value.trim();
                      }
                    "
                  />
                  <span v-else>{{ record.attrValueName }}</span>
                </template>
                <template #operations="{ record, rowIndex }">
                  <a-space>
                    <a-button
                        size="small"
                        :type="record.confirmed ? 'secondary' : 'primary'"
                        @click="
                        () => {
                          if (!record.confirmed && !record.attrValueName) {
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
                          formData.attrUnitValues?.splice(
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
                v-if="
                !readonly &&
                (formData.formShowType === '3' ||
                  formData.formShowType === '4')
              "
            >
              <a-space>
                <a-button type="primary" @click="handleAdd">
                  添加属性值
                </a-button>
              </a-space>
            </a-form-item>
            <a-form-item
                v-if="!readonly && formData.attrName"
                style="margin-top: 20px"
            >
              <a-space>
                <a-button
                    type="primary"
                    @click="
                    () => {
                      showPreview = !showPreview;
                    }
                  "
                >
                  {{ showPreview ? '关闭预览' : '预览' }}
                </a-button>
              </a-space>
            </a-form-item>
          </a-card>
          <a-card v-if="showPreview" class="general-card" title="预览">
            <a-form-item :label="formData.attrName" show-colon>
              <a-input v-if="formData.formShowType === '0'">
                <template #suffix>
                  {{ formData.unit }}
                </template>
              </a-input>
              <a-input-number v-if="formData.formShowType === '1'">
                <template #suffix>
                  {{ formData.unit }}
                </template>
              </a-input-number>
              <a-switch v-if="formData.formShowType === '2'">
                <template
                    v-if="formData.attrUnitValues?.length === 2"
                    #checked
                >
                  {{ formData.attrUnitValues[0].unitValue }}
                </template>
                <template
                    v-if="formData.attrUnitValues?.length === 2"
                    #unchecked
                >
                  {{ formData.attrUnitValues[1].unitValue }}
                </template>
              </a-switch>
              <a-select
                  v-if="formData.formShowType === '3'"
                  :options="
                  formData.attrUnitValues?.map((item) => {
                    return {
                      label: item.attrValueName,
                      value: item.attrValueName,
                    };
                  })
                "
              />
              <a-select v-if="formData.formShowType === '4'" multiple/>
              <a-date-picker v-if="formData.formShowType === '5'"/>
              <a-range-picker v-if="formData.formShowType === '6'"/>
              <a-range-picker
                  v-if="formData.formShowType === '7'"
                  show-time
              />
              <a-time-picker v-if="formData.formShowType === '8'"/>
              <a-time-picker
                  v-if="formData.formShowType === '9'"
                  type="time-range"
              />
            </a-form-item>
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
  AttrUnitRecord,
  AttrUnitValue,
  createAttrUnit,
  queryAttrUnitDetail,
  updateAttrUnit
} from '@/api/product/property';
import {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import cloneDeep from 'lodash/cloneDeep';
import {EnumResp, queryEnum} from '@/api/common/enum';

type Column = TableColumnData & { hiddenInTable?: false };

const formRef = ref<FormInstance>();
const showColumns = ref<Column[]>([]);
const showPreview = ref<boolean>(false);
const router = useRouter();
const route = useRoute();

// 0-create, 1-view, 2-edit, 3-audit
const action = ref<string | string[]>('');
const readonly = ref<boolean>(true);

const formData = ref<AttrUnitRecord>({} as AttrUnitRecord);

const handleAdd = () => {
  formData.value.attrUnitValues?.push({
    attrValueName: '',
    attrValueOrder: 0,
    confirmed: false,
  });
};

const handleChange = (newData: AttrUnitValue[]) => {
  formData.value.attrUnitValues = newData;
};

const columns = computed<TableColumnData[]>(() => [
  {
    title: '#',
    dataIndex: 'index',
    slotName: 'index',
  },
  {
    title: '描述',
    slotName: 'desc',
    hiddenInTable: formData.value.formShowType !== '2',
  },
  {
    title: '属性值',
    dataIndex: 'attrValueName',
    slotName: 'attrValue',
  },
  {
    title: '操作',
    slotName: 'operations',
    hiddenInTable: readonly.value,
  },
  {
    title: '属性值顺序',
    dataIndex: 'attrValueOrder',
    hiddenInTable: !readonly.value,
  },
]);

const {loading, setLoading} = useLoading(false);

const reset = () => {
  formData.value = {} as AttrUnitRecord;
};

const handleSubmit = async () => {
  const find = formData.value.attrUnitValues?.find(
      (value: AttrUnitValue) => !value.confirmed
  );
  if (find) {
    Modal.error({
      title: '确认添加属性值步骤未完成！',
      content: `请确认属性值[${find.attrValueName}]是否正确！`,
    });
    return;
  }

  formData.value.attrUnitValues?.forEach((item, index) => {
    item.attrValueOrder = index;
  });

  setLoading(true);
  try {
    let params = formData.value;

    if (action.value === '2') {
      const {attrId} = route.params;
      params = {
        attrId: attrId as string,
        ...formData.value,
      };
    }

    if (action.value === '0') {
      const {msg} = await createAttrUnit(params);
      await router.push({
        name: 'AttrUnit',
      });
      Message.info(msg);
    } else if (action.value === '2') {
      const {msg} = await updateAttrUnit(params);
      await router.push({
        name: 'AttrUnit',
      });
      Message.info(msg);
    }
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const formShowTypeOptions = ref<EnumResp[]>([]);

const formShowTypeChange = (value: string) => {
  formData.value.attrUnitValues = [];
  if (value === '2') {
    const checked = {
      attrValueName: '',
      attrValueOrder: 0,
      confirmed: false,
    };
    const unchecked = {
      attrValueName: '',
      attrValueOrder: 1,
      confirmed: false,
    };
    formData.value.attrUnitValues.push(checked);
    formData.value.attrUnitValues.push(unchecked);
  }
};

const init = async () => {
  // actionType: 0-create, 1-view, 2-edit, 3-audit
  const {attrId} = route.params;
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
      const params: AttrUnitRecord = {
        attrId: attrId as string,
      };
      const {data} = await queryAttrUnitDetail(params);
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
