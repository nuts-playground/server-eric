FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

# pm2설치
RUN npm install --global pm2

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:18-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

# pm2설치
RUN npm install --global pm2

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
