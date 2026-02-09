# ========================================
# Stage 1: Build
# Usa latest-dev pois precisa do npm para build
# ========================================
FROM cgr.dev/chainguard/node:latest-dev AS builder

WORKDIR /app

# Copia arquivos de dependências
COPY --chown=node:node package*.json ./

# Instala todas as dependências (necessário para build)
RUN npm ci --no-audit --no-fund

# Copia código fonte
COPY --chown=node:node . .

# Build da aplicação NestJS
RUN npm run build:prod

# Remove devDependencies e limpa cache
RUN npm prune --production --no-audit --no-fund && \
    npm cache clean --force

# ========================================
# Stage 2: Production
# Usa latest (sem npm) - mais leve e sem vulnerabilidades
# ========================================
FROM cgr.dev/chainguard/node:latest AS production

WORKDIR /app

# Copia node_modules de produção, dist/ e package.json
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/package*.json ./

# Variáveis de ambiente
ENV NODE_ENV=production \
    PORT=5000

EXPOSE 5000

# Healthcheck removed temporarily to debug
# Will be added back once app is confirmed working

# Usuário non-root (já é o padrão na Chainguard)
USER node

# Inicia a aplicação (ENTRYPOINT já tem /usr/bin/node)
CMD ["dist/main"]

