require('dotenv/config')
const OBSWebSocket = require('obs-websocket-js')
const { Client } = require('tmi.js')

const getLogger = require('./logger')
const {
  channel,
  debug,
} = require('./config')
const modules = require('./modules')

const logger = getLogger('MAIN')

const {
  OBS_WS_HOST,
  OBS_WS_PASSWORD,
  TWITCH_CHAT_PASSWORD,
} = process.env

const obs = new OBSWebSocket()

const twitch = new Client({
  options: {
    debug,
  },
  connection: {
    secure: true,
    reconnect: true,
  },
  identity: {
    username: channel,
    password: TWITCH_CHAT_PASSWORD,
  },
  channels: [channel],
  logger: getLogger('TWITCH'),
})

const run = async () => {
  await obs.connect({
    address: OBS_WS_HOST,
    password: OBS_WS_PASSWORD,
  })

  await twitch.connect()

  await modules.validate({ obs })

  logger.info('Listening to modules')

  twitch.on('message', modules.run({
    obs,
    twitch,
  }))
}

run()
  .catch((error) => {
    logger.fatal('Failed to start script', error)
  })
