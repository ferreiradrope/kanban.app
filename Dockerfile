# Estágio de construção
FROM node:18 AS builder
WORKDIR /app

# Instalar todas as dependências (incluindo dev)
COPY package.json package-lock.json ./
RUN npm install

# Fazer o build
COPY . .
RUN npm run build

# Estágio de produção
FROM node:18-alpine AS runner
WORKDIR /app

# Copiar apenas o necessário
COPY --from=builder /app/package.json .
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Instalar APENAS o vite como dependência global (necessário para preview)
RUN npm install -g vite

# Expor porta e configurar comando
EXPOSE 3000
CMD ["vite", "preview", "--host", "0.0.0.0", "--port", "3000"]