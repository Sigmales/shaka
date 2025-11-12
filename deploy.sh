#!/bin/bash

echo "Starting SHAKA deployment..."

if [ ! -f "package.json" ]; then
  echo "Error: package.json not found"
  exit 1
fi

echo "Installing dependencies..."
npm install

echo "Building the application..."
npm run build

if [ ! -d ".git" ]; then
  echo "Initializing Git..."
  git init
  git remote add origin https://github.com/Sigmales/shaka.git
fi

echo "Pushing to GitHub..."
git add .
git commit -m "Deploy SHAKA application - $(date '+%Y-%m-%d %H:%M:%S')"
git branch -M main
git push -u origin main --force

echo "Deployment complete!"
echo "Visit your application on Vercel after connecting GitHub."

