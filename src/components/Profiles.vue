<template>
    <el-card class="profile-card" shadow="hover">
        <div class="banner">
            <img :src="profile.banners?.[0]" />
        </div>
        <div class="info flex flex-col gap-4">
            <div class="text flex flex-row gap-2">
                <div class="avatar flex w-16 h-16 self-center" v-if="profile.avatars">
                    <img class="flex w-full h-full" :src="profile.avatars?.[0]" />
                </div>
                <div class="name flex-grow self-center flex flex-col">
                    <span>
                        {{ profile.name || profile.username }}
                    </span>
                    <span class="username" v-if="profile.username">{{ profile.username }}</span>
                </div>
            </div>
            <div class="text">
                <div class="bio" v-if="profile.bio">{{ profile.bio }}</div>
            </div>
            <div class="websites" v-if="profile.websites?.length">
                <ul class="flex flex-row gap-4">
                    <li v-for="website in profile.websites" :key="website" class="flex">
                        <a target="_blank" :href="website">
                            <font-awesome-icon icon="link" />
                            {{ website.replace(/https?:\/\//, '') }}
                        </a>
                    </li>
                </ul>
            </div>
            <div class="accounts" v-if="profile.connected_accounts?.length">
                <ul class="flex flex-row gap-4">
                    <li v-for="account in profile.connected_accounts" :key="account">
                        <a target="_blank" :href="account.url">
                            <font-awesome-icon :icon="['fab', account.platform.toLowerCase()]" />
                            {{ `${account.platform}: ${account.identity}` }}
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { watchEffect, ref, getCurrentInstance } from 'vue';

const props = defineProps({
    profile: {
        type: Object,
        required: true,
    },
});

const profile = ref(props.profile);
</script>

<style lang="less" scoped>
.profile-card {
    position: relative;

    .banner {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
        display: flex;
        align-items: center;
    }

    .info {
        display: flex;
        z-index: 2;
        position: relative;
        background: rgba(255, 255, 255, 0.7);
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(5px);
        border-radius: 35px;
        padding: 20px 10px;

        .avatar {
            //width: 150px;
            //height: 150px;
            margin-right: 40px;

            img {
                width: 100%;
                border-radius: 50%;
            }
        }

        .text {
            //flex: 1;
            //display: flex;
            //justify-content: center;
            //flex-direction: column;

            .name {
                font-weight: bold;
                font-size: 28px;
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

        .websites {
            margin-top: 10px;

            .svg-inline--fa {
                width: 14px;
                height: 14px;
            }

            ul {
                padding: 0;
                list-style: none;
                margin: 0 0 -7px 0;
            }

            li {
                display: inline-block;
                //margin-right: 20px;
                background: rgba(200, 200, 200, 0.5);
                padding: 5px 10px;
                line-height: 16px;
                font-size: 14px;
                line-height: 14px;
                border-radius: 14px;
                margin-bottom: 7px;

                a {
                    color: #333;
                    text-decoration: none;
                }
            }
        }
    }
}
</style>
