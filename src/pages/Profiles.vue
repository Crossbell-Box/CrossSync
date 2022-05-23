<template>
    <Header />
    <div v-loading="loading">
        <h1 class="text-4xl font-bold my-5">Choose Your Profile</h1>
        <p>
            <span class="align-middle"
                >You are logged in as <b>{{ address }}</b>
            </span>
            <el-button class="align-middle ml-2" text bg type="primary" @click="switchAccount"
                >switch account</el-button
            >
            <span class="align-middle"> , you have {{ profiles.length }} profiles, choose one to continue</span>
        </p>
        <ProfileCard
            class="profile mt-4 cursor-pointer mb-5"
            v-for="profile in profiles"
            :profile="profile"
            :key="profile.username"
            @click="choose(profile)"
        />
    </div>
</template>

<script setup lang="ts">
import ProfileCard from '../components/Profiles.vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/common/store';
import { ref } from 'vue';
import Header from '@/components/Header.vue';

const router = useRouter();
const store = useStore();

if (store.state.settings.address) {
    if (!store.state.profiles?.list.length) {
        router.push('/mint');
    }
} else {
    router.push('/');
}

const address = `${store.state.settings.address!.slice(0, 6)}...${store.state.settings.address!.slice(-4)}`;
const loading = ref(false);

const choose = async (profile: Profile) => {
    loading.value = true;
    await store.dispatch('setSettings', {
        handle: profile.username,
    });
    loading.value = false;
    await router.push('/home');
};

const switchAccount = async () => {
    await store.dispatch('reset');
    await router.push('/');
};

const profiles = store.state.profiles?.list || [];
</script>

<style>
.profile {
    width: 738px;
}
</style>
