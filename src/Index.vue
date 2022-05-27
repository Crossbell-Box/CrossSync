<template>
    <Suspense>
        <Provider />
    </Suspense>
</template>

<script setup lang="ts">
import Provider from './pages/Provider.vue';
import { useStore, bucket } from '@/common/store';

const store = useStore();

bucket.valueStream.subscribe((values) => {
    if (values.syncing !== store.state.settings.syncing) {
        store.dispatch('setSettings', {
            syncing: values.syncing,
        });
    }
});
</script>

<style>
body {
    font-size: 100%;
}

html,
body,
#app {
    height: 100%;
}

#app {
    font-family: SFCompactRounded, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
