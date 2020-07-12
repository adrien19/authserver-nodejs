FROM node:12.18.2-stretch-slim

RUN npm install -g nodemon
RUN npm install -g sequelize-cli
RUN mkdir -p /auth/development

WORKDIR /auth/development
COPY . .
RUN npm install 
RUN ["chmod", "+x", "./scripts/wait-for-it.sh"]

# CMD ["npm", "run", "devStart"]