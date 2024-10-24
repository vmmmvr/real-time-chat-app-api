# Use Node.js as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the application port (match your app's port, e.g., 3000)
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:prod"]
