FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

COPY . .

# Install TypeScript globally
RUN npm install -g ts-node typescript

# Expose port
EXPOSE 4002

# Start the service
CMD ["npm", "start"]
