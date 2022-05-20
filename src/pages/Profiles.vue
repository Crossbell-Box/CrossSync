<template>
    <div v-loading="loading">
        <h1 class="text-4xl font-bold my-5">Choose Your Profile</h1>
        <p>You have {{ profiles.length }} profiles, choose one to continue</p>
        <ProfileCard
            class="profile mt-4 cursor-pointer mb-5"
            v-for="profile in profiles"
            :profile="profile"
            :key="profile.username"
            @click="choose(profile)"
        />
        <p>
            You are logged in as <b>{{ address }}</b
            >, you can also
            <el-popconfirm title="Are you sure to logout and choose another account?" @confirm="switchAccount">
                <template #reference>
                    <el-button text bg type="primary">switch account</el-button>
                </template>
            </el-popconfirm>
        </p>
    </div>
</template>

<script setup lang="ts">
import ProfileCard from '../components/Profiles.vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/common/store';
import { ref } from 'vue';
import { disconnect } from '@/common/wallet';
import { ElMessage } from 'element-plus';

const router = useRouter();
const store = useStore();

const address = `${store.state.address!.slice(0, 6)}...${store.state.address!.slice(-4)}`;
const profiles = ref<Profile[]>([]);
const loading = ref(false);

const choose = async (p: Profile) => {
    loading.value = true;
    try {
        const res = await window.unidata!.profiles.set(
            {
                source: 'Crossbell Profile',
                identity: store.state.address!,
                platform: 'Ethereum',
                action: 'update',
            },
            {
                ...p,
                username: undefined,
            },
        );
        if (res.code === 0) {
            ElMessage.success('Profile updated');
            await next();
        } else {
            ElMessage.error('Failed to update profile: ' + res.message);
        }
    } catch (e: any) {
        ElMessage.error('Failed to update profile: ' + e.message);
    }
    loading.value = false;
};

const next = async () => {
    await router.push('/home');
};

const switchAccount = async () => {
    await disconnect();
    await store.dispatch('reset');
    await router.push('/');
};

const init = async () => {
    const pProfiles = store.state.profiles?.list;
    if (pProfiles?.length) {
        profiles.value = pProfiles;
    }
};

init();
</script>

<style>
.profile {
    width: 738px;
}
</style>
