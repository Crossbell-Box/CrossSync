<template>
    <div class="flex w-full h-full px-8 max-w-screen-lg">
        <Sidebar />
        <div class="flex-1 flex flex-col">
            <h1 class="flex text-4xl font-bold my-5 py-4">Help</h1>
            <div class="flex flex-col">
                <p>Here are some introductions to CrossSync and Crossbell...</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useStore } from '@/common/store';
import Sidebar from '@/components/Sidebar.vue';
import { ArrowRight } from '@element-plus/icons-vue';
import { disconnect } from '@/common/wallet';
import { ElMessageBox } from 'element-plus';

const router = useRouter();
const store = useStore();

if (store.state.address) {
    if (!store.state.profiles?.list.length) {
        router.push('/mint');
    } else if (!store.state.handle) {
        router.push('/profiles');
    }
} else {
    router.push('/');
}

const switchProfile = () => {
    router.push('/profiles');
};

const switchAccount = async () => {
    await store.dispatch('reset');
    await router.push('/');
};
</script>

<style></style>
