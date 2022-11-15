FROM node:13.10.1
RUN mkdir /app
WORKDIR /app
RUN mkdir /log
COPY package*.json /app/
RUN npm install
ENV NODE_ENV=production
COPY . /app/
# HEALTHCHECK --interval=5s --timeout=3s --start-period=65s --retries=3 \ 
#   CMD curl -fs http://localhost:8080/ || exit 1
CMD ["node", "index.js"]