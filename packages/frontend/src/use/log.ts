// @ts-ignore
// eslint-disable-next-line no-negated-condition
export const debug = import.meta.env.PROD
	? // eslint-disable-next-line @typescript-eslint/no-empty-function
		() => {}
	: console.log.bind(
			window.console,
			'%c DEBUG ',
			'background:#35495e; padding: 2px; border-radius: 2px; color: #fff'
		);
