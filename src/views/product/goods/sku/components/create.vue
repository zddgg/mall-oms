<template>
  <div class="container">
    <a-form ref="formRef" layout="vertical" :model="skuMetaData">
      <a-space direction="vertical" :size="16">
        <a-card class="general-card">
          <template #title>
            基本信息
          </template>
          <a-grid :col-gap="80" :cols="3">
            <a-grid-item>
              <a-form-item
                  label="SPU"
                  field="spuId"
              >
                <a-select
                    :options="spuMetaListData"
                    :field-names="{label: 'spuName', value: 'spuId'}"
                    @change="refreshSpuAttrSale"
                />
              </a-form-item>
            </a-grid-item>
            <a-grid-item>
              <a-form-item
                  label="SKU名称"
                  field="skuName"
              >
                <a-input placeholder="请输入SKU名称"
                         v-model="skuMetaData.skuName"
                />
              </a-form-item>
            </a-grid-item>
            <a-grid-item>
              <a-form-item
                  label="零售价"
                  field="retailPrice"
              >
                <a-input-number placeholder="请输入零售价"
                                v-model="skuMetaData.retailPrice"
                />
              </a-form-item>
            </a-grid-item>
            <a-grid-item v-for="(item, index) in spuAttrSaleData" :key="index">
              <a-form-item
                  :label="item.keyName"
              >
                <a-select :options="item.propertySaleValues"
                          :field-names="{label: 'valueName', value: 'valueId'}"
                          @change="(value) => {
                            attrSaleSelect.push({keyId: item.keyId, valueId: value})
                          }"

                >
                </a-select>
              </a-form-item>
            </a-grid-item>
          </a-grid>
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
import {Message} from "@arco-design/web-vue";
import {useRoute, useRouter} from "vue-router";
import {PropertySaleRecord} from "@/api/product/property";
import {
  createSku,
  queryAttrListBySpuId,
  querySpuMetaList,
  SkuMetaRecord,
  SpuMetaParams,
  SpuMetaRecord
} from "@/api/product/goods";

const route = useRoute();
const router = useRouter();
const {loading, setLoading} = useLoading();
const formRef = ref<FormInstance>();

const action = ref<string>('');

const spuMetaListData = ref<SpuMetaRecord[] | undefined>([])
const skuMetaData = ref<SkuMetaRecord>({} as SkuMetaRecord)
const spuAttrSaleData = ref<PropertySaleRecord[]>([])
const attrSaleSelect = ref([]);

const onSubmitClick = async () => {
  console.log(attrSaleSelect.value)
  return;
  const res = await formRef.value?.validate();
  if (!res) {
    setLoading(true);
    try {
      const {msg} = await createSku(skuMetaData.value);
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

const refreshSpuAttrSale = async (spuId: string) => {
  try {
    const params = {
      spuId
    }
    const {data} = await queryAttrListBySpuId(params)
    spuAttrSaleData.value = data;
  } catch (err) {
    // dd
  }
}

const fetchData = async (
    params: SpuMetaParams = {current: 1, pageSize: 20}
) => {
  setLoading(true);
  try {
    const {data} = await querySpuMetaList(params);
    spuMetaListData.value = data.records;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};
fetchData()

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
