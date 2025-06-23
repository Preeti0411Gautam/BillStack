# Use Node.js 22 on Alpine (small image)
FROM node:22-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Expose backend port
EXPOSE 8000

# Run your app
CMD ["node", "index.js"]
