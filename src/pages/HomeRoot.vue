<template>
    <div class="flex-1 flex flex-col">
        <ul v-infinite-scroll="load" class="infinite-list flex-1" style="overflow: auto">
            <li class="flex text-4xl font-bold my-5 py-4">Home</li>
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
            <li v-for="note in notes" :key="note.id">
                <Note :note="note" :profile="profile" />
            </li>
            <li v-if="!loading && notes.length === 0">
                <p class="text-center text-gray-500">
                    <span class="align-middle">No notes yet... Try to </span>
                    <el-button class="align-middle" text bg type="primary" @click="tweet">sync a tweet</el-button>
                </p>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/common/store';
import Note from '@/components/Notes.vue';

const router = useRouter();
const store = useStore();

const notes = ref<Note[]>([]);
const loading = ref(true);

if (store.state.settings.address) {
    if (!store.state.profiles?.list.length) {
        router.push('/mint');
    } else if (!store.state.settings.handle) {
        router.push('/profiles');
    }
} else {
    router.push('/');
}

let cursor: any;
let first = true;
const load = async () => {
    if (cursor || first) {
        first = false;
        const result = await window.unidata.notes.get({
            identity: store.state.settings.handle!,
            platform: 'Crossbell',
            source: 'Crossbell Note',
            cursor,
        });
        notes.value = notes.value.concat(result?.list || []);
        cursor = result?.cursor;
        loading.value = false;
    }
};

load();

const profile =
    store.state.profiles!.list.find((profile) => profile.username === store.state.settings.handle) ||
    store.state.profiles!.list[0]; // As a fallback, use the first profile

const tweet = () => {
    const text = encodeURIComponent(
        `#OwnMyTweets I'm proudly syncing my Tweet to blockchain and truly owning my tweet!`,
    );
    window.open(`https://twitter.com/compose/tweet`);
};
</script>

<style></style>
