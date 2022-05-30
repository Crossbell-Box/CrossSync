<template>
    <div class="py-5">
        <h1 class="text-4xl font-bold my-5">Claim some $CSB 🪙</h1>
        <div class="mb-8">
            <span>
                Your current balance is lower than recommended (
                <span> $0.02 </span>).
                <p>Claim some from faucet? 💰</p>
            </span>
        </div>
        <div>
            <el-button type="primary" @click="toFaucet"> Take me there </el-button>
            <el-button type="default" @click="next">
                {{ nextState }}
            </el-button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useStore } from '@/common/store';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const store = useStore();

const nextState = ref('Skip');

const toFaucet = () => {
    nextState.value = 'Proceed';
    window.open(`https://faucet.crossbell.io/?address=${store.state.settings.address}`, '_blank');
};

const next = () => {
    if (!store.state.profiles?.list.length) {
        router.push('/mint');
    } else if (!store.state.settings.handle) {
        router.push('/profiles');
    } else {
        router.push('/home');
    }
};
</script>
