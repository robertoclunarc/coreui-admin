### Stage 1: Build ###

FROM node:16 as build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build --prod

### stage 2: Run ###

FROM nginx: 1.23.1-alpine as prod-stage
COPY --from=build /dist/coreui-free-angular-admin-template-master /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]