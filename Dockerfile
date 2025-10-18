# Use the official Cypress image
FROM cypress/included:13.6.0

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Create results directory
RUN mkdir -p cypress/results

# Set environment variables
ENV CYPRESS_CACHE_FOLDER=/tmp/cypress_cache

# Default command
CMD ["npm", "run", "cypress:run"]
