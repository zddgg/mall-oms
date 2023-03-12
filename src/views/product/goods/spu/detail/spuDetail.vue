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
        <a-card class="general-card" title="类目关联属性">
          <a-table :data="categoryAttrSaleData"
                   :columns="categoryAttrSaleColumns"
          >
            <template #propertySaleValues="{record}">
              <a-space>
                <a-tag v-for="(item, index) in record.propertySaleValues" :key="index">
                  {{ item.valueName }}
                </a-tag>
              </a-space>
            </template>
            <template #operations="{record}">
              <a-space>
                <a-button v-if="attrSaleIsBind(record)">
                  已绑定
                </a-button>
                <a-button v-else @click="bindAttrToSpu(record)">
                  绑定到SPU
                </a-button>
              </a-space>
            </template>
          </a-table>
        </a-card>
        <a-card class="general-card" title="绑定属性">
          <a-table :data="spuAttrSaleData"
                   :columns="categoryAttrSaleColumns"
          >
            <template #propertySaleValues="{record}">
              <a-space>
                <a-tag v-for="(item, index) in record.propertySaleValues" :key="index">
                  {{ item.valueName }}
                </a-tag>
              </a-space>
            </template>
            <template #operations="{record}">
              <a-space>
                <a-button @click="unbindAttrToSpu(record)">
                  解除绑定
                </a-button>
              </a-space>
            </template>
          </a-table>
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
import {computed, ref} from 'vue';
import {FormInstance} from '@arco-design/web-vue/es/form';
import useLoading from '@/hooks/loading';
import {
  addAttrSale,
  createSpu, deleteAttrSale,
  queryAttrListBySpuId,
  querySpuDetail,
  SpuMetaRecord,
  updateBySpuId,
} from "@/api/product/goods";
import {Message, Modal} from "@arco-design/web-vue";
import {useRoute, useRouter} from "vue-router";
import {queryStoreList, StoreParams, StoreRecord} from "@/api/store/store";
import {BrandParams, BrandRecord, queryBrandList} from "@/api/product/brand";
import {BackendCategoryTree, queryAttrSaleListByCategoryId, queryBackendCategoryTree} from "@/api/product/category";
import {PropertySaleRecord} from "@/api/product/property";
import {TableColumnData, TableData} from "@arco-design/web-vue/es/table/interface";

const route = useRoute();
const router = useRouter();
const {loading, setLoading} = useLoading();
const formRef = ref<FormInstance>();

const action = ref<string>('');
const readonly = ref<boolean>(true);

const spuMetaData = ref<SpuMetaRecord>({} as SpuMetaRecord)
const categoryAttrSaleData = ref<PropertySaleRecord[]>([])
const spuAttrSaleData = ref<PropertySaleRecord[]>([])

const storeData = ref<StoreRecord[] | undefined>([]);
const brandData = ref<BrandRecord[] | undefined>([]);
const backendCategoryOptions = ref<BackendCategoryTree[]>([]);

const categoryAttrSaleColumns = computed<TableColumnData[]>(() => [
  {
    title: '属性编号',
    dataIndex: 'keyId',
  },
  {
    title: '属性名称',
    dataIndex: 'keyName',
  },
  {
    title: '属性值',
    dataIndex: 'propertySaleValues',
    slotName: 'propertySaleValues',
  },
  {
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
  },
]);

const attrSaleIsBind = computed(() => (record: TableData) => { //计算属性传递参数
  const find = spuAttrSaleData.value.find((item) => item.keyId === record.keyId);
  return !!find;
})


const bindAttrToSpu = async (record: TableData) => {
  Modal.confirm({
    title: `确认绑定 [${record.keyName}]？`,
    content: '',
    onOk: async () => {
      try {
        const params = {
          spuId: spuMetaData.value.spuId,
          attrId: record.keyId,
        }
        const {msg} = await addAttrSale(params)
        Message.info(msg);
        await refreshSpuAttrSale();
      } catch (err) {
        // dd
      }
    },
  });
}

const unbindAttrToSpu = async (record: TableData) => {
  console.log(record)
  Modal.confirm({
    title: `确认解除绑定 [${record.keyName}]？`,
    content: '',
    onOk: async () => {
      try {
        const params = {
          spuId: spuMetaData.value.spuId,
          attrId: record.keyId,
        }
        const {msg} = await deleteAttrSale(params)
        Message.info(msg);
        await refreshSpuAttrSale();
      } catch (err) {
        // dd
      }
    },
  });
}


const onSubmitClick = async () => {
  const res = await formRef.value?.validate();
  if (!res) {
    setLoading(true);
    try {
      if (action.value === '0') {
        const {msg} = await createSpu(spuMetaData.value);
        Message.info(msg);
      }
      if (action.value === '2') {
        const {msg} = await updateBySpuId(spuMetaData.value);
        Message.info(msg);
      }
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

const refreshSpuAttrSale = async () => {
  try {
    const params = {
      spuId: spuMetaData.value.spuId
    }
    const {data} = await queryAttrListBySpuId(params)
    spuAttrSaleData.value = data;
  } catch (err) {
    // dd
  }
}


const init = async () => {
  const {spuId} = route.params;
  const {actionType} = route.query;
  action.value = actionType as string;
  readonly.value = (actionType as string) === '1';

  if (action.value === '1' || action.value === '2') {
    setLoading(true);
    try {
      const params = {
        spuId: spuId as string,
      } as SpuMetaRecord;
      const {data} = await querySpuDetail(params);
      spuMetaData.value = data;
      await refreshCategoryAttrSale();
      await refreshSpuAttrSale();
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
