
FROM node:16-alpine
WORKDIR /app
COPY ./src/. /app/
RUN npm install
RUN npm run build
EXPOSE 5000
CMD ["npm", "run", "dev"]
