<template>
  <div>
    <a-upload
      ref="uploadRef"
      :custom-request="customRequest"
      list-type="picture-card"
      :file-list="fileList"
      :show-upload-button="true"
      image-preview
      :limit="limit"
    >
    </a-upload>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import type {
    FileItem,
    RequestOption,
  } from '@arco-design/web-vue/es/upload/interfaces';
  import { fileUploadApi } from '@/api/file/file';

  withDefaults(
    defineProps<{
      limit?: number;
      fileList: FileItem[];
    }>(),
    {
      limit: 1,
      fileList: undefined,
    }
  );

  const uploadRef = ref();

  const emits = defineEmits(['successHandler']);

  const customRequest = (options: RequestOption) => {
    const controller = new AbortController();

    (async function requestWrap() {
      const {
        onProgress,
        onError,
        onSuccess,
        fileItem,
        name = 'file',
      } = options;
      onProgress(20);
      const formData = new FormData();
      formData.append(name as string, fileItem.file as Blob);
      const onUploadProgress = (event: ProgressEvent) => {
        let percent;
        if (event.total > 0) {
          percent = (event.loaded / event.total) * 100;
        }
        onProgress(parseInt(String(percent), 10), event);
      };

      try {
        const res = await fileUploadApi(formData, {
          controller,
          onUploadProgress,
        });
        onSuccess(res);
        emits('successHandler', res.data);
      } catch (error) {
        onError(error);
      }
    })();
    return {
      abort() {
        controller.abort();
      },
    };
  };
</script>

<style scoped></style>
