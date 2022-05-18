<template>
    <div>
        <el-card class="profile-card">
            <div class="banner">
                <img :src="profile.banners?.[0]" />
            </div>
            <div class="info">
                <div class="avatar" v-if="profile.avatars"><img :src="profile.avatars?.[0]" /></div>
                <div class="text">
                    <div class="name">
                        {{ profile.name || profile.username }}
                        <span class="username" v-if="profile.username">{{ profile.username }}</span>
                    </div>
                    <div class="bio" v-if="profile.bio">{{ profile.bio }}</div>
                    <div class="websites" v-if="profile.websites">
                        <ul>
                            <li v-for="website in profile.websites" :key="website">
                                <a target="_blank" :href="website">
                                    <font-awesome-icon icon="link" />
                                    {{ website.replace(/https?:\/\//, '') }}
                                </a>
                            </li>
                            <li v-for="account in profile.connected_accounts" :key="account">
                                <a target="_blank" :href="account.url">
                                    <font-awesome-icon :icon="['fab', account.platform.toLowerCase()]" />
                                    {{ `${account.platform}: ${account.identity}` }}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
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
    margin-bottom: 20px;

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
            width: 150px;
            height: 150px;
            margin-right: 40px;

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
                margin-right: 20px;
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
