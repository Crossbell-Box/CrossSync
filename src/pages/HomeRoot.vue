<template>
    <div class="flex-1 flex flex-col">
        <ul v-infinite-scroll="load" class="infinite-list flex-1" style="overflow: auto">
            <h1 class="flex text-4xl font-bold my-5 py-4">Home</h1>
            <li v-for="note in notes" :key="note.id">
                <Note :note="note" :profile="profile" />
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
    }
};

const profile =
    store.state.profiles!.list.find((profile) => profile.username === store.state.settings.handle) ||
    store.state.profiles!.list[0]; // As a fallback, use the first profile
</script>

<style></style>
