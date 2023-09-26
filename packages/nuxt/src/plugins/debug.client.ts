export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig();
	return {
		provide: {
			asdasd: config.public.productionMode
				? () => {}
				: console.log.bind(
						window.console,
						'%c DEBUG ',
						'background:#35495e; padding: 2px; border-radius: 2px; color: #fff'
				  )
		}
	};
});
