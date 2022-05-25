<template>
    <el-button
        :type="isSyncing ? 'success' : 'default'"
        :icon="isSyncing ? Check : Close"
        circle
        @click="toggleSyncing"
    />
</template>

<script setup lang="ts">
import { Check, Close } from '@element-plus/icons-vue';
// import {useStore} from "@/common/store";
import { ref } from 'vue';

// const store = useStore();

// const isSyncing = ref(store.state.settings.syncing);
const isSyncing = ref(true);
const toggleSyncing = async () => {
    isSyncing.value = !isSyncing.value;
    // await store.dispatch('setSettings', {
    //   syncing: isSyncing.value,
    // });
};
</script>
