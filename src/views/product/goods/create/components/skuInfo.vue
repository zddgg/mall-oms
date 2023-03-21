<template>
  <div class="container">
    <a-form ref="formRef" layout="vertical" :model="formData">
      <a-space direction="vertical" :size="16">
        <a-card class="general-card" title="添加SKU">
          <a-grid :cols="2" :col-gap="80">
            <a-grid-item>
              <a-form-item label="类目">
                <a-cascader
                    placeholder="请选择类目"
                    :options="backendCategoryOptions"
                    :field-names="{value: 'categoryId',label: 'categoryName'}"
                />
              </a-form-item>
            </a-grid-item>
            <a-grid-item>
              <a-form-item label="店铺">
                <a-select
                    placeholder="请选择店铺"
                    :options="storeOptions"
                    :field-names="{value: 'storeNo', label: 'storeName'}"
                >
                </a-select>
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

const emits = defineEmits(['changeStep']);


const formData = ref({});
const formRef = ref<FormInstance>();

const categoryId = ref('');

const backendCategoryOptions = ref<BackendCategoryTree[]>([]);
const storeOptions = ref<StoreRecord[] | undefined>([]);

const getBackendCategoryTree = async () => {
  const {data} = await queryBackendCategoryTree({maxLevel: 3, rootHelp: false});
  backendCategoryOptions.value = data;
};
getBackendCategoryTree();

const getStoreData = async () => {
  try {
    const {data} = await queryStoreList({} as StoreParams)
    storeOptions.value = data.records;
  } catch (err) {

  }
}

const onNextClick = async () => {
  const res = await formRef.value?.validate();
  if (!res) {
    emits('changeStep', 'forward', {...formData.value});
  }
};

const goPrev = () => {
  emits('changeStep', 'backward');
};

getStoreData();

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