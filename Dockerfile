FROM node:18-alpine 

WORKDIR /app

COPY . .

# COPY package.json ./
# COPY package-lock.json ./
RUN npm install 

CMD ["npm", "run", "dev"]

EXPOSE 3000