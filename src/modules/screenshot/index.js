const { WebhookClient, MessageAttachment } = require('discord.js')
const { take } = require('ramda')

const {
  DISCORD_WEBHOOK,
  DELAY = 15,
  WINDOW = 10,
  TRIGGER = 5,
} = process.env

const MESSAGE_LIMIT = 5

const delaySeconds = Number(DELAY)
const windowSeconds = Number(WINDOW)
const triggerCount = Number(TRIGGER)

const [ , webhookId, webhookToken ] = DISCORD_WEBHOOK.match(/.*\/(.*)\/(.*)/)
const discord = new WebhookClient(webhookId, webhookToken)

const ocurrences = {}
let lastScreenshot = 0

const getScreenshotMessage = (users) => {
  let usersString

  if (users.length > MESSAGE_LIMIT) {
    usersString = take(MESSAGE_LIMIT, users).join(', ')
    usersString += `e mais ${users.length - MESSAGE_LIMIT}`

  } else {
    usersString = users.join(', ').replace(/, (.*?)$/, ' e $1')
  }
  const plural = users.length !== 1

  return`${usersString} ${plural ? 'tiraram' : 'tirou'} uma screenshot :camera_with_flash:`
}

const shareScreenshot = async (obs, users) => {
  try {
    const currentScene = await obs.send('GetCurrentScene')

    const response = await obs.send('TakeSourceScreenshot', {
      sourceName: currentScene.name,
      embedPictureFormat: 'jpg',
    })

    const buffer = Buffer.from(response.img.substring(22), 'base64')
    const screenshot = new MessageAttachment(buffer, 'ss.jpg')

    await discord.send(getScreenshotMessage(users), screenshot)
  } catch (error) {
    console.log({
      message: 'Error while sending screenshot',
      error,
    })
  }
}

module.exports = async (
  { obs, twitch },
  [ channel, tags, message ]
) => {
  if (message !== 'TTours') {
    return
  }

  const now = Date.now()

  if (now - lastScreenshot < 1000 * delaySeconds) {
    console.log(`Cooldown for ${tags.username}`)
    return
  }

  ocurrences[tags.username] = Date.now()

  Object.keys(ocurrences).forEach((user) => {
    const date = ocurrences[user]
    if (Date.now() - date > 1000 * windowSeconds) {
      console.log(`Expired for ${tags.username}`)
      delete ocurrences[user]
    }
  })

  const validUsers = Object.keys(ocurrences)

  if (validUsers.length >= triggerCount) {
    lastScreenshot = Date.now()
    await shareScreenshot(obs, validUsers)
    validUsers.forEach(user => delete ocurrences[user])
  }
}
