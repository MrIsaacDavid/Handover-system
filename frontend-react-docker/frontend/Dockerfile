FROM node:20-alpine
#FROM node:20-slim - more stable but heavy

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
#makes the env variable to be avaivable to vite
ARG VITE_API_BASE_URL

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm install
# Install curl (Alpine-style)
RUN apk add curl

# Copy the rest of the source code
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]