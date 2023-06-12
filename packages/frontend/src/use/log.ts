const IS_PRODUCTION = false;
export const debug = IS_PRODUCTION
	? // eslint-disable-next-line @typescript-eslint/no-empty-function
	  () => {}
	: console.log.bind(
			window.console,
			'%c DEBUG ',
			'background:#35495e; padding: 2px; border-radius: 2px; color: #fff'
	  );
