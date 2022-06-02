<template>
    <el-tooltip
        placement="left"
        :content="
            loading ? 'Syncing...' : tx ? `Already on chain! Tx: ${tx.slice(0, 4)}...${tx.slice(-4)}` : 'Click to sync'
        "
    >
        <div
            class="flex w-6 h-6"
            :class="{
                'fill-[#5088ff]': tx,
                grayscale: !tx,
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
    tx: {
        type: String,
    },
    postFunc: {
        type: Function,
        required: true,
    },
});

const tx = ref(props.tx);
const loading = ref(false);

const syncOrRedirect = async (e: any) => {
    loading.value = true;
    e.preventDefault();
    if (!tx.value) {
        tx.value = await props.postFunc();
    } else {
        window.open(`https://scan.crossbell.io/tx/${tx.value}`, '_blank');
    }
    loading.value = false;
};
</script>
