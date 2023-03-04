<template>
  <div class="container">
    <a-spin :loading="loading" style="width: 100%">
      <a-card class="general-card" title="新增品牌">
        <div class="wrapper">
          <a-form
            ref="formRef"
            :model="formData"
            class="form"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            @submit-success="submitSuccess"
          >
            <a-form-item
              field="brandName"
              label="品牌名称"
              :rules="[{ required: true, message: 'name is required' }]"
            >
              <a-input
                v-model="formData.brandName"
                placeholder="请输入品牌名称"
              />
            </a-form-item>
            <a-form-item
              field="foreignBrandName"
              label="品牌外文名称"
              :rules="[{ required: false, message: 'name is required' }]"
            >
              <a-input
                v-model="formData.foreignBrandName"
                placeholder="请输入品牌英文名称"
              />
            </a-form-item>
            <a-form-item
              field="showName"
              label="品牌展示名称"
              :rules="[{ required: false, message: 'name is required' }]"
            >
              <a-input
                v-model="formData.showName"
                placeholder="请输入品牌英文名称"
              />
            </a-form-item>
            <a-form-item
              field="logo"
              label="品牌LOGO"
              :rules="[{ required: false, message: 'name is required' }]"
            >
              <file-upload
                :file-list="fileList"
                @success-handler="uploadSuccess"
              />
            </a-form-item>
            <a-form-item>
              <div>
                <a-button
                  type="primary"
                  html-type="submit"
                  style="margin-right: 80px"
                >
                  提交审核
                </a-button>
                <a-button type="primary" @click="reset"> 重置</a-button>
              </div>
            </a-form-item>
          </a-form>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { BrandCreateRecord, createBrand } from '@/api/product/brand';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { FileItem } from '@arco-design/web-vue/es/upload/interfaces';
  import { Message } from '@arco-design/web-vue';
  import { useRouter } from 'vue-router';
  import FileUpload from '@/components/fileUpload/fileUpload.vue';

  const formRef = ref<FormInstance>();
  const { loading, setLoading } = useLoading(false);
  const router = useRouter();

  const formData = ref<BrandCreateRecord>({} as BrandCreateRecord);

  let uploadResult: FileItem;

  const fileList = ref<FileItem[]>([]);

  const uploadSuccess = (fileItem: FileItem) => {
    uploadResult = fileItem;
  };

  const submitSuccess = async (values: Record<string, any>) => {
    setLoading(true);
    try {
      const params: BrandCreateRecord = {
        brandName: values.brandName,
        foreignBrandName: values.foreignBrandName,
        showName: values.showName,
        logo: uploadResult ? uploadResult.url : '',
      };
      const result = await createBrand(params);
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

  const reset = () => {
    formData.value = {} as BrandCreateRecord;
  };
</script>

<style scoped lang="less">
  .container {
    padding: 20px;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 64px 0;
    background-color: var(--color-bg-2);

    :deep(.arco-form) {
      .arco-form-item {
        &:last-child {
          margin-top: 20px;
        }
      }
    }
  }

  .form {
    width: 500px;
  }
</style>
