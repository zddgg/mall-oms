<template>
  <div class="container">
    <a-spin :loading="loading" style="width: 100%">
      <a-card class="general-card" title="新增品牌">
        <div class="wrapper">
          <a-form
              ref="formRef"
              :model="formData"
              class="form"
              :label-col-props="{ span: 6 }"
              :wrapper-col-props="{ span: 18 }"
              @submit-success="submitSuccess"
          >
            <a-form-item
                field="merNo"
                label="选择商户"
                :rules="[{ required: true, message: 'name is required' }]"
            >
              <a-select
                  placeholder="请选择商户"
                  v-model="formData.merNo"
                  :options="merchantOptions"
                  :field-names="{value: 'merNo', label: 'merName'}"
                  allow-search
                  :disabled="action !== '0'"
              >
              </a-select>
            </a-form-item>
            <a-form-item
                field="storeName"
                label="店铺名称"
                :rules="[{ required: true, message: 'name is required' }]"
            >
              <a-input
                  v-model="formData.storeName"
                  placeholder="请输入店铺名称"
              />
            </a-form-item>
            <a-form-item>
              <div>
                <a-button
                    type="primary"
                    html-type="submit"
                    style="margin-right: 80px"
                >
                  提交审核
                </a-button>
                <a-button type="primary" @click="reset"> 重置</a-button>
              </div>
            </a-form-item>
          </a-form>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import useLoading from '@/hooks/loading';
import {FormInstance} from '@arco-design/web-vue/es/form';
import {Message} from '@arco-design/web-vue';
import {useRoute, useRouter} from 'vue-router';
import {createStore, queryStoreDetail, StoreRecord, updateStore} from "@/api/store/store";
import {MerchantRecord, queryMerchantList} from "@/api/merchant/merchant";

const route = useRoute();
const router = useRouter();
const {loading, setLoading} = useLoading(false);

const action = ref<string | string[]>('');
const readonly = ref<boolean>(true);

const formRef = ref<FormInstance>();
const formData = ref<StoreRecord>({} as StoreRecord);
const merchantOptions = ref<MerchantRecord[] | undefined>([]);

const submitSuccess = async (values: Record<string, any>) => {
  setLoading(true);
  try {
    if (action.value === '0') {
      const result = await createStore(formData.value);
      await router.push({
        name: 'StoreList',
      });
      Message.info(result.msg);
    }
    if (action.value === '2') {
      const result = await updateStore(formData.value);
      await router.push({
        name: 'StoreList',
      });
      Message.info(result.msg);
    }
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const reset = () => {
  formData.value = {} as StoreRecord;
};

const queryMerchantData = async () => {
  try {
    const {data} = await queryMerchantList({pageSize: 1000, current: 1});
    merchantOptions.value = data.records;
  } catch (err) {
    // you can report use errorHandler or other
  }
}

const init = async () => {
  const {storeNo} = route.params;
  const {actionType} = route.query;
  action.value = actionType as string;
  readonly.value = (actionType as string) === '1';

  if (action.value === '1' || action.value === '2') {
    setLoading(true);
    try {
      const params: StoreRecord = {
        storeNo: storeNo as string,
      };
      const {data} = await queryStoreDetail(params);
      formData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  }
};

queryMerchantData();
init();
</script>`

<style scoped lang="less">
.container {
  padding: 20px;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 0;
  background-color: var(--color-bg-2);

  :deep(.arco-form) {
    .arco-form-item {
      &:last-child {
        margin-top: 20px;
      }
    }
  }
}

.form {
  width: 500px;
}
</style>
