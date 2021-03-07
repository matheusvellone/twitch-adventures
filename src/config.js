module.exports = {
  channel: 'spykman',
  debug: true,

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
