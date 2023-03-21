<template>
  <div class="container">
    <a-form ref="formRef" layout="vertical" :model="formData">
      <a-space direction="vertical" :size="16">
        <a-card class="general-card" title="添加SKU">
          <a-grid :cols="2" :col-gap="80">
            <a-grid-item>
              <a-form-item label="类目">
                <a-table :columns="showColumns" :data="skuList" :pagination="false"/>
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
import {computed, PropType, ref, watch} from "vue";
import {FormInstance} from "@arco-design/web-vue/es/form";
import {GoodsCreateModal} from "@/api/product/goods";
import {TableColumnData, TableData} from "@arco-design/web-vue/es/table/interface";
import cloneDeep from "lodash/cloneDeep";

type Column = TableColumnData & { checked?: true };
export interface SkuItem {
  spuName?: string;
  skuName?: string;
  attrList?: AttrFlatMapItem[];
  [x: string]: any;
}

const props = defineProps({
  data: Object as PropType<GoodsCreateModal>
})

const emits = defineEmits(['changeStep']);

const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);

const formData = ref({});
const formRef = ref<FormInstance>();
const skuList = ref<SkuItem[]>([]);

const onNextClick = async () => {
  console.log(skuList.value)
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
  const spuAttrSaleData = props.data?.spuAttrSaleData;
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
    columns.value.push(
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
      spuName: props.data?.spuName,
      skuName: props.data?.spuName,
      attrList: item,
    }
    item.forEach((subItem) => {
      sku[subItem.attrId as string] = subItem;
    })
    skuList.value.push(sku)
  })
}
init();

watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    {deep: true, immediate: true}
);

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