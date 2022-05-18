<template>
    <div class="welcome text-center">
        <img class="inline-block" width="150" src="../../assets/crossbell.svg" />
        <h1 class="text-4xl font-bold my-5">🎉 Welcome to CrossSync!</h1>
        <p class="my-5">Here are some introductions to CrossSync and Crossbell...</p>
        <el-button type="primary">Connect Wallet</el-button>
    </div>
</template>

<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
</script>

<style>
.welcome {
    text-align: center;
    margin-top: 60px;
}
</style>
