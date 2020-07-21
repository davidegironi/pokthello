FROM node:12-alpine AS alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
COPY . ./
EXPOSE 1337
CMD ["npm", "start"]