# --- Stage 1: Build ---
    FROM node:18-alpine AS builder

    WORKDIR /app
    
    # Copy package files
    COPY package*.json ./
    
    # Cài full dependencies (gồm dev)
    RUN npm ci --legacy-peer-deps
    
    # Copy toàn bộ source code
    COPY . .
    
    # Build NestJS (compile TypeScript -> JS)
    RUN npm run build
    
    # --- Stage 2: Production runtime ---
    FROM node:18-alpine AS production
    
    WORKDIR /app
    
    # Copy package files
    COPY package*.json ./
    
    # Cài chỉ dependencies production
    RUN npm ci --omit=dev --legacy-peer-deps
    
    # Copy file build từ stage 1
    COPY --from=builder /app/dist ./dist
    
    # Expose port
    EXPOSE 4000
    
    # Start app
    CMD ["npm", "run", "start:prod"]
    