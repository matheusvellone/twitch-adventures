Screenshot Module
---

A module that will take a screenshot of the current scene in OBS and share it to a specific Discord channel. This is activated by a specific message from viewers in twitch chat

## Environment
| Name | Description |
|------|-------------|
| SCREENSHOT_DISCORD_WEBHOOK | Discord channel webhook url to send screenshots |

## Config
| Name | Description | Type | Default Value |
|------|-------------|------|---------------|
| active | Whether or not to activate the module | Boolean | false |
| trigger | The expected message that will trigger the module | String | TTours |
| cooldown | The amount of time, in seconds, the module will wait before activating again | Integer | 15 |
| window | The amount of time, in seconds, the "vote" will expire | Integer | 10 |
| amountToTrigger | The amount of messages necessary to run the module | Integer | 5 |
| maxUsernames | When sharing the screenshot to discord, how many usernames, at max, to display in the message. `0` will show all usernames, despite the count | Integer | 5 |
| fileFormat | The file format to take screenshot. Must be supported by OBS | String | png |
