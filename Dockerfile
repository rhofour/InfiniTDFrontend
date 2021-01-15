FROM node:erbium AS build

COPY package.json package-lock.json /usr/angular-workdir/
WORKDIR /usr/angular-workdir
ENV NG_CLI_ANALYTICS=false
RUN npm install
RUN npm install -g @angular/cli

COPY ./ /usr/angular-workdir
RUN ng build --prod

FROM nginx

COPY ./nginx.conf /etc/nginx/nginx.conf
ARG nginx_port=80
RUN sed -i "s/listen 80/listen ${nginx_port}/" /etc/nginx/nginx.conf
ARG nginx_ssl_port=443
RUN sed -i "s/listen 443/listen ${nginx_ssl_port}/" /etc/nginx/nginx.conf
COPY --from=build /usr/angular-workdir/dist/InfiniTD /usr/share/nginx/html