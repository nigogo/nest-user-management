# TODO Make distinction between development and production environment
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

# Start the NestJS application
CMD ["npm", "run", "start:dev"]
