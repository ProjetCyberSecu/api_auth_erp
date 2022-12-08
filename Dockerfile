FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./

RUN npm install
COPY . ./
RUN npm run build

FROM node:18-alpine AS server


WORKDIR /app
COPY --from=build ./app/dist ./dist
COPY package*.json ./
RUN npm install --production

EXPOSE 8080

CMD ["npm", "start"]
