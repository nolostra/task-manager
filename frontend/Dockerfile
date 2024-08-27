# Use a Node.js base image to build the frontend
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the project files
COPY . .

# Build the project
RUN npm run build

# Use Nginx to serve the built project
FROM nginx:alpine

# Copy the build output to Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
