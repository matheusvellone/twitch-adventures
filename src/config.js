module.exports = {
  channel: '',
  debug: false,

  modules: {
    screenshot: {
      active: true,

      trigger: 'TTours',

      cooldown: 15,
      window: 10,
      amountToTrigger: 1,

      maxUsernames: 5,
      fileFormat: 'png',
    },
  },
}
