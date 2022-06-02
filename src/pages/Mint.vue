<template>
    <div class="py-5 w-full mx-16 max-w-3xl">
        <h1 class="text-4xl font-bold my-5">Mint Your Crossbell Profile 👾</h1>
        <div class="mb-8">
            <span class="align-middle"
                >You are logged in as <b>{{ address }}</b>
            </span>
            <el-button class="align-middle ml-2" text bg type="primary" @click="switchAccount"
                >switch account</el-button
            >
        </div>
        <el-form :model="ruleForm" status-icon :rules="rules" label-width="60px">
            <el-form-item label="Handle" prop="handle" class="my-8" size="large">
                <el-input
                    v-model="ruleForm.handle"
                    placeholder="Please enter the Crossbell handle you want"
                    maxlength="31"
                    show-word-limit
                />
            </el-form-item>
            <el-form-item label="Avatar" prop="avatar" class="my-8 items-center" size="large">
                <div class="flex flex-row gap-4 w-full" v-loading="isUploadingAvatar">
                    <el-upload
                        class="flex relative w-16 h-16 justify-center flex-shrink-0"
                        accept="image/*"
                        :autoUpload="false"
                        :showFileList="false"
                        @change="handleUpload"
                    >
                        <el-avatar class="absolute" :size="64" :src="avatarUri" />
                        <el-icon class="absolute m-auto" :size="16" color="white">
                            <Plus />
                        </el-icon>
                    </el-upload>
                    <el-input
                        class="flex m-auto"
                        v-model="ruleForm.avatar"
                        placeholder="Avatar URL (HTTPS or IPFS)"
                        :disabled="avatarUriLocked"
                    >
                        <template #append>
                            <el-tooltip v-if="avatarUriLocked" content="Click to Unlock" placement="top">
                                <el-button :icon="Lock" @click="unLockAvatarUri" />
                            </el-tooltip>
                            <el-tooltip v-else content="Click to Lock" placement="top">
                                <el-button :icon="Unlock" @click="enLockAvatarUri" />
                            </el-tooltip>
                        </template>
                    </el-input>
                </div>
            </el-form-item>
            <el-form-item label="Name" prop="name" class="my-8" size="large">
                <el-input v-model="ruleForm.name" placeholder="Enter your name" />
            </el-form-item>
            <el-form-item label="Bio" prop="bio" class="my-8" size="large">
                <el-input v-model="ruleForm.bio" type="textarea" placeholder="Enter your bio" :rows="4" />
            </el-form-item>
        </el-form>
        <!-- <el-form :model="profileForm" status-icon :rules="profileRules" label-width="50px">
        </el-form> -->
        <el-form>
            <el-form-item>
                <el-button type="default" :loading="isChecking" @click="check">Check Availability</el-button>
                <el-button type="primary" :loading="isChecking" @click="dialog">I've decided!</el-button>
                <el-button text bg type="default" @click="skip" v-if="profiles.length">Skip</el-button>
            </el-form-item>
        </el-form>
        <div v-loading="ensLoading">
            <div v-if="ensList.length">
                <p class="mt-14">
                    <b>🎉 ENS Event:</b> We've reserved your ENS name for you, only you can claim it, click to claim it
                    for free!
                </p>
                <el-button
                    text
                    bg
                    type="primary"
                    class="mt-2 mb-4"
                    v-for="ens in ensList"
                    :key="ens"
                    @click="claimENS(ens)"
                    >{{ ens.username }}</el-button
                >
            </div>
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
import { ElMessage, UploadFile, UploadProps } from 'element-plus';
import { useRouter } from 'vue-router';
import { useStore } from '@/common/store';
import ProfileCard from '@/components/Profiles.vue';
import { Plus, Lock, Unlock } from '@element-plus/icons-vue';
import { debounce } from 'lodash-es';
import { upload } from '@/common/ipfs';

const router = useRouter();
const store = useStore();

if (!store.state.settings.address) {
    router.push('/');
}

const ensList = ref<Profile[]>([]);
const isChecking = ref(false);
const isMinting = ref(false);
const ensLoading = ref(true);
const dialogVisible = ref(false);
const mintDisabled = ref(true);
const isUploadingAvatar = ref(false);
const avatarUri = ref('');
const avatarUriLocked = ref(false);

const validateHandle = (handle: string): boolean => {
    return /^[a-z0-9_\\-]{3,31}$/.test(handle);
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
    name: '',
    avatar: '',
    bio: '',
});

const rules = reactive({
    handle: [
        {
            required: true,
            message: 'Please input handle',
            trigger: 'blur',
        },
        {
            min: 3,
            max: 31,
            message: 'Length should be 3 to 31',
            trigger: 'blur',
        },
        {
            validator: (rule: any, value: any, callback: any) => {
                if (validateHandle(value)) {
                    callback();
                } else {
                    callback(new Error());
                }
            },
            message: 'Contains illegal characters',
            trigger: 'blur',
        },
    ],
    avatar: [
        {
            validator: debounce((rule: any, value: string, callback: any) => {
                if (value.startsWith('https://') || value.startsWith('ipfs://') || value === '') {
                    setAvatarUri(value);
                    callback();
                } else {
                    avatarUri.value = '';
                    callback(new Error());
                }
            }, 500),
            trigger: 'change',
        },
    ],
});

const setAvatarUri = (uri: string) => {
    avatarUri.value = uri.replace('ipfs://', 'https://cf-ipfs.com/ipfs/');
};

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
            action: 'add',
        },
        {
            username: ruleForm.handle,
            ...(ruleForm.avatar && { avatars: [ruleForm.avatar] }),
            ...(ruleForm.name && { name: ruleForm.name }),
            ...(ruleForm.bio && { bio: ruleForm.bio }),
        },
    );

    isMinting.value = false;
    await next();
};

const claimENS = async (ens: Profile) => {
    isMinting.value = true;

    ruleForm.handle = ens.username!.replace(/\.eth$/, '');
    if (ens.avatars?.[0]) {
        ruleForm.avatar = ens.avatars[0];
        setAvatarUri(ens.avatars[0]);
        enLockAvatarUri(); // Prevent change by mistake
    }
    ruleForm.name = ens.name || ens.username!;
    ruleForm.bio = ens.bio || '';

    isMinting.value = false;
};

const next = async () => {
    await router.push('/profiles');
};

const initENS = async () => {
    try {
        ensList.value = (
            await window.unidata?.profiles.get({
                source: 'ENS',
                identity: store.state.settings.address!,
            })
        ).list;
    } catch (e) {
        // Failed to find ENS profiles.
    }
    ensLoading.value = false;
};

const handleUpload = async (file: UploadFile) => {
    // console.log(file);
    if (file.raw) {
        ElMessage.info('Start uploading avatar...');
        isUploadingAvatar.value = true;
        try {
            const ipfsUri = await upload(file.raw);
            ElMessage.success('Uploaded successfully!');
            ruleForm.avatar = ipfsUri;
            setAvatarUri(ipfsUri);
            enLockAvatarUri(); // Prevent change by mistake
        } catch (e: any) {
            ElMessage.error('Upload failed with error: ' + e.message);
        }
        isUploadingAvatar.value = false;
    }
};

const unLockAvatarUri = () => {
    avatarUriLocked.value = false;
};

const enLockAvatarUri = () => {
    avatarUriLocked.value = true;
};

initENS();
</script>

<style></style>
