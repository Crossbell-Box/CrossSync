<template>
    <el-card class="relative border-0 hover:bg-gray-100" shadow="never">
        <div class="flex flex-row">
            <div class="w-10 h-10 mr-3" v-if="profile.avatars?.[0]">
                <img class="rounded-full" :src="profile.avatars?.[0]" />
            </div>
            <div class="flex-1">
                <div class="mb-1">
                    <span class="font-bold align-middle">{{ profile.name || profile.username }}</span>
                    <span class="text-gray-500 ml-1 align-middle" v-if="profile.username">@{{ profile.username }}</span>
                    <span class="text-gray-500 ml-1 align-middle"
                        >· {{ moment.duration(moment().diff(note.date_created)).humanize() }} ·
                    </span>
                    <a
                        class="align-middle ml-2 text-sm"
                        target="_blank"
                        :href="url"
                        v-for="url in note.related_urls"
                        :key="url"
                    >
                        <img
                            v-if="getHost(url) === 'twitter.com'"
                            class="align-middle h-4 inline-block"
                            src="../assets/twitter.svg"
                        />
                        <img
                            v-else-if="getHost(url) === 'gateway.ipfs.io'"
                            class="align-middle h-4 inline-block"
                            src="../assets/ipfs.svg"
                        />
                        <img
                            v-else-if="getHost(url) === 'scan.crossbell.io'"
                            class="align-middle h-4 inline-block"
                            src="../assets/crossbell.svg"
                        />
                        <font-awesome-icon v-else class="align-middle inline-block" icon="link" />
                    </a>
                </div>
                <h2 class="mb-2">
                    <span class="align-middle font-bold">{{ note.title }}</span>
                </h2>
                <div
                    class="text-gray-400 leading-7"
                    v-if="note.body?.mime_type === 'text/markdown'"
                    v-html="md.render(note.body!.content!)"
                ></div>
                <div class="note-body" v-else>
                    {{ note.body?.content || note.summary?.content }}
                </div>
                <el-row :gutter="20">
                    <el-col
                        :span="6"
                        v-for="attachment in note.attachments"
                        :key="attachment.content || attachment.address"
                    >
                        <a target="_blank" :href="attachment?.address">
                            <video
                                class="my-3"
                                style="width: 100px; height: 100px"
                                :src="attachment?.address"
                                :fit="'cover'"
                                v-if="attachment.mime_type?.split('/')[0] === 'video'"
                                autoplay
                                loop
                                muted
                            />
                            <span
                                class="my-3"
                                style="width: 100px; height: 100px"
                                :src="attachment?.address"
                                :fit="'cover'"
                                v-else-if="attachment.mime_type?.split('/')[0] === 'text'"
                            ></span>
                            <el-image
                                class="my-3"
                                style="width: 100px; height: 100px"
                                :src="attachment?.address"
                                :fit="'cover'"
                                v-else
                            />
                        </a>
                    </el-col>
                </el-row>
            </div>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MarkdownIt from 'markdown-it';
import moment from 'moment';

const md = new MarkdownIt();

const props = defineProps({
    note: {
        type: Object,
        required: true,
    },
    profile: {
        type: Object,
        required: true,
    },
});

const note = props.note;
const profile = props.profile;

const getHost = (url: string) => {
    try {
        return new URL(url).hostname;
    } catch (error) {
        return null;
    }
};
</script>

<style lang="less" scoped></style>
