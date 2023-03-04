<template>
  <div class="container">
    <Breadcrumb :items="['menu.form', 'menu.form.group']" />
    <a-form
      ref="formRef"
      layout="vertical"
      :model="formData"
      @submit-success="submitSuccess"
    >
      <a-space direction="vertical" :size="16">
        <a-card class="general-card">
          <template #title>
            {{ $t('groupForm.title.video') }}
          </template>
          <a-row :gutter="80">
            <a-col :span="8">
              <a-form-item label="品牌名称" field="brandName">
                <a-input v-model="formData.brandName" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="外文品牌名称" field="foreignBrandName">
                <a-input v-model="formData.foreignBrandName" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="品牌展示名称" field="showName">
                <a-input v-model="formData.showName" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="80">
            <a-col :span="8">
              <a-form-item label="品牌LOGO">
                <a-image
                  v-if="readonly"
                  width="80"
                  :src="formData.logo"
                  :preview="false"
                />
                <file-upload
                  v-else
                  :file-list="fileList"
                  @success-handler="uploadSuccess"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="品牌分级" field="level">
                <a-select v-model="formData.level">
                  <a-option value="0">未分级</a-option>
                  <a-option value="1">B级</a-option>
                  <a-option value="2">A级</a-option>
                  <a-option value="3">S级</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="品牌状态" field="status">
                <a-select v-model="formData.status">
                  <a-option value="-1">已删除</a-option>
                  <a-option value="0">已停用</a-option>
                  <a-option value="1">已启用</a-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
      </a-space>
      <div class="actions">
        <a-space>
          <a-button>
            {{ $t('groupForm.reset') }}
          </a-button>
          <a-button type="primary" :loading="loading" html-type="submit">
            {{ $t('groupForm.submit') }}
          </a-button>
        </a-space>
      </div>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import {
    BrandRecord,
    queryBrandDetail,
    updateBrand,
  } from '@/api/product/brand';
  import { useRoute, useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { FileItem } from '@arco-design/web-vue/es/upload/interfaces';
  import FileUpload from '@/components/fileUpload/fileUpload.vue';

  const route = useRoute();
  const router = useRouter();
  const action = ref<string | string[]>('');
  const readonly = ref<boolean>(true);
  const formData = ref<BrandRecord>({} as BrandRecord);
  const formRef = ref<FormInstance>();
  const { loading, setLoading } = useLoading();

  const fileList = ref<FileItem[]>([]);

  const uploadSuccess = (fileItem: FileItem) => {
    formData.value.logo = fileItem.url;
  };

  const submitSuccess = async () => {
    setLoading(true);
    try {
      const result = await updateBrand(formData.value);
      await router.push({
        name: 'Brand',
      });
      Message.info(result.msg);
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const init = async () => {
    const { brandId } = route.params;
    const { actionType } = route.query;
    action.value = actionType as string;
    readonly.value = (actionType as string) === '1';

    if (action.value === '1' || action.value === '2') {
      setLoading(true);
      try {
        const params: BrandRecord = {
          brandId: brandId as string,
        };
        const { data } = await queryBrandDetail(params);
        formData.value = data;
        fileList.value.push({
          url: data.logo,
        } as FileItem);
      } catch (err) {
        // you can report use errorHandler or other
      } finally {
        setLoading(false);
      }
    }
  };
  init();
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 40px 20px;
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
