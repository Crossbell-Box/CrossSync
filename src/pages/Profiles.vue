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

const address = ref('...');
const profiles = ref([
    {
        username: 'unidata',
    },
    {
        username: 'diygod',
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

onMounted(async () => {
    const userAddress = await store.state.provider?.getSigner().getAddress();
    if (userAddress) {
        address.value = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
    }
});
</script>

<style>
.profile {
    width: 738px;
}
</style>
