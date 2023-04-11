export const channels = {
	ON_ERROR: 'on.error',

	AUTH: {
		STATE: 'auth.state',
		REGISTER: 'auth.regsiter',
		LOGIN: 'auth.login',
		LOGOUT: 'auth.logout',
	},

	CHATTING: {
		ONLINE: 'xmp.online',
		SEND_MESSAGE: 'message.send',
		RECEIVE_MESSAGE: 'message.receive',
	},

	APP_DATA: {
		GET: 'store.get',
		SET: 'store.set',
		ON_CHANGE: 'store.changed',
	},
}
