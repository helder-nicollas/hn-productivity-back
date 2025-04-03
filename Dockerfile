FROM node:lts-alpine

WORKDIR /app

COPY package*.json /app
COPY . /app
COPY prisma ./prisma


RUN npm install
RUN npx prisma generate
RUN npm run build

CMD ["npm", "start"]
