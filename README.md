# UIMA Desktop Application 

This is an instant messaging application whose main focus is security. The application was developed using the Electron framework and therefore can work on any linux/macOS and windows machine. 

When an account is created, it is set for the device on which it was created on and its credentials cannot be used on another device, much like Whatsapp account not being easily transferable to another device through phone numbers. 

However, an existing account on a device can be deleted and replaced with a new account, though, all data from the previous account is erased from the device. 

The functionality of this desktop app is enabled by the UIMA backend:

![Individual  UIMA C4 Model](https://github.com/UIMA-Messaging/uima-desktop/assets/56337726/7e00e514-23d2-40c4-861e-8d0b6e9c6691)

## Configuration
The project’s environment variables can be configured via a `.env` like so:
```
DEFAULT_LOCAL_DATABASE=src/main.db
IMGBB_API_KEY=IMGBB_API_KEY
IMGBB_BASE_URL=IMGBB_BASE_URL
EJABBERD_SERVICE=EJABBERD_WS_URL
GATEWAY_BASE_URL=GATEWAY_BASE_URL
```

where both `EJABBERD_SERVICE` and `GATEWAY_BASE_URL` can configure the app to run on either the production or staging environment by pre appending *staging.* or not to the URLs respectively. 

## Features
Some of the features this instant messaging application offers include but are not limited to 
- E2EE with the Signal Protocol
- Local storage encryption
- Real-time messaging
- Real-time invitation (and block) reception 
- Contact management
- Fuzzy user searching
- Cross platform communication

## UI

