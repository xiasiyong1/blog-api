FROM node:latest as build-stage

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build


# production stage
FROM node:latest as production-stage

COPY --from=build-stage /app/dist /app/dist
COPY --from=build-stage /app/package.json /app/package.json
COPY --from=build-stage /app/.env.production /app/.env.production

WORKDIR /app

RUN npm install

CMD ["npm", "run", "start:prod"]