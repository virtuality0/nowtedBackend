FROM node:22-alpine3.21 AS build
WORKDIR /app
COPY package*.json .
RUN npm install 
COPY . . 
RUN npx prisma generate
RUN npm run build 

FROM node:22-alpine3.21 AS run 
WORKDIR /app
COPY package*.json .
COPY --from=build app/dist ./dist 
COPY --from=build app/node_modules ./node_modules
CMD ["node", "dist/index.js"]