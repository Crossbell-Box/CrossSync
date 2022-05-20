<template>
    <div class="text-center w-full h-full flex items-center justify-center">
        <div class="pb-8">
            <img class="inline-block rounded-full" width="150" src="../assets/logo.jpeg" />
            <h1 class="text-4xl font-bold my-5">Welcome to CrossSync! 👋</h1>
            <p class="my-5 text-slate-400">Here are some introductions to CrossSync and Crossbell...</p>
            <el-button type="primary" :loading="isConnecting" round size="large" class="text-xl" @click="connect"
                >Connect Wallet</el-button
            >
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { connect as w3mConnect } from '@/common/wallet';
import { useStore } from '@/common/store';
import { ref } from 'vue';
import Unidata from 'unidata.js';
import { ElMessage } from 'element-plus';

const router = useRouter();
const store = useStore();
const isConnecting = ref(false);

const connect = async (force = true) => {
    isConnecting.value = true;

    try {
        const provider = await w3mConnect(force);
        if (provider) {
            ElMessage.success('Wallet connected successfully, start system initializing...');
            window.unidata = new Unidata({
                ethereumProvider: provider,
            });
            await store.dispatch('getAddress', provider);
            await next();
        }
    } catch (e: any) {
        ElMessage.error('Failed to connect: ' + e.message);
    }

    isConnecting.value = false;
};

const next = async () => {
    const profiles = store.state.profiles;
    if (!profiles?.list.length) {
        await router.push('/mint');
    } else {
        await router.push('/profiles');
    }
};

const init = () => {
    if (store.state.address) {
        next();
    }
};

init();
</script>

<style></style>
