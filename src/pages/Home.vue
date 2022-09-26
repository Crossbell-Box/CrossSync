<template>
    <ul v-infinite-scroll="load" class="infinite-list flex-1" style="overflow: auto">
        <li class="flex text-4xl font-bold my-5 py-4">Home</li>
        <li v-for="note in notes" :key="note.id">
            <Note :note="note" :character="character" />
        </li>
        <li v-for="(_, index) in Array(5)" :key="index" v-show="loading">
            <el-skeleton animated>
                <template #template>
                    <el-card class="relative border-0" shadow="never">
                        <div class="flex flex-row">
                            <el-skeleton-item variant="circle" class="w-10 h-10 mr-3"></el-skeleton-item>
                            <div class="flex-1">
                                <el-skeleton-item variant="p" class="w-64"></el-skeleton-item>
                                <el-skeleton-item variant="p" class="h-9 w-96"></el-skeleton-item>
                            </div>
                        </div>
                    </el-card>
                </template>
            </el-skeleton>
        </li>
        <li v-if="!haveMore && notes.length === 0">
            <p class="text-center text-gray-500">
                <span class="align-middle">No notes yet... Try to </span>
                <el-button class="align-middle" text bg type="primary" @click="tweet">sync a tweet</el-button>
            </p>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/common/store';
import Note from '@/components/Notes.vue';
import type { Note as TypeNote } from 'unidata.js';

const router = useRouter();
const store = useStore();

const notes = ref<TypeNote[]>([]);
const loading = ref(false);
const haveMore = ref(true);

if (store.state.settings.address) {
    if (!store.state.characters?.list.length) {
        router.push('/mint');
    } else if (!store.state.settings.handle) {
        router.push('/characters');
    }
} else {
    router.push('/');
}

let cursor: any;
const load = async () => {
    if (!loading.value && haveMore.value) {
        loading.value = true;
        const result = await window.unidata.notes.get({
            identity: store.state.settings.handle!,
            platform: 'Crossbell',
            source: 'Crossbell Note',
            ...(store.state.settings.notesShowCSSCOnly && {
                filter: {
                    applications: ['CrossSync'],
                },
            }),
            ...(cursor && { cursor }),
        });
        if (result?.list && result.list.length > 0) {
            if (result?.cursor) {
                cursor = result.cursor;
            } else {
                haveMore.value = false;
            }
            notes.value = notes.value.concat(result.list);
        } else {
            haveMore.value = false;
        }
        loading.value = false;
    }
};

load();

const character =
    store.state.characters!.list.find((character) => character.username === store.state.settings.handle) ||
    store.state.characters!.list[0]; // As a fallback, use the first character

const tweet = () => {
    const text = encodeURIComponent(
        `#OwnMyTweets I'm proudly syncing my Tweet to blockchain and truly owning my tweet!`,
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`);
};
</script>

<style></style>
