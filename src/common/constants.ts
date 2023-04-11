export const channels = {
	ON_ERROR: 'on-generic-app-error',

	AUTH: {
		STATE: 'authentication-status',
		REGISTER: 'regsiter-new-user',
		LOGIN: 'login-existing-user',
		LOGOUT: 'logout-authed-user',
	},

	XMP: {
		ONLINE: 'is-user-connected-to-xmp',
		SEND_MESSAGE: 'user-send-message',
		RECEIVE_MESSAGE: 'user-received-message',
	},

	CREATE_CHANNEL: 'create-channel',

	APP_DATA: {
		GET: 'store.get',
		SET: 'store.set',
		ON_CHANGE: 'store.changed',
	},
}
