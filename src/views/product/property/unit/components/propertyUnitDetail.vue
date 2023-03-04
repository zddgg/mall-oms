<template>
  <div class="container">
    <a-card class="general-card">
      <a-form
        ref="formRef"
        :model="propertyUnitData"
        :label-col-props="{ span: 6 }"
        :wrapper-col-props="{ span: 18 }"
        style="width: 800px"
        @submit-success="handleSubmit"
      >
        <a-space direction="vertical" :size="16">
          <a-card class="general-card" title="基础信息">
            <a-form-item
              field="unitKeyName"
              label="属性名称"
              show-colon
              :rules="[{ required: !readonly, message: 'name is required' }]"
            >
              <a-input
                v-if="!readonly"
                v-model="propertyUnitData.unitKeyName"
                placeholder="请输入类目名称"
              />
              <span v-else>{{ propertyUnitData.unitKeyName }}</span>
            </a-form-item>

            <a-form-item field="unitKeyUnit" label="属性单位" show-colon>
              <a-input
                v-if="!readonly"
                v-model="propertyUnitData.unitKeyUnit"
                placeholder="请输入属性单位"
              />
              <span v-else>{{ propertyUnitData.unitKeyUnit }}</span>
            </a-form-item>

            <a-form-item field="formShowType" label="表单展示方式" show-colon>
              <a-select
                v-if="!readonly"
                v-model="propertyUnitData.formShowType"
                :options="formShowTypeOptions"
                placeholder="请选择表单展示方式"
                @change="formShowTypeChange"
              />
              <span v-else>
                {{
                  (
                    formShowTypeOptions.find(
                      (item) => item.value === propertyUnitData.formShowType
                    ) || { label: propertyUnitData.formShowType }
                  ).label
                }}
              </span>
            </a-form-item>
            <a-form-item
              v-if="
                propertyUnitData.formShowType === '2' ||
                propertyUnitData.formShowType === '3' ||
                propertyUnitData.formShowType === '4'
              "
              label="属性可选值"
              :help="
                readonly || propertyUnitData.formShowType === '2'
                  ? null
                  : '可拖拽调整属性值顺序'
              "
              show-colon
            >
              <a-table
                :columns="showColumns"
                :data="propertyUnitData.propertyUnitValues"
                size="medium"
                style="width: 100%"
                :pagination="false"
                :draggable="
                  readonly || propertyUnitData.formShowType === '2'
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
                <template #unitValue="{ record }">
                  <a-input
                    v-if="!readonly"
                    v-model="record.unitValue"
                    :disabled="record.confirmed"
                    @change="
                      (value) => {
                        record.unitValue = value.trim();
                      }
                    "
                  />
                  <span v-else>{{ record.unitValue }}</span>
                </template>
                <template #operations="{ record, rowIndex }">
                  <a-space>
                    <a-button
                      size="small"
                      :type="record.confirmed ? 'secondary' : 'primary'"
                      @click="
                        () => {
                          if (!record.confirmed && !record.unitValue) {
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
                          propertyUnitData.propertyUnitValues?.splice(
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
                (propertyUnitData.formShowType === '3' ||
                  propertyUnitData.formShowType === '4')
              "
            >
              <a-space>
                <a-button type="primary" @click="handleAdd">
                  添加属性值
                </a-button>
              </a-space>
            </a-form-item>
            <a-form-item
              v-if="!readonly && propertyUnitData.unitKeyName"
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
            <a-form-item :label="propertyUnitData.unitKeyName" show-colon>
              <a-input v-if="propertyUnitData.formShowType === '0'">
                <template #suffix>
                  {{ propertyUnitData.unitKeyUnit }}
                </template>
              </a-input>
              <a-input-number v-if="propertyUnitData.formShowType === '1'">
                <template #suffix>
                  {{ propertyUnitData.unitKeyUnit }}
                </template>
              </a-input-number>
              <a-switch v-if="propertyUnitData.formShowType === '2'">
                <template
                  v-if="propertyUnitData.propertyUnitValues?.length === 2"
                  #checked
                >
                  {{ propertyUnitData.propertyUnitValues[0].unitValue }}
                </template>
                <template
                  v-if="propertyUnitData.propertyUnitValues?.length === 2"
                  #unchecked
                >
                  {{ propertyUnitData.propertyUnitValues[1].unitValue }}
                </template>
              </a-switch>
              <a-select
                v-if="propertyUnitData.formShowType === '3'"
                :options="
                  propertyUnitData.propertyUnitValues?.map((item) => {
                    return {
                      label: item.unitValue,
                      value: item.unitValue,
                    };
                  })
                "
              />
              <a-select v-if="propertyUnitData.formShowType === '4'" multiple />
              <a-date-picker v-if="propertyUnitData.formShowType === '5'" />
              <a-range-picker v-if="propertyUnitData.formShowType === '6'" />
              <a-range-picker
                v-if="propertyUnitData.formShowType === '7'"
                show-time
              />
              <a-time-picker v-if="propertyUnitData.formShowType === '8'" />
              <a-time-picker
                v-if="propertyUnitData.formShowType === '9'"
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
            <a-button @click="reset"> 重置 </a-button>
          </a-space>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import useLoading from '@/hooks/loading';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { Message, Modal } from '@arco-design/web-vue';
  import { useRoute, useRouter } from 'vue-router';
  import {
    createPropertyUnit,
    editPropertyUnit,
    PropertyUnitRecord,
    PropertyUnitValue,
    queryPropertyUnitDetail,
  } from '@/api/product/property';
  import { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import { EnumResp, queryEnum } from '@/api/common/enum';

  type Column = TableColumnData & { hiddenInTable?: false };

  const formRef = ref<FormInstance>();
  const showColumns = ref<Column[]>([]);
  const showPreview = ref<boolean>(false);
  const router = useRouter();
  const route = useRoute();

  // 0-create, 1-view, 2-edit, 3-audit
  const action = ref<string | string[]>('');
  const readonly = ref<boolean>(true);

  const propertyUnitData = ref<PropertyUnitRecord>({} as PropertyUnitRecord);

  const handleAdd = () => {
    propertyUnitData.value.propertyUnitValues?.push({
      unitValue: '',
      unitValueOrder: 0,
      confirmed: false,
    });
  };

  const handleChange = (newData: PropertyUnitValue[]) => {
    propertyUnitData.value.propertyUnitValues = newData;
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
      hiddenInTable: propertyUnitData.value.formShowType !== '2',
    },
    {
      title: '属性值',
      dataIndex: 'unitValue',
      slotName: 'unitValue',
    },
    {
      title: '操作',
      slotName: 'operations',
      hiddenInTable: readonly.value,
    },
    {
      title: '属性值顺序',
      dataIndex: 'unitValueOrder',
      hiddenInTable: !readonly.value,
    },
  ]);

  const { loading, setLoading } = useLoading(false);

  const reset = () => {
    propertyUnitData.value = {} as PropertyUnitRecord;
  };

  const handleSubmit = async () => {
    const find = propertyUnitData.value.propertyUnitValues?.find(
      (value: PropertyUnitValue) => !value.confirmed
    );
    if (find) {
      Modal.error({
        title: '确认添加属性值步骤未完成！',
        content: `请确认属性值[${find.unitValue}]是否正确！`,
      });
      return;
    }

    propertyUnitData.value.propertyUnitValues?.forEach((item, index) => {
      item.unitValueOrder = index;
    });

    setLoading(true);
    try {
      let params = propertyUnitData.value;

      if (action.value === '2') {
        const { unitKeyId } = route.params;
        params = {
          unitKeyId: unitKeyId as string,
          ...propertyUnitData.value,
        };
      }

      if (action.value === '0') {
        const result = await createPropertyUnit(params);
        await router.push({
          name: 'PropertyStoreList',
        });
        Message.info(result.msg);
      } else if (action.value === '2') {
        const result = await editPropertyUnit(params);
        await router.push({
          name: 'PropertyStoreList',
        });
        Message.info(result.msg);
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const formShowTypeOptions = ref<EnumResp[]>([]);

  const formShowTypeChange = (value: string) => {
    propertyUnitData.value.propertyUnitValues = [];
    if (value === '2') {
      const checked = {
        unitValue: '',
        unitValueOrder: 0,
        confirmed: false,
      };
      const unchecked = {
        unitValue: '',
        unitValueOrder: 1,
        confirmed: false,
      };
      propertyUnitData.value.propertyUnitValues.push(checked);
      propertyUnitData.value.propertyUnitValues.push(unchecked);
    }
  };

  const init = async () => {
    // actionType: 0-create, 1-view, 2-edit, 3-audit
    const { unitKeyId } = route.params;
    const { actionType } = route.query;
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
        const params: PropertyUnitRecord = {
          unitKeyId: unitKeyId as string,
        };
        const { data } = await queryPropertyUnitDetail(params);
        propertyUnitData.value = data;
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
    { deep: true, immediate: true }
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
