FROM node:latest
WORKDIR /app
COPY package.* /app/
RUN npm install -g @nestjs/cli
RUN npm install -g npm@latest
RUN npm install --legacy-peer-deps

# absolute path
COPY . /app/

EXPOSE 8000

CMD ["npm", "run", "start:dev"]