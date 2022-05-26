<template>
    <div class="w-80 mr-12 min-h-full pt-28 flex flex-col relative">
        <Header />
        <Profile
            class="menu mb-0 rounded-br-none cursor-pointer"
            :profile="profile"
            @click="profileClick"
            size="small"
        />
        <el-card shadow="hover" class="menu cursor-pointer mt-4" @click="settingsClick">
            <div class="flex flex-row" style="justify-content: space-between">
                <div class="flex">⚙️ Settings</div>
            </div>
        </el-card>
        <el-card shadow="hover" class="menu cursor-pointer mt-2" @click="helpClick">
            <div class="flex flex-row" style="justify-content: space-between">
                <div class="flex">🙋‍♀️ Help</div>
            </div>
        </el-card>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import Profile from '@/components/Profiles.vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/common/store';
import Header from '@/components/Header.vue';

const router = useRouter();
const store = useStore();

const profile = ref<any>({});

const profileClick = () => {
    router.push('/home');
};

const settingsClick = () => {
    router.push('/home/settings');
};

const helpClick = () => {
    router.push('/home/help');
};

profile.value =
    store.state.profiles!.list.find((profile) => profile.username === store.state.settings.handle) ||
    store.state.profiles!.list[0]; // As a fallback, use the first profile
</script>

<style scoped>
.menu {
    border: none;
}
</style>
