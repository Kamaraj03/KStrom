FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci && npm rebuild esbuild --platform=linux-x64

COPY . .

# ✅ Ensure Vite binary has permission AFTER code is copied
RUN chmod +x node_modules/.bin/vite || true

EXPOSE 5173

CMD ["npm", "run", "dev"]

