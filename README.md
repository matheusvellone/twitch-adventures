twitch-adventures
-------

# Configuration
## Environment
| Name | Description |
|------|-------------|
| OBS_WS_HOST | OBS-websocket host.  |
| OBS_WS_PASSWORD | OBS-websocket password, leave it empty if you're not using password authentication |
| TWITCH_CHAT_PASSWORD | Chat password to allow script to send chat messages. Can be obtained at https://twitchapps.com/tmi/ |

## Config
| Name | Description | Type | Default Value |
|------|-------------|------|---------------|
| channel | The name of the channel to listen messages | String |  |
| debug | Enable this do debug the application | Boolean | false |

## Modules
### Screenshot
Looks for an specific message (or emote) then takea a screenshot from OBS current Scene and share it on a specific Discord channel.
