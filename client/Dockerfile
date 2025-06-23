# Stage 1: Build the Vite app
FROM node:22-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Vite's preview
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev
EXPOSE 4173
CMD ["npx", "vite", "preview", "--port", "4173", "--host"]
