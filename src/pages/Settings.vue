<template>
    <div class="flex w-full h-full px-8">
        <Sidebar />
        <div class="flex-1 flex flex-col">
            <h1 class="flex text-4xl font-bold my-5 py-4">Settings</h1>
            <div class="flex flex-col">
                <el-col class="flex flex-col gap-3">
                    <el-card shadow="hover" class="cursor-pointer" @click="toEditProfile">
                        <div class="flex flex-row" style="justify-content: space-between">
                            <div class="flex">Switch Profile</div>
                            <div class="flex w-4">
                                <ArrowRight />
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useStore } from '@/common/store';
import Sidebar from '@/components/Sidebar.vue';
import { ArrowRight } from '@element-plus/icons-vue';
import { disconnect } from '@/common/wallet';
import { ElMessageBox } from 'element-plus';

const router = useRouter();
const store = useStore();

const toEditProfile = () => {
    router.push('/profiles');
};
</script>

<style></style>
