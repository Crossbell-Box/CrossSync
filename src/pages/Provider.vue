<template>
    <router-view />
</template>

<script setup lang="ts">
import { connect as wConn } from '@/common/wallet';
import { useStore } from '@/common/store';
import { useRouter } from 'vue-router';
import Unidata from 'unidata.js';
import { ElLoading } from 'element-plus';
import { ethers } from 'ethers';

const router = useRouter();
const store = useStore();

const init = async () => {
    const loading = ElLoading.service({
        lock: true,
    });
    const provider = await wConn(false);
    if (provider) {
        window.unidata = new Unidata({
            ethereumProvider: provider,
        });
        const web3Provider = new ethers.providers.Web3Provider(provider);
        try {
            const address = await web3Provider.getSigner().getAddress();
            await store.dispatch('setSettings', {
                address: address,
            });
        } catch (e) {
            // Failed to get address (wallet not connected?)
            await store.dispatch('reset');
        }
    } else {
        await router.push('/');
    }
    loading.close();
};

await init();
</script>

<style></style>
