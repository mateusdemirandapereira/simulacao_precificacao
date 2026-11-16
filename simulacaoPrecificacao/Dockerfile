FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM nginx:alpine

# Limpa a página padrão do Nginx para evitar conflitos
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos gerados no build (Garanta o /browser no final se for Angular 17+)
COPY --from=build /app/dist/simulacaoPrecificacao/browser /usr/share/nginx/html

# Copia a sua configuração de produção para o Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

