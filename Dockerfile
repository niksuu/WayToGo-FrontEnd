FROM nginx:latest


ENV API_URL http://localhost:8090/api
ENV SERVER_NAME localhost

ADD dist/way-to-go-front-end /usr/share/nginx/html/

ADD docker/etc/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
