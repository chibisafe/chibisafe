<script>
export default {
	async created() {
		await this.$store.dispatch('auth/logout');
		this.$router.replace('/login');
	},
};
</script>
