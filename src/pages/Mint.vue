<template>
    <div class="py-5">
        <h1 class="text-4xl font-bold my-5">Mint Your Crossbell Profile 👾</h1>
        <div class="mb-8">
            <span class="align-middle"
                >You are logged in as <b>{{ address }}</b>
            </span>
            <el-button class="align-middle ml-2" text bg type="primary" @click="switchAccount"
                >switch account</el-button
            >
            <p v-if="profiles.length">
                You already have {{ profiles.length }} profile{{ profiles.length > 1 ? 's' : '' }}
            </p>
            <ProfileCard
                class="mt-4 cursor-pointer mb-5"
                v-for="profile in profiles"
                :profile="profile"
                :key="profile.username"
                size="mini"
                @click="choose(profile)"
            />
        </div>
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
                <el-button type="default" :loading="isChecking" @click="check">Check Availability</el-button>
                <el-button type="primary" :loading="isChecking" @click="dialog">I've decided!</el-button>
                <el-button text bg type="default" @click="skip" v-if="profiles.length"
                    >I don't want to mint, just go to the next step</el-button
                >
            </el-form-item>
        </el-form>
        <div v-loading="ensLoading">
            <p class="mt-14">
                <b>🎉 ENS Event:</b> We've reserved your ENS name for you, only you can claim it, click to claim it for
                free!
            </p>
            <el-button
                v-if="ensList.length"
                text
                bg
                type="primary"
                class="mt-2 mb-4"
                v-for="ens in ensList"
                :key="ens"
                @click="claimENS(ens)"
                >{{ ens }}</el-button
            >
            <div v-else class="text-gray-400 text-sm leading-8 mt-2 mb-4">Sorry, we did not find your ENS name</div>
        </div>
    </div>
    <el-dialog v-model="dialogVisible" title="Tweet to continue" width="31%">
        <p class="mb-4">
            🎉 Congratulations! This handle <b>{{ ruleForm.handle }}</b> is available to mint!
        </p>
        <p class="mb-4">
            Before continue, please tell your Twitter followers you are syncing your tweets to blockchain and truly
            owning your tweet!
        </p>
        <el-button type="primary" @click="tweet">Tweet</el-button>
        <el-button type="primary" :disabled="mintDisabled" :loading="isMinting" @click="mint">Mint!</el-button>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useStore } from '@/common/store';
import ProfileCard from '@/components/Profiles.vue';

const router = useRouter();
const store = useStore();

if (!store.state.settings.address) {
    router.push('/');
}

const ensList = ref<string[]>([]);
const isChecking = ref(false);
const isMinting = ref(false);
const ensLoading = ref(true);
const dialogVisible = ref(false);
const mintDisabled = ref(true);

const validateHandle = (handle: string): boolean => {
    return /^[a-z0-9_\\-]{1,31}$/.test(handle);
};

const address = `${store.state.settings.address!.slice(0, 6)}...${store.state.settings.address!.slice(-4)}`;
const profiles = store.state.profiles?.list || [];

const switchAccount = async () => {
    await store.dispatch('reset');
    await router.push('/');
};

const skip = async () => {
    await router.push('/profiles');
};

const choose = async (profile: Profile) => {
    await store.dispatch('setSettings', {
        handle: profile.username,
    });
    await router.push('/home');
};

const ruleForm = reactive({
    handle: '',
});

const rules = reactive({
    handle: [
        {
            validator: (rule: any, value: any, callback: any) => {
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

const tweet = () => {
    const text = encodeURIComponent(
        `#OwnMyTweets I'm proudly syncing my Tweet to blockchain and truly owning my tweet!`,
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}&via=CrossSync&url=https://crosssync.app`);
    setTimeout(() => {
        mintDisabled.value = false;
    }, 3000);
};

const dialog = async () => {
    if (await check()) {
        dialogVisible.value = true;
    }
};

const mint = async () => {
    isMinting.value = true;
    await window.unidata?.profiles.set(
        {
            source: 'Crossbell Profile',
            identity: store.state.settings.address!,
            platform: 'Ethereum',
        },
        {
            username: ruleForm.handle,
        },
    );

    isMinting.value = false;
    await next();
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
            identity: store.state.settings.address!,
        })
    ).list.map((profile) => profile.username!);
    ensLoading.value = false;
};

initENS();
</script>

<style></style>
