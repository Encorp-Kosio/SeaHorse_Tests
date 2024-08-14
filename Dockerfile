# Use an official Node.js runtime as the base image
FROM node:18

# Install the dependencies
COPY package*.json ./
RUN npm install
COPY . .

# Expose the port your app runs on (if your app runs on port 3000, for example)
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]
