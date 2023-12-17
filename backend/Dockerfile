# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json  ./

# Rebuild the source code only when needed
FROM base AS builder
hWORKDIR /app
COPY . .

# Install app dependencies
RUN npm install

EXPOSE 5000

CMD ["npm", "run", "server"]