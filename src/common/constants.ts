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

	CONTACTS: {
		GET: 'contacts.get',
		GET_ALL: 'contacts.get.all',
		CREATE: 'contacts.create',
		UPDATE: 'contacts.update',
		DELETE: 'contacts.delete',
		ON_CHANGE: 'contacts.updated',
		ON_DELETE: 'contacts.deleted',
		ON_CREATE: 'contacts.created',
	},
}
