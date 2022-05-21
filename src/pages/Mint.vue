<template>
    <Header />
    <div>
        <h1 class="text-4xl font-bold my-5">Mint Your Crossbell Profile</h1>
        <p class="mb-8">
            <span class="align-middle"
                >You are logged in as <b>{{ address }}</b>
            </span>
            <el-button class="align-middle ml-2" text bg type="primary" @click="switchAccount"
                >switch account</el-button
            >
            <span class="align-middle" v-if="profiles.length">
                , you have {{ profiles.length }} profile{{ profiles.length > 1 ? 's' : '' }} ({{
                    profiles.map((profile) => '@' + profile.username).join(' ')
                }})</span
            >
        </p>
        <el-form :model="ruleForm" status-icon :rules="rules" label-width="50px">
            <el-form-item label="Handle" prop="handle" class="my-8" size="large">
                <el-input
                    v-model="ruleForm.handle"
                    placeholder="Please enter the Crossbell handle you want"
                    maxlength="31"
                    show-word-limit
                />
            </el-form-item>
            <el-form-item>
                <el-button type="secondary" :loading="isChecking" @click="check">Check Availability</el-button>
                <el-button type="primary" :loading="isMinting" @click="mint">Mint!</el-button>
                <el-button text bg type="primary" @click="skip" v-if="profiles.length">skip</el-button>
            </el-form-item>
        </el-form>
        <p class="mt-8">
            <b>🎉 ENS Events:</b> We've reserved your ENS name, only you can claim it, click to claim it for free!
        </p>
        <el-button text bg type="primary" class="mt-2 mb-4" v-for="ens in ensList" :key="ens" @click="claimENS(ens)">{{
            ens
        }}</el-button>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useStore } from '@/common/store';
import Header from '@/components/Header.vue';

const router = useRouter();
const store = useStore();

if (!store.state.address) {
    router.push('/');
}

const ensList = ref<string[]>([]);
const isChecking = ref(false);
const isMinting = ref(false);
const ensLoading = ref(true);

const validateHandle = (handle: string): boolean => {
    return /^[a-z0-9_\\-]{1,31}$/.test(handle);
};

const address = `${store.state.address!.slice(0, 6)}...${store.state.address!.slice(-4)}`;
const profiles = store.state.profiles?.list || [];

const switchAccount = async () => {
    await store.dispatch('reset');
    await router.push('/');
};

const skip = async () => {
    await router.push('/profiles');
};

const ruleForm = reactive({
    handle: '',
});

const rules = reactive({
    handle: [
        {
            validator: (rule: any, value: any, callback: any) => {
                // console.log(value);
                if (validateHandle(value)) {
                    callback();
                } else {
                    callback(new Error());
                }
            },
            trigger: 'change',
        },
    ],
});

const check = async () => {
    isChecking.value = true;

    if (!validateHandle(ruleForm.handle)) {
        ElMessage.error('Invalid handle');
        isChecking.value = false;
        return;
    }

    const profiles = await window.unidata?.profiles.get({
        source: 'Crossbell Profile',
        identity: ruleForm.handle,
        platform: 'Crossbell',
    });

    isChecking.value = false;

    if (profiles?.list.length) {
        ElMessage.error('Oops, this handle has already been taken...');
        return false;
    } else {
        ElMessage.success('This handle is available!');
        return true;
    }
};

const mint = async () => {
    if (await check()) {
        isMinting.value = true;

        await window.unidata?.profiles.set(
            {
                source: 'Crossbell Profile',
                identity: store.state.address!,
                platform: 'Ethereum',
            },
            {
                username: ruleForm.handle,
            },
        );

        isMinting.value = false;
        await next();
    }
};

const claimENS = async (ens: string) => {
    isMinting.value = true;

    ruleForm.handle = ens.replace(/\.eth$/, '');

    isMinting.value = false;
};

const next = async () => {
    await router.push('/profiles');
};

const initENS = async () => {
    ensList.value = (
        await window.unidata?.profiles.get({
            source: 'ENS',
            identity: store.state.address!,
        })
    ).list.map((profile) => profile.username!);
    ensLoading.value = false;
};

initENS();
</script>

<style></style>
