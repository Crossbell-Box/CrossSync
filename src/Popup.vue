<template>
    <Suspense>
        <PopupPage />
    </Suspense>
</template>

<script setup lang="ts">
import PopupPage from './pages/Popup.vue';
import { useStore, bucket } from '@/common/store';

const store = useStore();

bucket.valueStream.subscribe((values) => {
    if (values.syncing === undefined) {
        values.syncing = true;
    }
    if (values.syncing !== store.state.settings.syncing) {
        store.dispatch('setSettings', {
            syncing: values.syncing,
        });
    }
});
</script>
<style></style>
