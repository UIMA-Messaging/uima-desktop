# UIMA Desktop Application 

This is an instant messaging application whose main focus is security. The application was developed using the Electron framework and therefore can work on any linux/macOS and windows machine. 

When an account is created, it is set for the device on which it was created on and its credentials cannot be used on another device, much like Whatsapp account not being easily transferable to another device through phone numbers. 

However, an existing account on a device can be deleted and replaced with a new account, though, all data from the previous account is erased from the device. 

The functionality of this desktop app is enabled by the UIMA backend:

![Individual  UIMA C4 Model](https://github.com/UIMA-Messaging/uima-desktop/assets/56337726/7e00e514-23d2-40c4-861e-8d0b6e9c6691)

> ⚠ There is no distrubution pipeline for this project and therefore does not have a 'download' link.

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

> ⚠ Please note that the either the staging or production clusters must be running, otherwise the most of the features won't be accessible.

## Features
Some of the features this instant messaging application offers include but are not limited to 
- Account registration and deletion
- E2EE with the Signal Protocol
- Local storage encryption
- Real-time messaging
- Real-time invitation (and block) reception 
- Contact management
- Fuzzy user searching
- Cross platform communication
- Asynchronous messaging

## UI

#### Registration page 

![Screenshot 2023-06-13 at 5 19 02 pm](https://github.com/UIMA-Messaging/uima-desktop/assets/56337726/4a0338cf-f396-4b8f-802f-b32bae1f06e5)

#### Login page

![Screenshot 2023-06-13 at 5 22 52 pm](https://github.com/UIMA-Messaging/uima-desktop/assets/56337726/d6d601a7-d213-4405-9cb1-652bb1580a70)

#### Contact page

![Screenshot 2023-06-17 at 3 43 27 pm](https://github.com/UIMA-Messaging/uima-desktop/assets/56337726/6f5e6167-f139-4b08-be1e-e3e8608e69c2)

#### Search page

![Screenshot 2023-06-17 at 3 43 35 pm](https://github.com/UIMA-Messaging/uima-desktop/assets/56337726/016212ef-e57f-437f-8653-6c2ee7331ca4)

#### Chat page

![Screenshot 2023-05-21 at 3 41 08 pm](https://github.com/UIMA-Messaging/uima-desktop/assets/56337726/ed732288-3463-48e3-9c81-f425a2b1e700)

#### Settings page

![Screenshot 2023-06-17 at 3 43 38 pm](https://github.com/UIMA-Messaging/uima-desktop/assets/56337726/7cbf879d-ab6e-4907-85b5-632f87fa7821)

#### Delete page 

![Screenshot 2023-06-17 at 3 43 42 pm](https://github.com/UIMA-Messaging/uima-desktop/assets/56337726/9fdca1ae-b889-40c2-9b84-2d1f7db41e2b)
