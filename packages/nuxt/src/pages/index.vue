<template>
	<h1>{{ $t('welcome') }}</h1>
</template>

<script setup lang="ts">
const { locale } = useI18n();
</script>
