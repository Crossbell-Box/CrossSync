<template>
    <div class="w-80 mr-12 min-h-full pt-28 flex flex-col relative flex-shrink-0">
        <Header />
        <Character
            class="mb-0 rounded-br-none cursor-pointer border-0"
            :character="character"
            @click="characterClick"
            size="small"
        />
        <el-card shadow="hover" class="cursor-pointer mt-4 border-0" @click="settingsClick">
            <div class="flex flex-row" style="justify-content: space-between">
                <div class="flex">⚙️ Settings</div>
            </div>
        </el-card>
        <el-card shadow="hover" class="cursor-pointer mt-2 border-0" @click="helpClick">
            <div class="flex flex-row" style="justify-content: space-between">
                <div class="flex">🙋‍♀️ Help</div>
            </div>
        </el-card>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import Character from '@/components/Characters.vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/common/store';
import Header from '@/components/Header.vue';

const router = useRouter();
const store = useStore();

const character = ref<any>({});

const characterClick = () => {
    router.push('/home');
};

const settingsClick = () => {
    router.push('/home/settings');
};

const helpClick = () => {
    router.push('/home/help');
};

character.value =
    store.state.characters!.list.find((character) => character.username === store.state.settings.handle) ||
    store.state.characters!.list[0]; // As a fallback, use the first character
</script>

<style scoped>
.menu {
    border: none;
}
</style>
