require('dotenv/config')
const OBSWebSocket = require('obs-websocket-js')
const tmi = require('tmi.js')
const logger = require('./logger')('MAIN')

const {
  channel,
} = require('./config')
const modules = require('./modules')

const {
  OBS_WS_HOST,
  OBS_WS_PASSWORD,
} = process.env

const obs = new OBSWebSocket()

const twitch = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true,
  },
  // TODO: set credentials to be able to send message to chat
  // identity: {
  //   username: 'my_bot_name',
  //   password: 'oauth:my_bot_token'
  // },
  channels: [channel],
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
