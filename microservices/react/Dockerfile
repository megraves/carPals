# Docker file for react-vite
FROM node:alpine

# Set the working directory
WORKDIR /app

# Copy the pkg.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app code
COPY . .

# Expose the port for the react-vite app to run on
EXPOSE 5173

# Command to run the react-vite app
CMD ["npm", "run", "dev"]