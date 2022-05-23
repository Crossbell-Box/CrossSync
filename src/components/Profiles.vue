<template>
    <el-card class="profile-card" shadow="hover">
        <div class="info" :class="size === 'small' ? ['p-0'] : ['py-5', 'px-3']">
            <div class="avatar" v-if="profile.avatars"><img :src="profile.avatars?.[0]" /></div>
            <div class="text">
                <div class="name" :class="size === 'small' ? ['text-xl', 'line-clamp-1'] : ['text-2xl']">
                    {{ profile.name || profile.username }}
                    <span
                        class="username"
                        :class="size === 'small' ? ['text-xs'] : ['text-sm']"
                        v-if="profile.username"
                        >{{ profile.username }}</span
                    >
                </div>
                <div class="bio" v-if="profile.bio" :class="size === 'small' ? ['line-clamp-3'] : []">
                    {{ profile.bio }}
                </div>
            </div>
        </div>
    </el-card>
</template>

<script setup lang="ts">
const props = defineProps({
    profile: {
        type: Object,
        required: true,
    },
    size: {
        type: String,
    },
});

// const profile = ref(props.profile);
</script>

<style lang="less" scoped>
.profile-card {
    position: relative;

    .info {
        display: flex;
        z-index: 2;
        position: relative;
        background: rgba(255, 255, 255, 0.7);
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(5px);
        border-radius: 35px;

        .avatar {
            width: 100px;
            height: 100px;
            margin-right: 20px;

            img {
                width: 100%;
                border-radius: 50%;
            }
        }

        .text {
            flex: 1;
            display: flex;
            justify-content: center;
            flex-direction: column;

            .name {
                font-weight: bold;
                margin-bottom: 5px;

                .username {
                    font-size: 14px;
                    color: #999;
                    margin-left: 10px;

                    &:before {
                        content: '@';
                    }
                }
            }

            .bio {
                font-size: 14px;
                color: #999;
            }
        }
    }
}
</style>
