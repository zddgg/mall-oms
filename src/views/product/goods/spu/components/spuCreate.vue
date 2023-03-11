<template>
  <div class="container">
    xx
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {FormInstance} from '@arco-design/web-vue/es/form';
import useLoading from '@/hooks/loading';
import {useRoute} from "vue-router";

const formRef = ref<FormInstance>();
const {loading, setLoading} = useLoading();
const route = useRoute();

const action = ref<string>('');

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
