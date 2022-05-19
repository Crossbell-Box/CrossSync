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
import { connect as w3mConnect } from '@/common/wallet';
import { useStore } from '@/common/store';

const router = useRouter();
const store = useStore();

const connect = async (force = true) => {
    try {
        const provider = await w3mConnect(force);
        if (provider) {
            await initState(provider);
            await next();
        }
    } catch (e) {
        console.log(e);
    }
};

const initState = async (provider: any) => {
    await store.dispatch('setProviderAndConnectContract', provider);
    const userAddress = await store.state.provider?.getSigner().getAddress();
    console.log('Connect Wallet:', userAddress);
};

const next = async () => {
    const userAddress = await store.state.provider?.getSigner().getAddress();
    const contract = store.state.crossbell.contract;
    if (userAddress && contract) {
        const primaryprofileID = (await contract.getPrimaryProfileId(userAddress)).data;
        if (parseInt(primaryprofileID) === 0) {
            // No primary profile, go to mint
            console.log('No primary profile, go to mint');
            await router.push('/mint');
        } else {
            // Just login
            console.log('Found primary profile with ID', primaryprofileID);
            await router.push('/home');
        }
    } else {
        console.error('CONTRACT IS INVALID');
    }
};

connect(false);
</script>

<style></style>
