export const channels = {
	ON_ERROR: 'on.error',

	AUTH: {
		STATE: 'auth.state',
		REGISTER: 'auth.regsiter',
		LOGIN: 'auth.login',
		LOGOUT: 'auth.logout',
	},

	XMP: {
		ONLINE: 'xmp.online',
	},

	CHANNELS: {
		GET: 'channels.get',
		GET_ALL: 'channels.get.all',
		CREATE: 'channels.create',
		DELETE: 'channels.delete',
		ON_CHANGE: 'channels.updated',
		ON_CREATE: 'channels.created',
		ON_DELETE: 'channels.deleted',
	},

	MESSAGES: {
		GET: 'messages.get',
		SEND: 'messages.send',
		ON_SENT: 'messages.sent',
		ON_RECEIVE: 'messages.received',
	},

	APP_DATA: {
		GET: 'store.get',
		SET: 'store.set',
		ON_CHANGE: 'store.changed',
	},

	CONTACTS: {
		GET: 'contacts.get',
		GET_ALL: 'contacts.get.all',
		CREATE: 'contacts.create',
		DELETE: 'contacts.delete',
		ON_CHANGE: 'contacts.updated',
		ON_DELETE: 'contacts.deleted',
		ON_CREATE: 'contacts.created',
	},
}
