# Use Node.js as the base image (alpine version for a smaller footprint)
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install dependencies necessary for building native modules (optional, but recommended for alpine)
RUN apk add --no-cache python3 make g++ 

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (alpine requires additional flags to avoid building issues)
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the application port (match your app's port, e.g., 4000)
EXPOSE 4000

# Command to run the application
CMD ["npm", "run", "start:prod"]
