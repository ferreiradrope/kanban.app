# Estágio de construção
FROM node:18-alpine AS builder
WORKDIR /app

# Cache de dependências
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copiar e construir o projeto
COPY . .
RUN npm run build

# Estágio de produção
FROM node:18-alpine AS runner
WORKDIR /app

# Copiar apenas o necessário
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Expor porta e comando de execução
EXPOSE 3000
CMD ["npm", "run", "preview"]