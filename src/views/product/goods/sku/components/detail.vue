<template>
  <div class="container">
    <a-form ref="formRef" layout="vertical" :model="formData">
      <a-space direction="vertical" :size="16">
        <a-card class="general-card">
          <template #title>
            基本信息
          </template>
          <a-row :gutter="80">
            <a-col :span="8">
              <a-form-item
                label="SKU名称"
                field="skuName"
              >
                <a-input placeholder="请输入SKU名称"
                         v-model="formData.skuName"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="零售价"
                field="skuName"
              >
                <a-input-number placeholder="零售价"
                                :min="0"
                                :precision="2"
                                v-model="formData.retailPrice"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
      </a-space>
      <div class="actions">
        <a-space>
          <a-button>
            {{ $t('groupForm.reset') }}
          </a-button>
          <a-button type="primary" :loading="loading" @click="onSubmitClick">
            {{ $t('groupForm.submit') }}
          </a-button>
        </a-space>
      </div>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {FormInstance} from '@arco-design/web-vue/es/form';
import useLoading from '@/hooks/loading';
import {querySkuDetail, SkuMetaRecord, updateBySkuId,} from "@/api/product/goods";
import {useRoute, useRouter} from "vue-router";
import {Message} from "@arco-design/web-vue";

const route = useRoute();
const router = useRouter();
const {loading, setLoading} = useLoading();
const formRef = ref<FormInstance>();

const action = ref<string>('');
const readonly = ref<boolean>(true);

const formData = ref<SkuMetaRecord>({} as SkuMetaRecord)

const onSubmitClick = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
        setLoading(true);
        try {
            console.log(formData.value)
            const {msg} = await updateBySkuId(formData.value);
            Message.info(msg);
        } catch (err) {
            // you can report use errorHandler or other
        } finally {
            setLoading(false);
        }
    }
    setTimeout(() => {
        setLoading(false);
    }, 1000);
};

const init = async () => {
    const {skuId} = route.params;
    const {actionType} = route.query;
    action.value = actionType as string;
    readonly.value = (actionType as string) === '1';

    if (action.value === '1' || action.value === '2') {
        setLoading(true);
        try {
            const params = {
                skuId: skuId as string,
            } as SkuMetaRecord;
            const {data} = await querySkuDetail(params);
            formData.value = data;
        } catch (err) {
            // you can report use errorHandler or other
        } finally {
            setLoading(false);
        }
    }
};
init();

</script>

<style scoped lang="less">
.container {
  padding: 0 20px 40px 20px;
  overflow: hidden;
}

.actions {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60px;
  padding: 14px 20px 14px 0;
  background: var(--color-bg-2);
  text-align: right;
}
</style>
