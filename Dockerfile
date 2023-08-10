FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node . .

RUN npm install
ENV VUE_APP_BACK_END_URL=https://api-dev.rail-survey.app.meca.in.th
# ENV VUE_APP_BACK_END_URL=https://api.rail-survey.app.meca.in.th
# ENV VUE_APP_BACK_END_URL=https://api.rail-survey.web.meca.in.th
ENV VUE_APP_IMAGE_DIR=uploads_file
#PRODUCTION
# ENV VUE_APP_USER_ID=ef7a6db0-905d-4323-a03b-0a3a1d47bfbc
# DEV
ENV VUE_APP_USER_ID=e74f6a1b-a339-4f04-84e9-f28604c103eb

RUN npm run build

FROM nginx:alpine

COPY --from=build /usr/src/app/dist  /usr/share/nginx/html