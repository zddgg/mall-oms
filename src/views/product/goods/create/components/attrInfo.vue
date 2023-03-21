<template>
  <div class="container">
    <a-form ref="formRef" layout="vertical" :model="formData">
      <a-space direction="vertical" :size="16">
        <a-card class="general-card" title="类目关联销售属性">
          <a-table :data="categoryAttrSaleData"
                   :columns="categoryAttrSaleColumns"
                   :pagination="false"
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
        <a-card class="general-card">
          <a-button :type="'primary'">自定义添加销售属性</a-button>
        </a-card>
        <a-card class="general-card" title="绑定销售属性">
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
            <template #operations="{record, rowIndex}">
              <a-space>
                <a-button @click="unbindAttrToSpu(record, rowIndex)">
                  解除绑定
                </a-button>
              </a-space>
            </template>
          </a-table>
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
import {computed, ref} from "vue";
import {FormInstance} from "@arco-design/web-vue/es/form";
import {PropertySaleRecord} from "@/api/product/property";
import {TableColumnData, TableData} from "@arco-design/web-vue/es/table/interface";
import {Modal} from "@arco-design/web-vue";
import {queryAttrSaleListByCategoryId} from "@/api/product/category";
import {AttrInfoModel} from "@/api/product/goods";

const emits = defineEmits(['changeStep']);

const formData = ref<AttrInfoModel>({attrSaleIds: []} as AttrInfoModel);
const formRef = ref<FormInstance>();

const categoryAttrSaleData = ref<PropertySaleRecord[]>([])
const spuAttrSaleData = ref<PropertySaleRecord[]>([])

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

const onNextClick = async () => {
  const res = await formRef.value?.validate();
  const attrValid = formData.value.attrSaleIds && formData.value.attrSaleIds.length !== 0;
  if (!res && attrValid) {
    emits('changeStep', 'forward', {...formData.value});
  }
};

const goPrev = () => {
  emits('changeStep', 'backward');
};


const attrSaleIsBind = computed(() => (record: TableData) => { //计算属性传递参数
  const find = spuAttrSaleData.value.find((item) => item.keyId === record.keyId);
  return !!find;
})


const bindAttrToSpu = async (record: TableData) => {
  Modal.confirm({
    title: `确认绑定 [${record.keyName}]？`,
    content: '',
    onOk: async () => {
      spuAttrSaleData.value.push(record as PropertySaleRecord)
      formData.value.attrSaleIds.push(record.keyId)
    },
  });
}

const unbindAttrToSpu = async (record: TableData, rowIndex: number) => {
  console.log(record)
  Modal.confirm({
    title: `确认解除绑定 [${record.keyName}]？`,
    content: '',
    onOk: async () => {
      spuAttrSaleData.value.splice(rowIndex, 1)
      formData.value.attrSaleIds = formData.value.attrSaleIds.filter((item) => item !== record.keyId);
    },
  });
}

const refreshCategoryAttrSale = async (categoryId: string) => {
  try {
    const params = {
      categoryId
    }
    const {data} = await queryAttrSaleListByCategoryId(params);
    categoryAttrSaleData.value = data;
  } catch (err) {
    // dd
  }
}

const init = () => {
  refreshCategoryAttrSale('76')
}

init();
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