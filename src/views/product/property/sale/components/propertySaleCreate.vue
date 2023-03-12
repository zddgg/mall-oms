<template>
  <div class="container">
    <a-space direction="vertical">
      <a-card class="general-card" title="基础信息">
        <a-form
            ref="formRef"
            :model="propertySaleCreateData"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            style="width: 800px"
            @submit-success="handleSubmit"
        >
          <a-form-item
              field="keyName"
              label="销售属性名称"
              show-colon
              :rules="[{ required: true, message: '请填写销售属性名称' }]"
          >
            <a-input
                v-model="propertySaleCreateData.keyName"
                placeholder="请输入类目名称"
                style="width: 80%"
            />
          </a-form-item>
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
    </a-space>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import useLoading from '@/hooks/loading';
import {FormInstance} from '@arco-design/web-vue/es/form';
import {Message} from '@arco-design/web-vue';
import {useRoute, useRouter} from 'vue-router';
import {createPropertySale, PropertySaleCreate} from '@/api/product/property';

const formRef = ref<FormInstance>();
const router = useRouter();
const route = useRoute();

const propertySaleCreateData = ref<PropertySaleCreate>({} as PropertySaleCreate);

const {loading, setLoading} = useLoading(false);

const reset = () => {
  propertySaleCreateData.value = {} as PropertySaleCreate;
};

const handleSubmit = async () => {
  setLoading(true);
  try {
    const result = await createPropertySale(propertySaleCreateData.value);
    await router.push({
      name: 'PropertySale',
    });
    Message.info(result.msg);
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};
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
