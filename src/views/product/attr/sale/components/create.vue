<template>
  <div class="container">
    <a-space direction="vertical">
      <a-card class="general-card" title="基础信息">
        <a-form
            ref="formRef"
            :model="formData"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            style="width: 800px"
            @submit-success="handleSubmit"
        >
          <a-form-item
              field="attrName"
              label="销售属性名称"
              show-colon
              :rules="[{ required: !readonly, message: '请输入销售属性名称' }]"
          >
            <a-input
                v-model="formData.attrName"
                placeholder="请输入销售属性名称"
                style="width: 80%"
            />
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
            :columns="columns"
            :data="formData.attrSaleValues"
            size="medium"
            :pagination="false"
        >
          <template #index="{ rowIndex }">
            <span>{{ rowIndex }}</span>
          </template>
          <template #attrValueName="{ record }">
            <a-input v-model="record.attrValueName"/>
          </template>
          <template #operations="{ record, rowIndex}">
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
                  @click="formData.attrSaleValues?.splice(rowIndex, 1)"
              >
                删除
              </a-button>
            </a-space>
          </template>
        </a-table>
        <div style="margin-top: 20px">
          <a-button
              type="primary"
              @click="addAttrValue"
          >
            添加属性值
          </a-button>
        </div>
      </a-card>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import useLoading from '@/hooks/loading';
import {FormInstance} from '@arco-design/web-vue/es/form';
import {useRoute, useRouter} from 'vue-router';
import {AttrSaleCreate, createAttrSale} from '@/api/product/property';
import {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import {Message, Modal} from "@arco-design/web-vue";

const formRef = ref<FormInstance>();
const router = useRouter();
const route = useRoute();

// 0-create, 1-view, 2-edit, 3-audit
const action = ref<string | string[]>('');
const readonly = ref<boolean>(true);
const formData = ref<AttrSaleCreate>({attrSaleValues: [] as unknown} as AttrSaleCreate);

const columns = computed<TableColumnData[]>(() => [
  {
    title: '#',
    dataIndex: 'index',
    slotName: 'index',
  },
  {
    title: '属性值名称',
    dataIndex: 'attrValueName',
    slotName: 'attrValueName',
  },
  {
    title: '操作',
    slotName: 'operations',
  },
]);

const {loading, setLoading} = useLoading(false);

const cancel = () => {
  router.push({
    name: 'AttrSale',
  });
};

const handleSubmit = async () => {

  if (!formData.value.attrSaleValues || formData.value.attrSaleValues.length === 0) {
    Message.error('属性值不能为空!');
    return;
  }

  const find = formData.value.attrSaleValues?.find(
      (value: { confirmed?: boolean }) => !value.confirmed
  );
  if (find) {
    Modal.error({
      title: '确认添加属性值步骤未完成！',
      content: `请确认属性值[${find.attrValueName}]是否正确！`,
    });
    return;
  }

  setLoading(true);
  try {
    if (action.value === '0') {
      const {msg} = await createAttrSale(formData.value);
      Message.info(msg);
      await router.push({
        name: 'AttrSale'
      })
    }
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const addAttrValue = async () => {
  formData.value.attrSaleValues?.push({attrValueName: ''});
}

const init = async () => {
  // actionType: 0-create, 1-view, 2-edit, 3-audit
  const {actionType} = route.query;
  action.value = actionType as string;
  readonly.value = (actionType as string) === '1';
};

init();
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
