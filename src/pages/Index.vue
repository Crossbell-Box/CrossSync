<template>
    <div class="text-center w-full h-full flex items-center justify-center">
        <div class="pb-8">
            <img class="inline-block rounded-full" width="150" src="../assets/logo.jpeg" />
            <h1 class="text-4xl font-bold my-5">Welcome to CrossSync! 👋</h1>
            <p class="my-5 text-slate-400">Here are some introductions to CrossSync and Crossbell...</p>
            <el-button type="primary" round size="large" class="text-xl" @click="connect">Connect Wallet</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const connect = () => {
    router.push('/mint');
};
</script>

<style></style>
