<template>
    <el-card class="relative" :class="size === 'mini' ? ['inline-flex', 'mr-4', 'character-mini'] : []" shadow="hover">
        <div class="info flex relative content-center items-center">
            <div
                :class="size === 'mini' ? ['w-10', 'h-10', 'mr-2'] : ['w-20', 'h-20', 'mr-5']"
                v-if="character.avatars"
            >
                <img class="rounded-full" :src="character.avatars?.[0]" />
            </div>
            <div class="flex content-center flex-col">
                <div
                    class="font-bold"
                    :class="
                        size === 'small' ? ['text-xl', 'line-clamp-1'] : size === 'mini' ? [] : ['text-2xl', 'mb-1']
                    "
                >
                    {{ character.name || character.username }}
                    <span
                        class="username text-sm text-gray-500"
                        :class="
                            size === 'small'
                                ? ['text-xs', 'ml-1']
                                : size === 'mini'
                                ? ['block', 'text-xs']
                                : ['text-sm', 'ml-1']
                        "
                        v-if="character.username"
                        >@{{ character.username }}</span
                    >
                </div>
                <div
                    class="text-sm text-gray-400"
                    v-if="character.bio && size !== 'mini'"
                    :class="size === 'small' ? ['line-clamp-3'] : []"
                >
                    {{ character.bio }}
                </div>
            </div>
        </div>
    </el-card>
</template>

<script setup lang="ts">
const props = defineProps({
    character: {
        type: Object,
        required: true,
    },
    size: {
        type: String,
    },
});

// const character = ref(props.character);
</script>

<style lang="less">
.character-mini .el-card__body {
    @apply p-4;
}
</style>
