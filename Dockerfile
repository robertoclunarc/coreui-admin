### Stage 1: Build ###

FROM node:16 as build
WORKDIR /app
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run start

### stage 2: Run ###

FROM nginx:1.23.1-alpine as prod-stage
COPY --from=build /dist/coreui-admin /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]

