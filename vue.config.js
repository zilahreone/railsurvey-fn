const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    // name: 'Rail Survey',
    // themeColor: '#FFBF9B',
    // msTileColor: '#000000',
    // appleMobileWebAppCapable: 'no',
    // appleMobileWebAppStatusBarStyle: 'black',
    iconPaths: {
      favicon32: 'img/icons/32.png',
      favicon16: 'img/icons/16.png',
      appleTouchIcon: 'img/icons/152.png',
      maskIcon: null,
      msTileImage: 'img/icons/32.png'
    },
    manifestOptions: {
      name: 'Rail Survey',
      short_name: 'Rail Survey',
      start_url: "./",
      display: "standalone",
      theme_color: "#FFBF9B",
      icons: [
        {
          src: "./img/icons/playstore.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    // workboxPluginMode: 'GenerateSW',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // navigateFallback: 'index.html',
      // skipWaiting: true,
      swSrc: './src/service-worker.js'
    }
  }
})
