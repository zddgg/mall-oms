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
                <a-switch v-model="categoryDetail.relatedProperty">
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
                             :data="item.propertyUnitKeys"
                    >
                    </a-table>
                  </a-tab-pane>
                  <a-tab-pane key="2" title="属性组">
                    <a-table :columns="propertyGroupColumns"
                             :data="item.propertyGroups"
                    >
                    </a-table>
                  </a-tab-pane>
                  <a-tab-pane key="3" title="销售属性">
                    <a-table :columns="propertySaleColumns"
                             :data="item.propertySaleKeys"
                    >
                    </a-table>
                  </a-tab-pane>
                </a-tabs>
              </a-row>
            </a-collapse-item>
          </a-collapse>
        </a-card>
        <a-card class="general-card">
          <template #title>
            <div style="display: flex">
              <div style="width: 100px">
                <span>属性单元</span>
              </div>
              <div>
                <a-button :type="'primary'"
                          style="margin-left: 20px"
                          @click="propertyUnitModalShow = true"
                >
                  添加属性单元
                </a-button>
              </div>
            </div>
          </template>
          <a-table :columns="propertyUnitColumns"
                   :data="propertyUnitList"
          >
            <template #id="{ record }">
              <div style="display: flex">
                <div>
                  <span>{{ record.unitKeyId }}</span>
                </div>
                <div v-if="isNewUnit(record.unitKeyId)" style="margin-left: 10px">
                  <a-tag color="#165dff">新添加</a-tag>
                </div>
              </div>
            </template>
            <template #operations="{ rowIndex }">
              <a-space>
                <a-button
                    v-if="!readonly"
                    type="primary" status="danger"
                          @click="propertyUnitList.splice(rowIndex, 1)"
                >
                  删除
                </a-button>
              </a-space>
            </template>
          </a-table>
        </a-card>
        <a-card class="general-card">
          <template #title>
            <div style="display: flex">
              <div style="width: 100px">
                <span>属性组</span>
              </div>
              <div>
                <a-button :type="'primary'"
                          style="margin-left: 20px"
                          @click="propertyGroupModalShow = true"
                >
                  添加属性组
                </a-button>
              </div>
            </div>
          </template>
          <a-table :columns="propertyGroupColumns"
                   :data="propertyGroupList"
          >
            <template #id="{ record }">
              <div style="display: flex">
                <div>
                  <span>{{ record.propertyGroupId }}</span>
                </div>
                <div v-if="isNewGroup(record.propertyGroupId)" style="margin-left: 10px">
                  <a-tag color="#165dff">新添加</a-tag>
                </div>
              </div>
            </template>
            <template #relatedProperty="{ record }">
              <a-popover trigger="click">
                <a-button size="small">
                  {{ `数量 ${record.propertyUnitKeys.length}` }}
                </a-button>
                <template #content>
                  <a-table
                      row-key="id"
                      :pagination="false"
                      :columns="propertyUnitColumns"
                      :data="record.propertyUnitKeys"
                      :bordered="false"
                      :size="'medium'"
                  >
                    <template #status="{ record }">
                      <span v-if="record.status === '0'" class="circle"></span>
                      <span v-else class="circle pass"></span>
                      {{ record.status === '0' ? '已停用' : '使用中' }}
                    </template>
                  </a-table>
                </template>
              </a-popover>
            </template>
            <template #operations="{ rowIndex }">
              <a-space>
                <a-button
                    v-if="!readonly"
                    type="primary" status="danger"
                          @click="propertyGroupList.splice(rowIndex, 1)"
                >删除
                </a-button>
              </a-space>
            </template>
          </a-table>
        </a-card>
        <a-card class="general-card" title="销售属性">
          <template #title>
            <div style="display: flex">
              <div style="width: 100px">
                <span>销售属性</span>
              </div>
              <div>
                <a-button :type="'primary'"
                          style="margin-left: 20px"
                          @click="propertySaleModalShow = true"
                >
                  添加销售属性
                </a-button>
              </div>
            </div>
          </template>
          <a-table :columns="propertySaleColumns"
                   :data="propertySaleList"
          >
            <template #id="{ record }">
              <div style="display: flex">
                <div>
                  <span>{{ record.keyId }}</span>
                </div>
                <div v-if="isNewSale(record.keyId)" style="margin-left: 10px">
                  <a-tag color="#165dff">新添加</a-tag>
                </div>
              </div>
            </template>
            <template #operations="{ rowIndex }">
              <a-space>
                <a-button
                    v-if="!readonly"
                    type="primary" status="danger"
                    @click="propertySaleList.splice(rowIndex, 1)"
                >删除
                </a-button>
              </a-space>
            </template>
          </a-table>
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
    <a-modal
        v-model:visible="propertyUnitModalShow"
        title="属性单元信息"
        unmount-on-close
        width="auto"
        :body-style="{ padding: 0, width: '1080px' }"
        @ok="propertyUnitModalOk"
        @cancel="modalCancel"
    >
      <property-unit-table ref="propertyUnitTableRef"/>
    </a-modal>
    <a-modal
        v-model:visible="propertyGroupModalShow"
        title="属性组信息"
        unmount-on-close
        width="auto"
        :body-style="{ padding: 0, width: '1080px' }"
        @ok="propertyGroupModalOk"
        @cancel="modalCancel"
    >
      <property-group-table ref="propertyGroupTableRef"/>
    </a-modal>
    <a-modal
        v-model:visible="propertySaleModalShow"
        title="属性组信息"
        unmount-on-close
        width="auto"
        :body-style="{ padding: 0, width: '1080px' }"
        @ok="propertySaleModalOk"
        @cancel="modalCancel"
    >
      <property-sale-table ref="propertySaleTableRef"/>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {FormInstance} from '@arco-design/web-vue/es/form';
import {
  BackendCategoryDetail,
  BackendCategoryDetailReq,
  BackendCategoryTree,
  BackendCategoryUpdateReq,
  createBackendCategory,
  queryBackendCategoryDetail,
  queryBackendCategoryTree,
  queryParentAndSelfDetail,
  queryParentCategoryDetail,
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
  PropertyGroupRecord,
  PropertySaleRecord,
  PropertyUnitRecord,
  queryPropertyGroupDetail, queryPropertySaleDetail,
  queryPropertyUnitDetail
} from "@/api/product/property";
import PropertyUnitTable from "@/views/product/property/components/propertyUnitTable.vue";
import PropertyGroupTable from "@/views/product/property/components/propertyGroupTable.vue";
import {EnumResp, queryEnum} from "@/api/common/enum";
import PropertySaleTable from "@/views/product/property/components/propertySaleTable.vue";

const router = useRouter();
const route = useRoute();
const {loading, setLoading} = useLoading();

const formRef = ref<FormInstance>();
const categoryDetail = ref<BackendCategoryDetail>({} as BackendCategoryDetail);
const parentCategoryDetails = ref<BackendCategoryDetail[]>([]);

const oldUnitList = ref<PropertyUnitRecord[]>([])
const propertyUnitList = ref<PropertyUnitRecord[]>([])

const oldGroupList = ref<PropertyGroupRecord[]>([])
const propertyGroupList = ref<PropertyGroupRecord[]>([])

const oldSaleList = ref<PropertySaleRecord[]>([])
const propertySaleList = ref<PropertySaleRecord[]>([])

const propertyUnitTableRef = ref({
  selectedKeysHandler: () => [],
})
const propertyGroupTableRef = ref({
  selectedKeysHandler: () => [],
})
const propertySaleTableRef = ref({
  selectedKeysHandler: () => [],
})
const action = ref<string | string[]>('');
const readonly = ref<boolean>(true);
const backendCategoryOptions = ref<BackendCategoryTree[]>([]);
const propertyUnitModalShow = ref(false);
const propertyGroupModalShow = ref(false);
const propertySaleModalShow = ref(false);
const formShowTypeOptions = ref<EnumResp[]>([]);

const isNewUnit = (unitKeyId: string) => {
  const find = oldUnitList.value.find((item) => item.unitKeyId === unitKeyId);
  return !find;
}
const isNewGroup = (propertyGroupId: string) => {
  const find = oldGroupList.value.find((item) => item.propertyGroupId === propertyGroupId);
  return !find;
}
const isNewSale = (keyId: string) => {
  const find = oldSaleList.value.find((item) => item.keyId === keyId);
  return !find;
}

const propertyUnitModalOk = async () => {
  const keyIds = propertyUnitTableRef.value.selectedKeysHandler();
  console.log(keyIds)
  if (!keyIds || keyIds.length === 0) {
    Message.warning('没有选择属性数据！');
  } else {
    const find = propertyUnitList.value.find((item) => item.unitKeyId === keyIds[0]);
    if (find) {
      Message.warning('属性已添加！');
    } else {
      const params: PropertyUnitRecord = {
        unitKeyId: keyIds[0] as string,
      };
      const {data} = await queryPropertyUnitDetail(params);
      propertyUnitList.value.push(data);
    }
  }
  modalCancel();
}

const propertyGroupModalOk = async () => {
  const keyIds = propertyGroupTableRef.value.selectedKeysHandler();
  console.log(keyIds)
  if (!keyIds || keyIds.length === 0) {
    Message.warning('没有选择属性数据！');
  } else {
    const find = propertyGroupList.value.find((item) => item.propertyGroupId === keyIds[0]);
    if (find) {
      Message.warning('属性已添加！');
    } else {
      const params: PropertyGroupRecord = {
        propertyGroupId: keyIds[0] as string,
      };
      const {data} = await queryPropertyGroupDetail(params);
      console.log(data)
      propertyGroupList.value.push(data);
    }
  }
  modalCancel();
}

const propertySaleModalOk = async () => {
  const keyIds = propertySaleTableRef.value.selectedKeysHandler();
  console.log(keyIds)
  if (!keyIds || keyIds.length === 0) {
    Message.warning('没有选择属性数据！');
  } else {
    const find = propertySaleList.value.find((item) => item.keyId === keyIds[0]);
    if (find) {
      Message.warning('属性已添加！');
    } else {
      const params: PropertySaleRecord = {
        keyId: keyIds[0] as string,
      };
      const {data} = await queryPropertySaleDetail(params);
      console.log(data)
      propertySaleList.value.push(data);
    }
  }
  modalCancel();
}

const modalCancel = () => {
  propertyUnitModalShow.value = false;
  propertyGroupModalShow.value = false;
  propertySaleModalShow.value = false;
}

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
    if (action.value === '2') {
      const {categoryId} = route.params;
      params.categoryId = categoryId as string;
    }

    params.propertyUnitIds = propertyUnitList.value.map((item) => item.unitKeyId);
    params.propertyGroupIds = propertyGroupList.value.map((item) => item.propertyGroupId);
    params.propertySaleIds = propertySaleList.value.map((item) => item.keyId);

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
  const {categoryId} = route.params;
  const {actionType} = route.query;
  action.value = actionType as string;
  readonly.value = (actionType as string) === '1';

  try {
    const enumsResponse = await queryEnum({
      moduleName: 'Property',
      enumName: 'FormShowType',
    });
    formShowTypeOptions.value = enumsResponse.data;
  } catch (err) {
    // you can report use errorHandler or other
  }

  if (action.value === '1' || action.value === '2') {
    setLoading(true);
    try {
      const params: BackendCategoryDetailReq = {
        categoryId: categoryId as string,
      };
      const detailData = await queryBackendCategoryDetail(params);
      categoryDetail.value = detailData.data;

      oldUnitList.value = JSON.parse(JSON.stringify(detailData.data.propertyUnitKeys));
      propertyUnitList.value = detailData.data.propertyUnitKeys;

      oldGroupList.value = JSON.parse(JSON.stringify(detailData.data.propertyGroups));
      propertyGroupList.value = detailData.data.propertyGroups;

      oldSaleList.value = JSON.parse(JSON.stringify(detailData.data.propertySaleKeys));
      propertySaleList.value = detailData.data.propertySaleKeys;

      const parentData = await queryParentCategoryDetail(params);
      parentCategoryDetails.value = parentData.data;
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


.wrapper {
  padding: 20px;
  background-color: var(--color-bg-2);
  border-radius: 4px;
}
</style>
