<template>
  <div class="container">
    <a-form ref="formRef" layout="vertical" :model="formData">
      <a-space direction="vertical" :size="16">
        <a-card class="general-card" title="添加SKU">
          <a-form-item label="类目">
            <a-table
                :columns="columns"
                :data="skuList"
                :pagination="false"
                :bordered="{cell:true}"
            >
              <template #retailPriceTitle>
                <div>
                  <div v-if="hiddenRetailPriceBtn">
                    零售价
                    <icon-plus @click="hiddenRetailPriceBtn = false"/>
                  </div>
                  <div v-else style="display: flex">
                    <a-input-number placeholder="适用所有" style="width: 200px"
                                    :min="0"
                                    :precision="2"
                                    v-model="allRetailPrice"
                    >
                      <template #prepend>
                        零售价
                      </template>
                    </a-input-number>
                    <a-button type="primary" @click="() => {
                          skuList.map((item) => item.retailPrice = allRetailPrice);
                          hiddenRetailPriceBtn = true;
                        }"
                    >
                      适用所有
                    </a-button>
                  </div>
                </div>
              </template>
              <template #retailPrice="{ record }">
                <a-input-number :default-value="0" v-model="record.retailPrice" :min="0" :precision="2"/>
              </template>
            </a-table>
          </a-form-item>
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
import {computed, PropType, ref, watch} from "vue";
import {FormInstance} from "@arco-design/web-vue/es/form";
import {GoodsCreateModal} from "@/api/product/goods";
import {TableColumnData, TableData} from "@arco-design/web-vue/es/table/interface";

export interface SkuItem {
  spuName?: string;
  skuName?: string;
  retailPrice?: number;
  attrList?: AttrFlatMapItem[];

  [x: string]: any;
}

const props = defineProps({
  data: Object as PropType<GoodsCreateModal>
})

const emits = defineEmits(['changeStep']);

const goodsCreateData = ref<GoodsCreateModal>(props.data as GoodsCreateModal)

const formData = ref({});
const formRef = ref<FormInstance>();
const skuList = ref<SkuItem[]>([]);
const hiddenRetailPriceBtn = ref(true);
const allRetailPrice = ref<Number>(0);

const onNextClick = async () => {
  const res = await formRef.value?.validate();
  if (!res) {
    emits('changeStep', 'forward', {...formData.value});
  }
};

const goPrev = () => {
  emits('changeStep', 'backward');
};

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'SKU名称',
    dataIndex: 'skuName',
  },
  {
    title: '零售价',
    titleSlotName: 'retailPriceTitle',
    dataIndex: 'retailPrice',
    slotName: 'retailPrice',
  },
])

export interface AttrFlatMapItem {
  attrId?: string;
  attrName?: string;
  attrValueId?: string;
  attrValueName?: string;
}

const getSkuAttrList = (attrList: AttrFlatMapItem[][]): AttrFlatMapItem[][] => {
  const result: AttrFlatMapItem[][] = [];
  const backTracking = (path: AttrFlatMapItem[], level: number) => {
    if (path.length === attrList.length) {
      result.push([...path]);
      return;
    }
    attrList[level].forEach((item) => {
      path.push(item);
      backTracking(path, level + 1);
      path.pop();
    });
  };
  backTracking([], 0);
  return result;
};

const init = () => {
  const spuAttrSaleData = goodsCreateData.value.spuAttrSaleData;
  console.log(spuAttrSaleData)
  let arr: AttrFlatMapItem[][] = [];
  spuAttrSaleData?.forEach((item) => {
    let arr1: AttrFlatMapItem[] = [];
    item.propertySaleValues?.forEach((subItem) => {
      const attrItem = {
        attrId: item.keyId,
        attrName: item.keyName,
        attrValueId: subItem.valueId,
        attrValueName: subItem.valueName
      }
      arr1.push(attrItem)
    })
    arr.push(arr1)
    columns.value.splice(columns.value.length - 1, 0,
        {
          title: item.keyName,
          dataIndex: item.keyId,
          render: (data: { record: TableData; column: TableColumnData; rowIndex: number; }) => {
            return data.record[item.keyId as string].attrValueName;
          }
        }
    )
  })
  const skuAttrList = getSkuAttrList(arr);
  skuAttrList.forEach((item) => {
    const sku: SkuItem = {
      skuName: goodsCreateData.value?.spuName + ' ' + item.map((subItem) => subItem.attrValueName).join(' '),
      attrList: item,
    }
    item.forEach((subItem) => {
      sku[subItem.attrId as string] = subItem;
    })
    skuList.value.push(sku)
  })
}

init();

</script>

<style scoped lang="less">
.container {
  padding: 20px;
  overflow: hidden;
}
</style>