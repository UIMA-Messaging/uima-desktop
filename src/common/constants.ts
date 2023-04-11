export const channels = {
	AUTH: {
		STATE: 'authentication-status',
		REGISTER: 'regsiter-new-user',
		LOGIN: 'login-existing-user',
		LOGOUT: 'logout-authed-user',
	},

	ON_ERROR: 'on-generic-app-error',

	XMP: {
		ONLINE: 'is-user-connected-to-xmp',
		SEND_MESSAGE: 'user-send-message',
		RECEIVE_MESSAGE: 'user-received-message',
	},

	CREATE_CHANNEL: 'create-channel',

	CONTACT: 'user-to-contact-other-user',

	APP_DATA: {
		GET: 'store.get',
		SET: 'store.set',
		ON_CHANGE: 'store.changed',
	},
}
