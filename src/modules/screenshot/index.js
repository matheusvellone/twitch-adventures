const { WebhookClient, MessageAttachment } = require('discord.js')
const { take } = require('ramda')

const logger = require('../../logger')('SCREENSHOT')

const {
  active,
  trigger,
  cooldown,
  window,
  amountToTrigger,
  maxUsernames,
  fileFormat,
} = require('../../config').modules.screenshot

const {
  SCREENSHOT_DISCORD_WEBHOOK,
} = process.env

const [, webhookId, webhookToken] = SCREENSHOT_DISCORD_WEBHOOK.match(/.*\/(.*)\/(.*)/)
const discord = new WebhookClient(webhookId, webhookToken)

const ocurrences = {}
let lastScreenshot = 0

const getScreenshotMessage = (users) => {
  let usersString

  if (users.length > maxUsernames) {
    usersString = take(maxUsernames, users).join(', ')
    usersString += `e mais ${users.length - maxUsernames}`
  } else {
    usersString = users.join(', ').replace(/, (.*?)$/, ' e $1')
  }
  const plural = users.length !== 1

  return `${usersString} ${plural ? 'tiraram' : 'tirou'} uma screenshot :camera_with_flash:`
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
    logger.error('Error while sending screenshot', error)
  }
}

module.exports.run = async (
  { obs },
  [, tags, message],
) => {
  if (message !== trigger) {
    return
  }

  const now = Date.now()

  if (now - lastScreenshot < 1000 * cooldown) {
    logger.debug(`Cooldown for ${tags.username}`)
    return
  }

  logger.debug(`${tags.username} message saved`)
  ocurrences[tags.username] = Date.now()

  Object.keys(ocurrences).forEach((user) => {
    const date = ocurrences[user]
    if (Date.now() - date > 1000 * window) {
      logger.debug(`Expired for ${tags.username}`)
      delete ocurrences[user]
    }
  })

  const validUsers = Object.keys(ocurrences)

  if (validUsers.length >= amountToTrigger) {
    lastScreenshot = Date.now()
    await shareScreenshot(obs, validUsers)
    validUsers.forEach((user) => delete ocurrences[user])
  }
}

module.exports.active = active

module.exports.validate = async ({ obs }) => {
  const { supportedImageExportFormats } = await obs.send('GetVersion')

  const supportedFormats = supportedImageExportFormats.split(',')

  if (!supportedFormats.includes(fileFormat)) {
    throw new Error(`${fileFormat} format not supported. Supported fileFormats are: ${supportedFormats}`)
  }
}
