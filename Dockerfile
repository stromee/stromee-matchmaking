FROM node:21.3.0-bookworm as build

WORKDIR /app
COPY . ./

RUN npm ci
RUN npm run build --production
ENV NODE_ENV=production

FROM nginx:1.20

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist .
COPY --from=build /app/entrypoint.sh /opt
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80/tcp

ENTRYPOINT ["bash", "/opt/entrypoint.sh"]