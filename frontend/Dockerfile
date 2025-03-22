# Use a Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Ensure fresh installation inside the container
RUN npm ci && npm rebuild esbuild --platform=linux-x64

# Copy the rest of the frontend code
COPY . .

# Expose port
EXPOSE 5173

# Start Vite
CMD ["npm", "run", "dev"]

