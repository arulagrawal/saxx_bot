FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install --production
RUN npx prisma generate
WORKDIR /app/prod
CMD node ./index.js
