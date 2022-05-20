<template>
    <div class="flex w-full h-full px-8">
        <div class="w-80 mr-12 min-h-full pt-28 flex flex-col">
            <Profile class="mb-0 rounded-br-none cursor-pointer" :profile="profile" @click="profileClick" />
            <el-menu class="flex-1">
                <el-menu-item index="2">
                    <span>Settings</span>
                </el-menu-item>
                <el-menu-item index="3">
                    <span>Help</span>
                </el-menu-item>
            </el-menu>
        </div>
        <div class="flex-1 min-h-full">
            <ul v-infinite-scroll="load" class="infinite-list h-full" style="overflow: auto">
                <h1 class="text-4xl font-bold my-5 py-4">Home</h1>
                <li v-for="i in count" :key="i" class="flex items-center justify-center h-36 bg-slate-100 mb-4">
                    {{ i }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Profile from '../components/Profiles.vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/common/store';

const router = useRouter();
const store = useStore();

const profile = ref<any>({});

const count = ref(20);
const load = () => {
    count.value += 10;
};

const profileClick = () => {
    router.push('/profiles');
};

if (!store.state.profiles?.list.length) {
    router.push('/mint');
}

profile.value = store.state.profiles!.list[0];
</script>

<style></style>
