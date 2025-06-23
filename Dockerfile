# -------- Build Stage --------
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source files
COPY . .

# Build frontend and backend
RUN npm run build

# -------- Production Stage --------
FROM node:20-alpine AS production

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy build outputs
COPY --from=build /app/dist/client ./dist/client
COPY --from=build /app/dist-server ./dist-server

# Set environment if needed
ENV NODE_ENV=production

# Expose app port
EXPOSE 3000

# Run server using native ESM support
CMD ["node", "--enable-source-maps", "dist-server/index.js"]
