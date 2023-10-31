### Stage 1: Build ###

FROM node:16 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build --prod

### stage 2: Run ###

FROM nginx:1.17.1-alpine AS prod-stage
COPY --from=build /app/dist/coreui-admin /usr/share/nginx/html
EXPOSE 4200
CMD ["nginx","-g","daemon off;"]