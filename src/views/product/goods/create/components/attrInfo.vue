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
          <a-button :type="'primary'" @click="propertySaleModalShow = true">
            选择销售属性
          </a-button>
        </a-card>
        <a-card class="general-card" title="绑定销售属性">
          <a-table :data="formData.spuAttrSaleDataList"
                   :columns="categoryAttrSaleColumns"
          >
            <template #attrSaleValues="{record}">
              <a-space>
                <a-tag v-for="(item, index) in record.attrSaleValues" :key="index">
                  {{ item.attrValueName }}
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
    <a-modal
        v-model:visible="propertySaleModalShow"
        title="销售属性信息"
        unmount-on-close
        width="auto"
        :body-style="{ padding: 0, width: '1080px' }"
        @ok="propertySaleModalOk"
        @cancel="modalCancel"
    >
      <property-sale-table
          ref="propertySaleTableRef"
          :row-selection-param="{type: 'checkbox', showCheckedAll: true}"
      />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import {computed, PropType, ref} from "vue";
import {FormInstance} from "@arco-design/web-vue/es/form";
import {TableColumnData, TableData} from "@arco-design/web-vue/es/table/interface";
import {queryAttrSaleListByCategoryId} from "@/api/product/category";
import {GoodsCreateModal} from "@/api/product/goods";
import {Message} from "@arco-design/web-vue";
import PropertySaleTable from "@/views/product/attr/components/propertySaleTable.vue";
import {AttrSaleRecord, queryAttrSaleDetail} from "@/api/product/property";

const props = defineProps({
  data: Object as PropType<GoodsCreateModal>
})
const emits = defineEmits(['changeStep']);

const formRef = ref<FormInstance>();
const formData = ref<GoodsCreateModal>(props.data as GoodsCreateModal)
const propertySaleModalShow = ref(false);
const propertySaleTableRef = ref({
  selectedKeysHandler: () => [],
})
const categoryAttrSaleData = ref<AttrSaleRecord[]>([])

const categoryAttrSaleColumns = computed<TableColumnData[]>(() => [
  {
    title: '属性编号',
    dataIndex: 'attrId',
  },
  {
    title: '属性名称',
    dataIndex: 'attrName',
  },
  {
    title: '属性值',
    dataIndex: 'attrSaleValues',
    slotName: 'attrSaleValues',
  },
  {
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
  },
]);


const propertySaleModalOk = async () => {
  const keyIds = propertySaleTableRef.value.selectedKeysHandler();
  if (!keyIds || keyIds.length === 0) {
    Message.error('没有选择属性数据！');
  } else {
    for (const keyId of keyIds) {
      const find = formData.value.spuAttrSaleDataList?.find((item) => item.attrId === keyId);
      if (find) {
        Message.error(`属性[${find.attrId}]已添加！`);
      } else {
        const params = {
          attrId: keyId as string,
        };
        const {data} = await queryAttrSaleDetail(params);
        bindAttrToSpu(data);
      }
    }
  }
  modalCancel();
}

const modalCancel = () => {
  propertySaleModalShow.value = false;
}

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
  const find = formData.value.spuAttrSaleDataList?.find((item) => item.attrId === record.keyId);
  return !!find;
})

const bindAttrToSpu = (record: TableData) => {
  if (!formData.value.spuAttrSaleDataList) {
    formData.value.spuAttrSaleDataList = [];
  }
  if (!formData.value.attrSaleIds) {
    formData.value.attrSaleIds = [];
  }
  formData.value.spuAttrSaleDataList.push(record as AttrSaleRecord)
  formData.value.attrSaleIds.push(record.keyId)
}

const unbindAttrToSpu = (record: TableData, rowIndex: number) => {
  formData.value.spuAttrSaleDataList.splice(rowIndex, 1)
  formData.value.attrSaleIds = formData.value.attrSaleIds.filter((item) => item !== record.keyId);
}

const refreshCategoryAttrSale = async (categoryId: string) => {
  if (categoryId) {
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
}

const init = () => {
  refreshCategoryAttrSale(formData.value.categoryId)
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