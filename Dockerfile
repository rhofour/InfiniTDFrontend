FROM node:erbium AS build

COPY package.json /usr/angular-workdir/
WORKDIR /usr/angular-workdir
RUN npm install
ENV NG_CLI_ANALYTICS=ci
RUN npm install -g @angular/cli

COPY ./ /usr/angular-workdir
RUN ng build --prod

FROM nginx

COPY ./nginx.conf /etc/nginx/nginx.conf
ARG nginx_port=80
RUN sed -i "s/listen 80/listen ${nginx_port}/" /etc/nginx/ngnix.conf

COPY --from=build /usr/angular-workdir/dist/InfiniTD /usr/share/nginx/html
