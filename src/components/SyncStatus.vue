<template>
    <el-tooltip placement="left" :content="loading ? loadingNotice : noteID || 'Click to sync'">
        <div
            class="flex w-6 h-6"
            :class="{
                'fill-[#5088ff]': noteID,
                grayscale: !noteID,
                'opacity-50 mr-4': true,
            }"
            cssc="sync-status"
        >
            <el-icon class="w-full h-full is-loading" v-if="loading">
                <Loading />
            </el-icon>
            <span v-else @click="syncOrRedirect" class="flex w-full h-full items-center logo" v-html="logo" />
        </div>
    </el-tooltip>
</template>
<script setup lang="ts">
import logo from '../assets/logo.svg?raw';
import { ref } from 'vue';
import { Loading } from '@element-plus/icons-vue';

const props = defineProps({
    loadFunc: {
        type: Function,
        required: true,
    },
    postFunc: {
        type: Function,
        required: true,
    },
});

const noteID = ref('');
const loading = ref(true);
const loadingNotice = ref('Loading...');

const syncOrRedirect = async (e: any) => {
    loading.value = true;
    e.preventDefault();
    if (!noteID.value) {
        loadingNotice.value = 'Syncing...';
        noteID.value = await props.postFunc();
    }
    loading.value = false;
};

const init = async () => {
    noteID.value = await props.loadFunc();
    loading.value = false;
};

init();
</script>
