FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node . .

RUN npm install
# ENV VUE_APP_BACK_END_URL=https://api-dev.pilot.web.meca.in.th
ENV VUE_APP_BACK_END_URL=https://api.rail-survey.web.meca.in.th
ENV VUE_APP_IMAGE_DIR=uploads_file
RUN npm run build

FROM nginx:alpine

COPY --from=build /usr/src/app/dist  /usr/share/nginx/html