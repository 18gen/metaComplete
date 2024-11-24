# Use the official Node.js image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application's port (if your app uses one)
EXPOSE 8080

# Define the default command to run the app
CMD ["node", "index.js"]
