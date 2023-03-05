<template>
  <div class="container">
    <a-form
        ref="formRef"
        :label-col-props="{ span: 8 }"
        :wrapper-col-props="{ span: 16 }"
        :model="formData"
        label-align="right"
        @submit-success="handleSubmit"
    >
      <a-space direction="vertical" :size="16">
        <a-card class="general-card" title="基础信息">
          <a-row :gutter="80">
            <a-col :span="8">
              <a-form-item
                  field="categoryName"
                  label="类目名称"
                  :rules="[
                  { required: true, message: '类目名称不能为空！' },
                ]"
                  show-colon
              >
                <a-input
                    v-model="formData.categoryName"
                    placeholder="请输入类目名称"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                  field="parentId"
                  label="上级类目"
                  :help="'不选则为根类目'"
                  show-colon
              >
                <a-cascader
                    v-model="formData.parentId"
                    :options="backendCategoryOptions"
                    :field-names="{
                    value: 'categoryId',
                    label: 'categoryName',
                  }"
                    placeholder="根类目"
                    allow-clear
                    check-strictly
                    @change="parentCategoryChange"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                  field="relatedProperty"
                  label="是否关联属性"
                  show-colon
              >
                <a-switch v-model="formData.relatedProperty">
                  <template #checked> 是</template>
                  <template #unchecked> 否</template>
                </a-switch>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card class="general-card" title="已继承属性信息">
          xx
        </a-card>
      </a-space>
      <div class="actions">
        <a-space>
          <a-button type="primary" :loading="loading" html-type="submit">
            提交
          </a-button>
          <a-button @click="reset"> 重置</a-button>
        </a-space>
      </div>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch } from 'vue';
import { FormInstance } from '@arco-design/web-vue/es/form';
import {
  BackendCategoryDetailReq,
  BackendCategoryDetailResp,
  BackendCategoryTree, createBackendCategory, queryAllParentCategoryDetail, queryBackendCategoryDetail,
  queryBackendCategoryTree, updateBackendCategory
} from "@/api/product/category";
import {useRoute, useRouter} from "vue-router";
import useLoading from "@/hooks/loading";
import { Message } from '@arco-design/web-vue';

const router = useRouter();
const route = useRoute();
const { loading, setLoading } = useLoading();

const formRef = ref<FormInstance>();
const formData = ref<BackendCategoryDetailResp>({} as BackendCategoryDetailResp);

const action = ref<string | string[]>('');
const readonly = ref<boolean>(true);

const backendCategoryOptions = ref<BackendCategoryTree[]>([]);
const getBackendCategoryTree = async () => {
  const { data } = await queryBackendCategoryTree({ maxLevel: 2, rootHelp: true });
  backendCategoryOptions.value = data;
};

const parentCategoryChange = async (parentId: string) => {
  setLoading(true);
  try {
    const params: BackendCategoryDetailReq = {
      categoryId: parentId as string,
    };
    const { data } = await queryAllParentCategoryDetail(params);
    formData.value.parentCategoryDetail = data;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const reset = () => {
  formData.value = {} as BackendCategoryDetailResp;
};

const handleSubmit = async () => {
  setLoading(true);
  try {
    console.log(action.value)
    const params = formData.value;
    if (action.value === '2') {
      const { categoryId } = route.params;
      params.categoryId = categoryId as string;
    }

    if (action.value === '0') {
      console.log(action)
      const result = await createBackendCategory(params);
      // await router.push({
      //   name: 'CategoryList',
      // });
      Message.info(result.msg);
    } else if (action.value === '2') {
      const result = await updateBackendCategory(params);
      // await router.push({
      //   name: 'CategoryList',
      // });
      Message.info(result.msg);
    }
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const init = async () => {
  const { categoryId } = route.params;
  const { actionType } = route.query;
  action.value = actionType as string;
  readonly.value = (actionType as string) === '1';

  if (action.value === '1' || action.value === '2') {
    setLoading(true);
    try {
      const params: BackendCategoryDetailReq = {
        categoryId: categoryId as string,
      };
      const { data } = await queryBackendCategoryDetail(params);
      formData.value = data;
      console.log(data)
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  }
};
getBackendCategoryTree();
init();
</script>

<style scoped lang="less">
.container {
  padding: 20px 20px 40px;
  overflow: hidden;
}

.actions {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  height: 60px;
  padding: 14px 20px 14px 0;
  text-align: right;
  background: var(--color-bg-2);
}

.arco-collapse-item-content {
  position: relative;
  padding-right: 0;
  padding-left: 0;
  overflow: hidden;
  color: var(--color-text-1);
  font-size: 14px;
  background-color: var(--color-fill-1);
}
</style>
