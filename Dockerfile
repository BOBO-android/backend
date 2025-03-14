# Use official Node.js image as base
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the entire project
COPY . .

# Build the NestJS application
RUN yarn build

# Expose the port your NestJS app runs on
EXPOSE 8080

# Start the application
CMD ["yarn", "start:dev"]
