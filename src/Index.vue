<template>
    <div class="absolute left-8 top-8">
        <router-link to="/"><img class="inline-block rounded-full" width="50" src="./assets/logo.jpeg" /></router-link>
    </div>
    <router-view />
    <div class="absolute bottom-8 text-slate-400">@ Natural Selection Labs</div>
</template>

<script setup lang="ts">
import { connect as w3mConnect } from '@/common/wallet';
import { useStore } from '@/common/store';

const store = useStore();

(async () => {
    const provider = await w3mConnect(false);
    if (provider) {
        await store.dispatch('setProviderAndConnectContract', provider);
        const userAddress = await store.state.provider?.getSigner().getAddress();
        console.log('Connect Wallet:', userAddress);
    }
})();
</script>

<style>
html,
body,
#app {
    height: 100%;
}

#app {
    font-family: SFCompactRounded, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
