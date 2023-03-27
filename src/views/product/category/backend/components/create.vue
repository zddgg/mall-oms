<template>
  <div class="container">
    <a-form
        ref="formRef"
        :label-col-props="{ span: 8 }"
        :wrapper-col-props="{ span: 16 }"
        :model="categoryDetail"
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
                    v-model="categoryDetail.categoryName"
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
                    v-model="categoryDetail.parentId"
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
                <a-switch v-model="categoryDetail.relatedAttr">
                  <template #checked> 是</template>
                  <template #unchecked> 否</template>
                </a-switch>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card
            :body-style="{padding: 0}"
            class="general-card" title="上级类目属性信息">
          <a-collapse :bordered="false">
            <a-collapse-item
                v-for="(item, index) in parentCategoryDetails"
                :key="index"
                :header="item.categoryName">
              <a-row style="margin-bottom: 10px">
                <a-col :span="8">
                  <span>类目编号: </span>
                  <span>{{ item.categoryId }}</span>
                </a-col>
                <a-col :span="8">
                  <span>类目名称: </span>
                  <span>{{ item.categoryName }}</span>
                </a-col>
                <a-col :span="8">
                  <span>类目层级: </span>
                  <span>{{ item.level }}</span>
                </a-col>
              </a-row>
              <a-row class="wrapper">
                <a-tabs default-active-key="1" type="rounded">
                  <a-tab-pane key="1" title="属性单元">
                    <a-table :columns="propertyUnitColumns"
                             :data="item.attrUnitRecords"
                    >
                    </a-table>
                  </a-tab-pane>
                  <a-tab-pane key="2" title="属性组">
                    <a-table :columns="propertyGroupColumns"
                             :data="item.attrGroupRecords"
                    >
                    </a-table>
                  </a-tab-pane>
                  <a-tab-pane key="3" title="销售属性">
                    <a-table :columns="propertySaleColumns"
                             :data="item.attrSaleRecords"
                    >
                      <template #attrSaleValues="{record}">
                        <a-space>
                          <a-tag v-for="(item, index) in record.attrSaleValues" :key="index">
                            {{ item.attrValueName }}
                          </a-tag>
                        </a-space>
                      </template>
                    </a-table>
                  </a-tab-pane>
                </a-tabs>
              </a-row>
            </a-collapse-item>
          </a-collapse>
        </a-card>
      </a-space>
      <div class="actions" v-if="!readonly">
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
import {ref} from 'vue';
import {FormInstance} from '@arco-design/web-vue/es/form';
import {
  addAttrSale,
  BackendCategoryDetail,
  BackendCategoryDetailReq,
  BackendCategoryTree,
  BackendCategoryUpdateReq,
  createBackendCategory,
  queryBackendCategoryTree,
  queryParentAndSelfDetail,
  updateBackendCategory
} from "@/api/product/category";
import {useRoute, useRouter} from "vue-router";
import useLoading from "@/hooks/loading";
import {Message} from '@arco-design/web-vue';
import {
  propertyGroupColumns,
  propertySaleColumns,
  propertyUnitColumns,
} from "@/views/product/category/backend/components/innerTableColumn";
import {
  AttrGroupRecord,
  AttrSaleRecord,
  AttrUnitRecord,
  queryAttrGroupDetail,
  queryAttrUnitDetail,
} from "@/api/product/property";
import {EnumResp} from "@/api/common/enum";

const router = useRouter();
const route = useRoute();
const {loading, setLoading} = useLoading();

const formRef = ref<FormInstance>();
const categoryDetail = ref<BackendCategoryDetail>({} as BackendCategoryDetail);
const parentCategoryDetails = ref<BackendCategoryDetail[]>([]);

const action = ref<string | string[]>('');
const readonly = ref<boolean>(true);
const backendCategoryOptions = ref<BackendCategoryTree[]>([]);

const getBackendCategoryTree = async () => {
  const {data} = await queryBackendCategoryTree({maxLevel: 2, rootHelp: true});
  backendCategoryOptions.value = data;
};

const parentCategoryChange = async (parentId: string) => {
  setLoading(true);
  try {
    const params: BackendCategoryDetailReq = {
      categoryId: parentId as string,
    };
    const {data} = await queryParentAndSelfDetail(params);
    parentCategoryDetails.value = data;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const reset = () => {
  categoryDetail.value = {} as BackendCategoryDetail;
};

const handleSubmit = async () => {
  setLoading(true);
  try {
    console.log(action.value)
    let params = {...categoryDetail.value} as BackendCategoryUpdateReq;

    console.log(action)
    const result = await createBackendCategory(params);
    // await router.push({
    //   name: 'CategoryList',
    // });
    Message.info(result.msg);

  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

getBackendCategoryTree();


const init = async () => {
  readonly.value = false;
};
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


.wrapper {
  padding: 20px;
  background-color: var(--color-bg-2);
  border-radius: 4px;
}
</style>
