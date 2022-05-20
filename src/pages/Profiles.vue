<template>
    <div>
        <h1 class="text-4xl font-bold my-5">Choose Your Profile</h1>
        <p>You have {{ profiles.length }} profiles, choose one to continue</p>
        <Profile
            class="profile mt-4 cursor-pointer mb-5"
            v-for="profile in profiles"
            :profile="profile"
            :key="profile.username"
            @click="choose"
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
import Profile from '../components/Profiles.vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/common/store';
import { onMounted, ref } from 'vue';
import { disconnect } from '@/common/wallet';

const router = useRouter();
const store = useStore();

const address = `${store.state.address!.slice(0, 6)}...${store.state.address!.slice(-4)}`;
const profiles = ref([
    {
        username: 'unidata',
    },
    {
        username: 'diygod',
    },
    {
        avatars: ['https://http.cat/204.jpg'],
        name: 'name',
        username: 'handle',
        bio:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, ' +
            'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        websites: ['unidata.app', 'example.com'],
    },
]);

const choose = async () => {
    await next();
};

const next = async () => {
    await router.push('/home');
};

const switchAccount = async () => {
    await disconnect();
    await store.dispatch('reset');
    await router.push('/');
};
</script>

<style>
.profile {
    width: 738px;
}
</style>
