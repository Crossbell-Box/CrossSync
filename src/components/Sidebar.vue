<template>
    <div class="w-80 mr-12 min-h-full pt-28 flex flex-col">
        <Profile class="mb-0 rounded-br-none cursor-pointer" :profile="profile" @click="profileClick" />
        <el-menu class="flex-1">
            <el-menu-item index="2" @click="settingsClick">
                <span>Settings</span>
            </el-menu-item>
            <el-menu-item index="3" @click="helpClick">
                <span>Help</span>
            </el-menu-item>
        </el-menu>
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

const profileClick = () => {
    router.push('/home');
};

const settingsClick = () => {
    router.push('/settings');
};

const helpClick = () => {
    // router.push('/help');
};

const init = async () => {
    if (!store.state.profiles?.list.length) {
        await router.push('/mint');
    }

    profile.value = store.state.profiles!.list[0];
};

init();
</script>
