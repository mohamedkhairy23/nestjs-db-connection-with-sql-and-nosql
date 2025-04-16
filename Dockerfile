# Use Node.js base image
FROM node:18

# Create app directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build

# Expose the NestJS port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start:prod"]
