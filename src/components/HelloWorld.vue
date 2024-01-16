<script setup lang="ts">
defineProps<{ msg: string }>();
</script>

<template>
    <div class="home-container">
        <h1>{{ msg }}</h1>
    </div>
</template>

<style scoped>
.home-container {
    text-align: center;
    padding: 20px;
}
</style>
