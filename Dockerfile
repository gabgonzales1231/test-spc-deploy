# Use the official Bun image
FROM oven/bun:1 as base

# Set working directory
WORKDIR /app

# Copy package files first (for caching dependencies)
COPY package.json bun.lockb* ./

# Install dependencies with Bun
RUN bun install --frozen-lockfile

# Copy the rest of the project files
COPY . .

# Build the Next.js app
RUN bun run next build

# Production image
FROM oven/bun:1 as runner
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy built app and dependencies from builder
COPY --from=base /app ./

# Expose Next.js port
EXPOSE 3000

# Start Next.js with Bun
CMD ["bun", "run", "next", "start"]
