<template>
    <div>
        <h1 class="text-4xl font-bold my-5">Choose Your Profile</h1>
        <p>You have 2 profiles, choose one to continue</p>
        <Profile
            class="profile mt-4 cursor-pointer mb-5"
            v-for="profile in profiles.list"
            :profile="profile"
            :key="profile.username"
            @click="choose"
        />
        <p>
            You are logged in as <b>0xC8b...8944</b>, you can also
            <el-button text bg type="primary">switch account</el-button>
        </p>
    </div>
</template>

<script setup lang="ts">
import Profile from '../components/Profiles.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const profiles = {
    total: 2,
    list: [
        {
            username: 'unidata',
        },
        {
            username: 'diygod',
        },
    ],
};

const choose = () => {
    router.push('/home');
};
</script>

<style>
.profile {
    width: 738px;
}
</style>
