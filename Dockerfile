FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install dependencies (package.json & package-lock.json)
COPY package*.json ./
RUN npm install 

# Bundle app source
COPY . .



