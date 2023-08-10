# rail-survey

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Install tailwindcss
```
vue add tailwind
```

### Install flowbite-vue
```
yarn add flowbite flowbite-vue
```
```
module.exports = {
  content: [
    'node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite/**/*.{js,jsx,ts,tsx}'
  ],
  plugins: [
      require('flowbite/plugin')
  ],
  theme: {}
}
```
### Build Docker
inobox.azurecr.io/rail-survey
inobox.azurecr.io/rail-survey-backend
```
docker images
docker image rm <docker_id>
```

current directory rail-survey
```
sudo docker build -t inobox.azurecr.io/rail-survey:dev .
```

current directory garden
```
sudo docker build -t inobox.azurecr.io/rail-survey-backend:dev .
```

next step
```
docker login inobox.azurecr.io
user: inobox
password: ve+4Txs07CLovaOTrIcTFv=z+9jla44p
sudo docker push inobox.azurecr.io/rail-survey:dev
sudo docker push inobox.azurecr.io/rail-survey-backend:dev
```