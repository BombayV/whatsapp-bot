FROM node:22.0.0-alpine
WORKDIR /app
COPY package*.json ./
COPY src ./src
# Install puppeteer so that it can be used in the container
RUN apk add chromium
RUN npm install
CMD ["npm", "start"]