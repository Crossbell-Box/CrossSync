<template>
    <div v-loading="loading" class="py-5">
        <h2 class="text-4xl font-bold my-5">Choose Your Character</h2>
        <p>
            <span class="align-middle"
                >You are logged in as <b>{{ address }}</b>
            </span>
            <el-button class="align-middle ml-2" text bg type="primary" @click="switchAccount"
                >switch account</el-button
            >
            <span class="align-middle"> , you have {{ characters.length }} characters, choose one to continue</span>
        </p>
        <div class="my-5">
            <CharacterCard
                class="character mt-4 cursor-pointer mb-5"
                v-for="character in characters.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
                :character="character"
                :key="character.username"
                @click="choose(character)"
            />
            <el-pagination
                class="justify-center"
                background
                layout="prev, pager, next"
                :total="characters.length"
                hide-on-single-page
                :page-size="pageSize"
                v-model:current-page="currentPage"
            />
        </div>
        <el-card class="relative cursor-pointer font-bold text-center" shadow="hover" @click="router.push('/mint')">
            + Mint Another One
        </el-card>
    </div>
</template>

<script setup lang="ts">
import CharacterCard from '@/components/Characters.vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/common/store';
import { ref } from 'vue';
import type { Profile } from 'unidata.js';

const router = useRouter();
const store = useStore();

if (store.state.settings.address) {
    if (!store.state.characters?.list.length) {
        router.push('/mint');
    }
} else {
    router.push('/');
}

const address = `${store.state.settings.address!.slice(0, 6)}...${store.state.settings.address!.slice(-4)}`;
const loading = ref(false);

const currentPage = ref(1);
const pageSize = ref(5);

const choose = async (character: Profile) => {
    loading.value = true;
    await store.dispatch('setSettings', {
        handle: character.username,
    });
    loading.value = false;
    await router.push('/home');
};

const switchAccount = async () => {
    await store.dispatch('reset');
    await router.push('/');
};

const characters = store.state.characters?.list || [];
</script>

<style>
.character {
    width: 738px;
}
</style>
