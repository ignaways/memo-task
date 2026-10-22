FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL=http://localhost:4000
ARG VITE_DEMO_EMAIL=
ARG VITE_DEMO_PASSWORD=
ENV VITE_API_URL=$VITE_API_URL \
    VITE_DEMO_EMAIL=$VITE_DEMO_EMAIL \
    VITE_DEMO_PASSWORD=$VITE_DEMO_PASSWORD

RUN npm run build

FROM nginx:1.27-alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
