<template>
    <div>
        <h1 class="text-4xl font-bold my-5">Mint Your Crossbell Profile</h1>
        <p>We've reserved your ENS name for you, click to claim it for free!</p>
        <el-button text bg type="primary" class="mt-2 mb-4">diygod.eth</el-button>
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
                <el-button type="primary" :loading="isMinting" :disabled="!mintable" @click="mint">Mint!</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useStore } from '@/common/store';

const router = useRouter();
const store = useStore();

const mintable = ref(false);
const isChecking = ref(false);
const isMinting = ref(false);

const validateHandle = (handle: string): boolean => {
    return /^[a-z0-9_\\-]{1,31}$/.test(handle);
};

const ruleForm = reactive({
    handle: '',
});

const rules = reactive({
    handle: [
        {
            validator: (rule: any, value: any, callback: any) => {
                console.log(value);
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
    const state = store.state;
    const contract = state.crossbell.contract;
    if (contract) {
        // Check if handle is available
        const profile = (await contract.getProfileByHandle(ruleForm.handle)).data;
        if (parseInt(profile.profileId, 10) !== 0) {
            // Invalid handle
            ElMessage.error('Oops, this handle has already been taken...');
        } else {
            // Valid handle
            ElMessage.success('This handle is available!');
            mintable.value = true;
        }
    }
    isChecking.value = false;
};

const mint = async () => {
    isMinting.value = true;
    const state = store.state;
    const contract = state.crossbell.contract;
    const userAddress = await store.state.provider?.getSigner().getAddress();
    if (contract && userAddress) {
        // todo: select user profile
        try {
            await contract.createProfile(userAddress, ruleForm.handle, '');
            await next();
        } catch (e) {
            console.log(e);
        }
    }
    isMinting.value = false;
};

const next = async () => {
    await router.push('/profiles');
};
</script>

<style></style>
