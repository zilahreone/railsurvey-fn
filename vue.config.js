const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: 'Rail Survey',
    // workboxPluginMode: 'GenerateSW',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // navigateFallback: 'index.html',
      // skipWaiting: true,
      swSrc: './src/service-worker.js'
    }
  }
})
