FROM node:12-alpine
COPY ./ /src/
WORKDIR /src/
RUN yarn && yarn build
CMD yarn start:prod
EXPOSE 4000
