
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY ./src/ ./
RUN npm run build
EXPOSE 5000
CMD ["npm", "run", "dev"]
