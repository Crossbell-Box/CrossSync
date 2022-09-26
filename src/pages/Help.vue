<template>
    <h1 class="flex text-4xl font-bold my-5 py-4">Help</h1>
    <div class="flex flex-col">
        <p class="leading-7 my-3 text-gray-700">
            CrossSync is a socially-oriented web3 Dapp that runs on the Crossbell. CrossSync aims to allow a user-owned
            flow of social information, including but not limited to: following other user characters, integrated
            Twitter UI, note-posting, achievement badges, and more.
        </p>
        <p class="leading-7 my-3 text-gray-700">
            Crossbell allows users the ability to take back their data ownership; CrossSync makes owning your data a fun
            and engaging social experience.
        </p>
        <p class="leading-7 my-3 text-gray-700">
            To get started, you’ll need go to
            <a class="underline" href="https://faucet.crossbell.io">faucet.crossbell.io</a> and get some $CSB. After
            you’ve connected your wallet and received the $CSB, you’ll be able to mint a character on CrossSync.
        </p>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useStore } from '@/common/store';

const router = useRouter();
const store = useStore();

if (store.state.settings.address) {
    if (!store.state.characters?.list.length) {
        router.push('/mint');
    } else if (!store.state.settings.handle) {
        router.push('/characters');
    }
} else {
    router.push('/');
}
</script>

<style></style>
