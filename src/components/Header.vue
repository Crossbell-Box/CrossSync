<template>
    <div class="absolute left-8 top-8">
        <router-link to="/">
            <div class="inline-block rounded-full align-middle fill-[#5088ff] w-12 h-12">
                <span class="flex w-full h-full items-center logo" v-html="logo" />
            </div>
        </router-link>
    </div>
    <div class="absolute bottom-8 text-slate-400 text-sm -translate-x-1/2 left-1/2">
        <div>
            <el-tooltip placement="top" :content="`v${appVersion} #${commitHash}`"> CrossSync </el-tooltip>
        </div>
        <div>
            <a class="whitespace-nowrap" href="https://github.com/NaturalSelectionLabs" target="_blank">
                @ Natural Selection Labs
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import logo from '../assets/logo.svg?raw';

const appVersion = __APP_VERSION__;
const commitHash = __COMMIT_HASH__;
</script>
<style scoped></style>
