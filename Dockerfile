FROM --platform=linux/amd64 node:20-alpine

WORKDIR /app

COPY src ./src
COPY package.json .
COPY LICENSE .
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY tsoa.json .
COPY authentication.ts .

RUN npm install
RUN npx tsoa spec-and-routes
RUN npm run build

USER node

ENTRYPOINT ["npm", "run", "start"]

EXPOSE 3000