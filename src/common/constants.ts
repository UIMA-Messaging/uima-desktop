export const channels = {
	AUTH: {
		STATE: 'authentication-status',
		REGISTER: 'regsiter-new-user',
		LOGIN: 'login-existing-user',
		LOGOUT: 'logout-authed-user',
	},

	ON_ERROR: "on-generic-app-error",

	SEND_MESSAGE: 'user-send-message',
	RECEIVE_MESSAGE: 'user-received-message',
	XMP_ONLINE: 'is-user-connected-to-xmp',
	XMP_ERROR: 'on-xmp-error',

	CHANNELS: 'get-chat-channels',
	CONVERSATIONS: 'get-channel-conversations',
	CREATE_CHANNEL: 'create-channel',

	CONTACT: 'user-to-contact-other-user',
	CONTACT_ERROR: 'on-contact-failor',

	APP_DATA: {
		GET: 'store.get',
		SET: 'store.set',
		ON_CHANGE: 'store.changed',
	},
}
