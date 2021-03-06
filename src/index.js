require('dotenv/config')
const OBSWebSocket = require('obs-websocket-js')
const tmi = require('tmi.js')

const runModules = require('./modules')

const {
  OBS_WS_HOST,
  OBS_WS_PASSWORD,
  CHANNEL,
} = process.env

const obs = new OBSWebSocket()

const twitch = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true
  },
  // TODO: set credentials to be able to send message to chat
  // identity: {
  //   username: 'my_bot_name',
  //   password: 'oauth:my_bot_token'
  // },
  channels: [ CHANNEL ]
})

const run = async () => {
  await obs.connect({
    address: OBS_WS_HOST,
    password: OBS_WS_PASSWORD,
  })
  const getVersionResponse = await obs.send('GetVersion')

  const supportedFormats = getVersionResponse.supportedImageExportFormats.split(',')
  // TODO: move validation to each module
  // TODO: avoid using env to all configs
  // TODO: create default configs and an easy way to override it
  if (!supportedFormats.includes('jpg')) {
    throw new Error('JPG format not supported')
  }

  await twitch.connect()

  twitch.on('message', runModules({
    obs,
    twitch,
  }))
}

run()
  .catch(console.error)
