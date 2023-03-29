const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: 'Rail Survey',
    themeColor: '#FFBF9B',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    iconPaths: {
      favicon32: 'img/icons/32.png',
      favicon16: 'img/icons/16.png',
      appleTouchIcon: 'img/icons/152.png',
      maskIcon: null,
      msTileImage: 'img/icons/32.png'
    },
    manifestOptions: {
      icons: [
        {
          src: "./img/icons/icon-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "./img/icons/icon-256x256.png",
          sizes: "256x256",
          type: "image/png"
        },
        {
          src: "./img/icons/icon-384x384.png",
          sizes: "384x384",
          type: "image/png"
        },
        {
          src: "./img/icons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ]
    },
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      navigateFallback: 'index.html',
      skipWaiting: true
    }
    // workboxOptions: {
    //   runtimeCaching: [{
    //     urlPattern: new RegExp('https://randomuser.me/api'),
    //     handler: 'networkOnly',
    //     options: {
    //       //background sync. conf
    //       backgroundSync: {
    //         name: 'my-queue-asier',
    //         options: {
    //           maxRetentionTime: 60 * 60,
    //         }
    //       }
    //     }
    //   }]
    // }
  }
  // pwa: {
  //   name: 'Rail Survey',
  //   themeColor: '#FFBF9B',
  //   msTileColor: '#000000',
  //   appleMobileWebAppCapable: 'no',
  //   appleMobileWebAppStatusBarStyle: 'black',
  //   iconPaths: {
  //     favicon32: 'img/icons/32.png',
  //     favicon16: 'img/icons/16.png',
  //     appleTouchIcon: 'img/icons/152.png',
  //     maskIcon: null,
  //     msTileImage: 'img/icons/32.png'
  //   },
  //   manifestOptions: {
  //     name: 'Rail Survey',
  //     short_name: 'Rail Survey',
  //     start_url: "./",
  //     display: "standalone",
  //     theme_color: "#FFBF9B",
  //     icons: [
  //       {
  //         src: "./img/icons/playstore.png",
  //         sizes: "512x512",
  //         type: "image/png",
  //         purpose: "maskable",
  //       },
  //     ],
  //   },
  //   // workboxPluginMode: 'GenerateSW',
  //   workboxPluginMode: 'InjectManifest',
  //   workboxOptions: {
  //     // navigateFallback: 'index.html',
  //     // skipWaiting: true,
  //     swSrc: './src/service-worker.js'
  //   }
  // }
})
