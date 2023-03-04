<template>
  <div class="container">
    <a-card class="general-card" title="后台类目管理">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="searchFormModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="right"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="brandNo" label="后台类目">
                  <a-cascader
                    v-model="searchFormModel.categoryId"
                    :options="backendCategoryOptions"
                    :field-names="{
                      value: 'categoryId',
                      label: 'categoryName',
                    }"
                    placeholder="请选择后台类目"
                    allow-clear
                    check-strictly
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('searchTable.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('searchTable.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="routeToBackendCategoryCreate">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('searchTable.operation.create') }}
            </a-button>
            <a-upload action="/">
              <template #upload-button>
                <a-button>
                  {{ $t('searchTable.operation.import') }}
                </a-button>
              </template>
            </a-upload>
          </a-space>
        </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <a-button>
            <template #icon>
              <icon-download />
            </template>
            {{ $t('searchTable.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('searchTable.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('searchTable.actions.density')">
              <div class="action-icon"><icon-line-height size="18" /></div>
            </a-tooltip>
            <template #content>
              <a-doption
                v-for="item in densityList"
                :key="item.value"
                :value="item.value"
                :class="{ active: item.value === size }"
              >
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
          <a-tooltip :content="$t('searchTable.actions.columnSetting')">
            <a-popover
              trigger="click"
              position="bl"
              @popup-visible-change="popupVisibleChange"
            >
              <div class="action-icon"><icon-settings size="18" /></div>
              <template #content>
                <div id="tableSetting">
                  <div
                    v-for="(item, index) in showColumns"
                    :key="item.dataIndex"
                    class="setting"
                  >
                    <div style="margin-right: 4px; cursor: move">
                      <icon-drag-arrow />
                    </div>
                    <div>
                      <a-checkbox
                        v-model="item.checked"
                        @change="handleChange($event, item, index)"
                      >
                      </a-checkbox>
                    </div>
                    <div class="title">
                      {{ item.title === '#' ? '序列号' : item.title }}
                    </div>
                  </div>
                </div>
              </template>
            </a-popover>
          </a-tooltip>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="columns"
        :data="renderData"
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
      >
        <template #categoryTree="{ record }">
          <a-cascader
            :default-value="record.categoryName"
            :options="findTreeItem(record.categoryId)"
            :field-names="{
              value: 'categoryId',
              label: 'categoryName',
            }"
            :format-label="(options: BackendCategoryTree[]) => {
              return options[0].categoryName
            }"
          />
        </template>
        <template #propertyCount="{ record }">
          <span>{{
            `属性组: ${record.groupCount} 属性: ${record.storeCount}`
          }}</span>
        </template>
        <template #status="{ record }">
          <div v-if="record.status === '0'">
            <span class="circle reject"></span>
            已停用
          </div>
          <div v-else-if="record.status === '1'">
            <span class="circle pass"></span>
            使用中
          </div>
        </template>
        <template #operations="{ record }">
          <a-space>
            <a-button
              size="small"
              @click="
                router.push({
                  name: 'CategoryDetail',
                  params: {
                    categoryId: record.categoryId,
                  },
                  query: {
                    actionType: '1',
                  },
                })
              "
            >
              查看
            </a-button>
            <a-button
              size="small"
              @click="
                router.push({
                  name: 'CategoryDetail',
                  params: {
                    categoryId: record.categoryId,
                  },
                  query: {
                    actionType: '2',
                  },
                })
              "
            >
              编辑
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, nextTick, reactive, ref, watch } from 'vue';
  import useLoading from '@/hooks/loading';
  import {
    BackendCategoryRecord,
    BackendCategoryTree,
    queryBackendCategoryTree,
    BackendCategorySearchParams,
    queryCategoryList,
  } from '@/api/product/category';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';

  const { loading, setLoading } = useLoading(false);
  const { t } = useI18n();
  const router = useRouter();

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const densityList = computed(() => [
    {
      name: t('searchTable.size.mini'),
      value: 'mini',
    },
    {
      name: t('searchTable.size.small'),
      value: 'small',
    },
    {
      name: t('searchTable.size.medium'),
      value: 'medium',
    },
    {
      name: t('searchTable.size.large'),
      value: 'large',
    },
  ]);

  const generateSearchFormModel = () => {
    return {
      categoryId: '',
    };
  };

  const renderData = ref<BackendCategoryRecord[] | undefined>([]);
  const searchFormModel = ref(generateSearchFormModel());

  const size = ref<SizeProps>('medium');

  const basePagination: Pagination = {
    current: 1,
    pageSize: 10,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const columns = computed<TableColumnData[]>(() => [
    {
      title: '类目编号',
      dataIndex: 'categoryId',
    },
    {
      title: '类目名称',
      dataIndex: 'categoryName',
      slotName: 'categoryTree',
    },
    {
      title: '类目层级',
      dataIndex: 'level',
    },
    {
      title: '创建时间',
      dataIndex: 'created',
    },
    {
      title: '绑定属性数量',
      slotName: 'propertyCount',
    },
    {
      title: '类目状态',
      dataIndex: 'status',
      slotName: 'status',
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);

  const fetchData = async (
    params: BackendCategorySearchParams = { current: 1, pageSize: 10 }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryCategoryList(params);
      renderData.value = data.records;
      pagination.current = params.current;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    fetchData({
      ...basePagination,
      ...searchFormModel.value,
    } as unknown as BackendCategorySearchParams);
  };
  const onPageChange = (current: number) => {
    fetchData({
      ...basePagination,
      current,
    } as unknown as BackendCategorySearchParams);
  };

  const backendCategoryOptions = ref<BackendCategoryTree[]>([]);
  const getBackendCategoryTree = async () => {
    const { data } = await queryBackendCategoryTree({ maxLevel: 3 });
    backendCategoryOptions.value = data;
  };

  const findTreeItem = (categoryId: string) => {
    let hasFound = false;
    let result;
    const fn = (list: BackendCategoryTree[]) => {
      if (Array.isArray(list) && !hasFound) {
        list.forEach((item) => {
          if (item.categoryId === categoryId) {
            result = item;
            hasFound = true;
          } else if (item.children) {
            fn(item.children);
          }
        });
      }
    };
    fn(backendCategoryOptions.value);
    return [result];
  };

  const reset = () => {
    searchFormModel.value = generateSearchFormModel();
  };

  getBackendCategoryTree();
  search();

  const routeToBackendCategoryCreate = () => {
    router.push({
      name: 'BackendCategoryCreate',
    });
  };

  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined,
    e: Event
  ) => {
    size.value = val as SizeProps;
  };

  const handleChange = (
    checked: boolean | (string | boolean | number)[],
    column: Column,
    index: number
  ) => {
    if (!checked) {
      cloneColumns.value = showColumns.value.filter(
        (item) => item.dataIndex !== column.dataIndex
      );
    } else {
      cloneColumns.value.splice(index, 0, column);
    }
  };

  const exchangeArray = <T extends Array<any>>(
    array: T,
    beforeIdx: number,
    newIdx: number,
    isDeep = false
  ): T => {
    const newArray = isDeep ? cloneDeep(array) : array;
    if (beforeIdx > -1 && newIdx > -1) {
      // 先替换后面的，然后拿到替换的结果替换前面的
      newArray.splice(
        beforeIdx,
        1,
        newArray.splice(newIdx, 1, newArray[beforeIdx]).pop()
      );
    }
    return newArray;
  };

  const popupVisibleChange = (val: boolean) => {
    if (val) {
      nextTick(() => {
        const el = document.getElementById('tableSetting') as HTMLElement;
        const sortable = new Sortable(el, {
          onEnd(e: any) {
            const { oldIndex, newIndex } = e;
            exchangeArray(cloneColumns.value, oldIndex, newIndex);
            exchangeArray(showColumns.value, oldIndex, newIndex);
          },
        });
      });
    }
  };

  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );
</script>

<style scoped lang="less">
  .container {
    padding: 20px;
  }

  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }

  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }

  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }

  .setting {
    display: flex;
    align-items: center;
    width: 200px;

    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>
