<template>
    <div class="flex w-full h-full px-8 max-w-screen-lg">
        <Sidebar />
        <div class="flex-1 flex flex-col">
            <h1 class="flex text-4xl font-bold my-5 py-4">Home</h1>
            <ul v-infinite-scroll="load" class="infinite-list flex-1" style="overflow: auto">
                <li v-for="i in count" :key="i" class="flex items-center justify-center h-36 bg-slate-100 mb-4">
                    {{ i }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/common/store';
import Sidebar from '@/components/Sidebar.vue';

const router = useRouter();
const store = useStore();

if (store.state.settings.address) {
    if (!store.state.profiles?.list.length) {
        router.push('/mint');
    } else if (!store.state.settings.handle) {
        router.push('/profiles');
    }
} else {
    router.push('/');
}

const count = ref(20);
const load = () => {
    count.value += 10;
};
</script>

<style></style>
