const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: 'Rail Survey',
    themeColor: '#000000',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'default',
    iconPaths: {
      favicon32: './img/icons/32.png',
      favicon16: './img/icons/16.png',
      appleTouchIcon: './img/icons/152.png',
      maskIcon: './img/icons/safari-pinned-tab.svg',
      msTileImage: './img/icons/16.png'
    },
    manifestOptions: {
      name: 'Rail Survey',
      short_name: 'Rail Survey',
      start_url: './',
      display: 'standalone',
      theme_color: '#000000',
      icons: [
        {
          src: './img/icons/16.png',
          sizes: '16x16',
          type: 'image/png'
        },
        {
          src: './img/icons/32.png',
          sizes: '32x32',
          type: 'image/png'
        },
        {
          src: './img/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: './img/icons/icon-256x256.png',
          sizes: '256x256',
          type: 'image/png'
        },
        {
          src: './img/icons/icon-384x384.png',
          sizes: '384x384',
          type: 'image/png'
        },
        {
          src: './img/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    // workboxPluginMode: 'InjectManifest',
    // workboxOptions: {
    //   swSrc: './src/sw.js'
    // }
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      navigateFallback: 'index.html',
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          urlPattern: new RegExp(`${process.env.VUE_APP_BACK_END_URL}/api`),
          handler: 'NetworkFirst',
          method: 'POST',
          options: {
            backgroundSync: {
              name: 'my-queue-asier',
              options: {
                maxRetentionTime: 60 * 60
              }
            }
          }
        },
        {
          urlPattern: new RegExp(`${process.env.VUE_APP_BACK_END_URL}/api`),
          handler: 'NetworkFirst',
          method: 'GET'
        }
      ]
    }
  }
})
