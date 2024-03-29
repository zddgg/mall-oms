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
                      <template #propertySaleValues="{record}">
                        <a-space>
                          <a-tag v-for="(item, index) in record.propertySaleValues" :key="index">
                            {{ item.valueName }}
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
          <a-table
              v-if="attrUnitList && attrUnitList.length !== 0"
              :columns="propertyUnitColumns"
              :data="attrUnitList"
          >
            <template #id="{ record }">
              <div style="display: flex">
                <div>
                  <span>{{ record.attrId }}</span>
                </div>
                <div v-if="isNewUnit(record.attrId)" style="margin-left: 10px">
                  <a-tag color="#165dff">新添加</a-tag>
                </div>
              </div>
            </template>
            <template #operations="{ rowIndex }">
              <a-space>
                <a-button
                    v-if="!readonly"
                    type="primary" status="danger"
                    @click="attrUnitList.splice(rowIndex, 1)"
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
          <a-table
              v-if="attrGroupList && attrGroupList.length !== 0"
              :columns="propertyGroupColumns"
              :data="attrGroupList"
          >
            <template #id="{ record }">
              <div style="display: flex">
                <div>
                  <span>{{ record.groupId }}</span>
                </div>
                <div v-if="isNewGroup(record.groupId)" style="margin-left: 10px">
                  <a-tag color="#165dff">新添加</a-tag>
                </div>
              </div>
            </template>
            <template #relatedAttr="{ record }">
              <a-popover trigger="click">
                <a-button size="small">
                  {{ `数量 ${record.attrUnitRecords.length}` }}
                </a-button>
                <template #content>
                  <a-table
                      row-key="id"
                      :pagination="false"
                      :columns="propertyUnitColumns"
                      :data="record.attrUnitRecords"
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
                    @click="attrGroupList.splice(rowIndex, 1)"
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
          <a-table
              v-if="attrSaleList && attrSaleList.length !== 0"
              :columns="propertySaleColumns"
              :data="attrSaleList"
          >
            <template #id="{ record }">
              <div style="display: flex">
                <div>
                  <span>{{ record.attrId }}</span>
                </div>
                <div v-if="isNewSale(record.attrId)" style="margin-left: 10px">
                  <a-tag color="#165dff">新添加</a-tag>
                </div>
              </div>
            </template>
            <template #attrSaleValues="{record}">
              <a-space>
                <a-tag v-for="(item, index) in record.attrSaleValues" :key="index">
                  {{ item.attrValueName }}
                </a-tag>
              </a-space>
            </template>
            <template #operations="{ rowIndex }">
              <a-space>
                <a-button
                    v-if="!readonly"
                    type="primary" status="danger"
                    @click="attrSaleList.splice(rowIndex, 1)"
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
        title="销售属性信息"
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
  addAttrSale,
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
  AttrGroupRecord,
  AttrSaleRecord,
  AttrUnitRecord,
  queryAttrGroupDetail,
  queryAttrUnitDetail,
} from "@/api/product/property";
import PropertyUnitTable from "@/views/product/attr/components/propertyUnitTable.vue";
import PropertyGroupTable from "@/views/product/attr/components/propertyGroupTable.vue";
import PropertySaleTable from "@/views/product/attr/components/propertySaleTable.vue";
import {EnumResp, queryEnum} from "@/api/common/enum";

const router = useRouter();
const route = useRoute();
const {loading, setLoading} = useLoading();

const formRef = ref<FormInstance>();
const categoryDetail = ref<BackendCategoryDetail>({} as BackendCategoryDetail);
const parentCategoryDetails = ref<BackendCategoryDetail[]>([]);

const oldUnitList = ref<AttrUnitRecord[]>([])
const attrUnitList = ref<AttrUnitRecord[]>([])

const oldGroupList = ref<AttrGroupRecord[]>([])
const attrGroupList = ref<AttrGroupRecord[]>([])

const oldSaleList = ref<AttrSaleRecord[]>([])
const attrSaleList = ref<AttrSaleRecord[]>([])

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

const isNewUnit = (attrId: string) => {
  const find = oldUnitList.value.find((item) => item.attrId === attrId);
  return !find;
}
const isNewGroup = (groupId: string) => {
  const find = oldGroupList.value.find((item) => item.groupId === groupId);
  return !find;
}
const isNewSale = (attrId: string) => {
  const find = oldSaleList.value.find((item) => item.attrId === attrId);
  return !find;
}

const propertyUnitModalOk = async () => {
  const keyIds = propertyUnitTableRef.value.selectedKeysHandler();
  console.log(keyIds)
  if (!keyIds || keyIds.length === 0) {
    Message.warning('没有选择属性数据！');
  } else {
    const find = attrUnitList.value.find((item) => item.attrId === keyIds[0]);
    if (find) {
      Message.warning('属性已添加！');
    } else {
      const params: AttrUnitRecord = {
        attrId: keyIds[0] as string,
      };
      const {data} = await queryAttrUnitDetail(params);
      attrUnitList.value.push(data);
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
    const find = attrGroupList.value.find((item) => item.groupId === keyIds[0]);
    if (find) {
      Message.warning('属性已添加！');
    } else {
      const params: AttrGroupRecord = {
        groupId: keyIds[0] as string,
      };
      const {data} = await queryAttrGroupDetail(params);
      console.log(data)
      attrGroupList.value.push(data);
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
    const find = attrSaleList.value.find((item) => item.attrId === keyIds[0]);
    if (find) {
      Message.warning('属性已添加！');
    } else {
      const params = {
        categoryId: categoryDetail.value.categoryId as string,
        attrId: keyIds[0] as string,
      };
      const {msg} = await addAttrSale(params);
      Message.info(msg);
      await init();
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

    params.propertyUnitIds = attrUnitList.value.map((item) => item.attrId || '');
    params.propertyGroupIds = attrGroupList.value.map((item) => item.groupId || '');
    params.propertySaleIds = attrSaleList.value.map((item) => item.attrId || '');

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

      oldUnitList.value = JSON.parse(JSON.stringify(detailData.data.attrUnitRecords));
      attrUnitList.value = detailData.data.attrUnitRecords;

      oldGroupList.value = JSON.parse(JSON.stringify(detailData.data.attrGroupRecords));
      attrGroupList.value = detailData.data.attrGroupRecords;

      oldSaleList.value = JSON.parse(JSON.stringify(detailData.data.attrSaleRecords));
      attrSaleList.value = detailData.data.attrSaleRecords;

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
