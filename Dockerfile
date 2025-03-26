# Estágio de construção
FROM node:18 AS builder
WORKDIR /app

# 1. Primeiro instalamos apenas as dependências necessárias para o build
COPY package.json package-lock.json ./
RUN npm install --include=dev

# 2. Copiar o restante dos arquivos e fazer o build
COPY . .
RUN npm run build

# Estágio de produção
FROM node:18-alpine AS runner
WORKDIR /app

# Copiar apenas o necessário para produção
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Instalar apenas dependências de produção
RUN npm prune --production

# Expor porta e comando de execução
EXPOSE 3000
CMD ["npm", "run", "preview"]