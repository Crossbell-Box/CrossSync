<template>
    <router-view />
</template>

<script setup lang="ts">
import { connect as w3mConnect } from '@/common/wallet';
import { useStore } from '@/common/store';
import { useRouter } from 'vue-router';
import Unidata from 'unidata.js';

const router = useRouter();

const store = useStore();

const provider = await w3mConnect(false);
if (provider) {
    window.unidata = new Unidata({
        ethereumProvider: provider,
    });
    await store.dispatch('getAddress', provider);
} else {
    await router.push('/');
}
</script>

<style></style>
