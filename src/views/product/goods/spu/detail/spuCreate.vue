<template>
  <div class="container">
    <a-form ref="formRef" layout="vertical" :model="spuMetaData">
      <a-space direction="vertical" :size="16">
        <a-card class="general-card">
          <template #title>
            基本信息
          </template>
          <a-row :gutter="80">
            <a-col :span="8">
              <a-form-item
                  label="SPU名称"
                  field="video.mode"
              >
                <a-input placeholder="请输入SPU名称"
                         v-model="spuMetaData.spuName"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                  label="店铺"
                  field="video.acquisition.resolution"
              >
                <a-select
                    placeholder="请选择店铺"
                    v-model="spuMetaData.storeId"
                    :options="storeData"
                    :field-names="{value: 'storeNo', label: 'storeName'}"
                >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                  label="品牌"
                  field="video.acquisition.frameRate"
              >
                <a-select
                    placeholder="请选择品牌"
                    v-model="spuMetaData.brandId"
                    :options="brandData"
                    :field-names="{value: 'brandId', label: 'brandName'}"
                >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="80">
            <a-col :span="8">
              <a-form-item
                  label="类目"
                  field="video.acquisition.frameRate"
              >
                <a-cascader
                    placeholder="请选择类目"
                    v-model="spuMetaData.categoryId"
                    :options="backendCategoryOptions"
                    :field-names="{value: 'categoryId',label: 'categoryName'}"
                    allow-clear
                >
                </a-cascader>
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
import {createSpu, SpuMetaRecord, updateBySpuId,} from "@/api/product/goods";
import {Message} from "@arco-design/web-vue";
import {useRoute, useRouter} from "vue-router";
import {queryStoreList, StoreParams, StoreRecord} from "@/api/store/store";
import {BrandParams, BrandRecord, queryBrandList} from "@/api/product/brand";
import {BackendCategoryTree, queryAttrSaleListByCategoryId, queryBackendCategoryTree} from "@/api/product/category";
import {PropertySaleRecord} from "@/api/product/property";

const route = useRoute();
const router = useRouter();
const {loading, setLoading} = useLoading();
const formRef = ref<FormInstance>();

const action = ref<string>('');

const spuMetaData = ref<SpuMetaRecord>({} as SpuMetaRecord)
const categoryAttrSaleData = ref<PropertySaleRecord[]>([])

const storeData = ref<StoreRecord[] | undefined>([]);
const brandData = ref<BrandRecord[] | undefined>([]);
const backendCategoryOptions = ref<BackendCategoryTree[]>([]);

const onSubmitClick = async () => {
  const res = await formRef.value?.validate();
  if (!res) {
    setLoading(true);
    try {
      const {msg} = await createSpu(spuMetaData.value);
      Message.info(msg);
      await router.push({
        name: 'Spu',
      });
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

const getStoreData = async () => {
  try {
    const {data} = await queryStoreList({} as StoreParams)
    storeData.value = data.records;
  } catch (err) {

  }
}
getStoreData();

const getBrandData = async () => {
  try {
    const {data} = await queryBrandList({} as BrandParams)
    brandData.value = data.records;
  } catch (err) {

  }
}
getBrandData();

const getBackendCategoryTree = async () => {
  const {data} = await queryBackendCategoryTree({maxLevel: 3, rootHelp: false});
  backendCategoryOptions.value = data;
};
getBackendCategoryTree();

const refreshCategoryAttrSale = async () => {
  try {
    const params = {
      categoryId: spuMetaData.value.categoryId
    }
    const {data} = await queryAttrSaleListByCategoryId(params);
    categoryAttrSaleData.value = data;
  } catch (err) {
    // dd
  }
}
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
