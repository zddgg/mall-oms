<template>
  <div class="frame-bg">
    <div class="frame-body">
      <div class="frame-aside">
        <a-steps :current="step" direction="vertical">
          <a-step>选择类目</a-step>
          <a-step>基本信息</a-step>
          <a-step>属性信息</a-step>
          <a-step>添加SKU</a-step>
        </a-steps>
      </div>
      <div class="frame-main">
        <keep-alive>
          <CategoryInfo v-if="step === 1" @change-step="changeStep"/>
          <BaseInfo v-else-if="step === 2" @change-step="changeStep"/>
        </keep-alive>
        <AttrInfo v-if="step === 3" :data="submitModel" @change-step="changeStep"/>
        <SkuInfo v-if="step === 4" :data="submitModel" @change-step="changeStep"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import CategoryInfo from './components/categoryInfo.vue'
import BaseInfo from './components/baseInfo.vue'
import AttrInfo from './components/attrInfo.vue'
import SkuInfo from './components/skuInfo.vue'
import {
  AttrInfoModel,
  BaseInfoModel,
  CategoryInfoModel,
  GoodsCreateModal,
  SkuInfoModel,
  spuSkuCreate
} from "@/api/product/goods";
import {submitChannelForm, UnitChannelModel} from "@/api/form";
import useLoading from "@/hooks/loading";

const { loading, setLoading } = useLoading(false);

const step = ref(1);
const submitModel = ref<GoodsCreateModal>(
    {} as GoodsCreateModal & { attrSaleIds: [] } & { spuAttrSaleDataList: [] }
);

const submitForm = async () => {
  setLoading(true);
  try {
    await spuSkuCreate(submitModel.value); // The mock api default success
    step.value = 3;
    submitModel.value = {} as GoodsCreateModal & { attrSaleIds: [] } & { spuAttrSaleDataList: [] }; // init
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const changeStep = (
    direction: string | number,
    model: CategoryInfoModel | BaseInfoModel | AttrInfoModel | SkuInfoModel
) => {

  if (typeof direction === 'number') {
    step.value = direction;
    return;
  }

  if (direction === 'forward' || direction === 'submit') {
    submitModel.value = {
      ...submitModel.value,
      ...model,
    };
    if (direction === 'submit') {
      submitForm();
      return;
    }
    step.value = Math.min(4, step.value + 1);
  } else if (direction === 'backward') {
    step.value = Math.max(1, step.value - 1);
  }
};

</script>

<style scoped lang="less">
.frame-bg {
  padding: 20px;
  background: var(--color-fill-2);
}

.frame-body {
  display: flex;
  background: var(--color-bg-2);
}

.frame-aside {
  padding: 24px;
  border-right: 1px solid var(--color-border);
}

.frame-main {
  width: 100%;
}

.main-content {
  text-align: center;
  line-height: 200px;
}

.main-bottom {
  display: flex;
  justify-content: center;

  button {
    margin: 0 20px;
  }
}
</style>
