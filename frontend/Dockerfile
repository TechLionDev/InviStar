FROM node:lts-alpine

WORKDIR /app

ARG NEXT_PUBLIC_POCKETBASE_URL=url
ENV NEXT_PUBLIC_POCKETBASE_URL=url

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only package files first for better layer caching
COPY package.json pnpm-lock.yaml* ./

# Clean install dependencies
RUN pnpm i --frozen-lockfile

# Copy application code after installing dependencies
COPY . .

# Clean build
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
