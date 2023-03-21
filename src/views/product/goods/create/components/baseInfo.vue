<template>
  <div class="container">
    <a-form ref="formRef" layout="vertical" :model="formData">
      <a-space direction="vertical" :size="16">
        <a-card class="general-card" title="基本信息">
          <a-grid :cols="2" :col-gap="80">
            <a-grid-item>
              <a-form-item
                  field="spuName"
                  label="商品标题"
                  :rules="[
                            {
                              required: true,
                              message: '请填写商品标题',
                            }
                          ]"
              >
                <a-input v-model="formData.spuName" placeholder="请填写商品标题"/>
              </a-form-item>
            </a-grid-item>
            <a-grid-item>
              <a-form-item
                  field="brandId"
                  label="品牌"
                  :rules="[
                            {
                              required: true,
                              message: '请选择品牌',
                            }
                          ]"
              >
                <a-select
                    placeholder="请选择品牌"
                    v-model="formData.brandId"
                    :options="brandOptions"
                    :field-names="{value: 'brandId', label: 'brandName'}"
                />
              </a-form-item>
            </a-grid-item>
          </a-grid>
        </a-card>
      </a-space>
    </a-form>
    <a-space style="margin-left: 20px">
      <a-button type="primary" @click="goPrev">上一步</a-button>
      <a-button type="primary" @click="onNextClick">下一步</a-button>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {BackendCategoryTree, queryBackendCategoryTree} from "@/api/product/category";
import {queryStoreList, StoreParams, StoreRecord} from "@/api/store/store";
import {FormInstance} from "@arco-design/web-vue/es/form";
import {BaseInfoModel} from "@/api/product/goods";
import {BrandParams, BrandRecord, queryBrandList} from "@/api/product/brand";

const emits = defineEmits(['changeStep']);

const formData = ref<BaseInfoModel>({} as BaseInfoModel);
const formRef = ref<FormInstance>();

const brandOptions = ref<BrandRecord[] | undefined>([]);

const getBrandData = async () => {
  try {
    const {data} = await queryBrandList({} as BrandParams)
    brandOptions.value = data.records;
  } catch (err) {

  }
}
getBrandData();

const onNextClick = async () => {
  const res = await formRef.value?.validate();
  if (!res) {
    emits('changeStep', 'forward', {...formData.value});
  }
};

const goPrev = () => {
  emits('changeStep', 'backward');
};

</script>


<style scoped lang="less">
.container {
  padding: 20px;
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