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
                <el-button type="secondary" @click="check">Check Availability</el-button>
                <el-button type="primary" @click="mint">Mint!</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';

const handle = ref('');

const validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('Please input the password'));
    } else {
        callback();
    }
};

const ruleForm = reactive({
    handle: '',
});

const rules = reactive({
    handle: [
        {
            validator: (rule: any, value: any, callback: any) => {
                console.log(value);
                if (/^[a-z0-9_\\-]{1,31}$/.test(value)) {
                    callback();
                } else {
                    callback(new Error());
                }
            },
            trigger: 'change',
        },
    ],
});

const check = () => {
    ElMessage({
        message: 'To be continued...',
        type: 'warning',
    });
};

const mint = () => {};
</script>

<style></style>
