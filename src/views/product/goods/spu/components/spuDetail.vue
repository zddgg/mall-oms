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
        <a-card class="general-card" title="销售属性">
          <a-table :columns="attrSaleColumns" :data="spuAttrSaleData">
            <template #operations="{ record, rowIndex }">
              <a-button
                  v-if="!deleteAttrIds.includes(record.attrId)"
                  size="small"
                  @click="deleteAttr(record)"
              >
                删除
              </a-button>
              <a-button
                  v-else
                  size="small"
                  @click="unDeleteAttr(record)"
              >
                撤销删除
              </a-button>
            </template>
          </a-table>
          <a-space wrap>
            <a-tag
                v-for="(tag, index) of addAttrNames"
                :key="tag"
                :closable="true"
                @close="handleRemove(tag)"
                color="#165dff"
            >
              {{ tag }}
            </a-tag>

            <a-input
                v-if="showInput"
                ref="inputRef"
                :style="{ width: '90px'}"
                size="mini"
                v-model.trim="inputVal"
                @keyup.enter="handleAdd"
                @blur="handleAdd"
            />
            <a-tag
                v-else
                @click="handleEdit"
                color="#165dff"
            >
              <template #icon>
                <icon-plus/>
              </template>
              新增销售属性
            </a-tag>
          </a-space>
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
import {nextTick, ref} from 'vue';
import {FormInstance} from '@arco-design/web-vue/es/form';
import useLoading from '@/hooks/loading';
import {
  createSpu,
  querySpuDetail,
  SpuAttrSaleMap,
  SpuMetaRecord,
  SpuUpdate,
  updateBySpuId,
} from "@/api/product/goods";
import {Message} from "@arco-design/web-vue";
import {useRoute} from "vue-router";
import {TableData} from "@arco-design/web-vue/es/table/interface";
import {queryStoreList, StoreParams, StoreRecord} from "@/api/store/store";
import {BrandParams, BrandRecord, queryBrandList} from "@/api/product/brand";
import {BackendCategoryTree, queryBackendCategoryTree} from "@/api/product/category";

const spuMetaData = ref<SpuMetaRecord>({} as SpuMetaRecord)
const spuAttrSaleData = ref<SpuAttrSaleMap[]>([])
const formRef = ref<FormInstance>();
const {loading, setLoading} = useLoading();
const route = useRoute();

const action = ref<string>('');
const readonly = ref<boolean>(true);

const deleteAttrIds = ref<string[]>([]);
const addAttrNames = ref<string[]>([]);
const inputRef = ref({
  focus
});
const showInput = ref(false);
const inputVal = ref('');

const storeData = ref<StoreRecord[] | undefined>([]);
const brandData = ref<BrandRecord[] | undefined>([]);
const backendCategoryOptions = ref<BackendCategoryTree[]>([]);

const handleEdit = () => {
  showInput.value = true;

  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus();
    }
  });
};

const handleAdd = () => {
  if (inputVal.value) {
    const b = spuAttrSaleData.value.map((item) => item.attrName).includes(inputVal.value);
    const c = addAttrNames.value.includes(inputVal.value);
    console.log(b)
    console.log(c)
    if (b || c) {
      Message.warning('该属性名称已存在!');
    } else {
      addAttrNames.value.push(inputVal.value);
    }
    inputVal.value = '';
  }
  showInput.value = false;
};

const handleRemove = (key: string) => {
  addAttrNames.value = addAttrNames.value.filter((tag) => tag !== key);
};

const deleteAttr = (record: TableData) => {
  deleteAttrIds.value.push(record.attrId);
}

const unDeleteAttr = (record: TableData) => {
  deleteAttrIds.value = deleteAttrIds.value.filter((id) => id !== record.attrId);
}


const attrSaleColumns = [
  {
    title: '属性编号',
    dataIndex: 'attrId',
  },
  {
    title: '属性名称',
    dataIndex: 'attrName',
    slotName: 'attrName',
  },
  {
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
  },
];

const onSubmitClick = async () => {
  const res = await formRef.value?.validate();
  if (!res) {
    setLoading(true);
    try {
      if (action.value === '0') {
        const params = {
          spuMeta: spuMetaData.value,
          addAttrNames: addAttrNames.value
        } as SpuUpdate;
        const {msg} = await createSpu(params);
        Message.info(msg);
      }
      if (action.value === '2') {
        const params: SpuUpdate = {
          spuMeta: spuMetaData.value,
          deleteAttrIds: deleteAttrIds.value,
          addAttrNames: addAttrNames.value
        }
        const {msg} = await updateBySpuId(params);
        Message.info(msg);
      }
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
  console.log(data)
  backendCategoryOptions.value = data;
};
getBackendCategoryTree();

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
      spuMetaData.value = data.spuMeta;
      spuAttrSaleData.value = data.spuAttrSaleMaps;
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
