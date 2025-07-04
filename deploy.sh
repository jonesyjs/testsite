#!/bin/bash

# Cloudflare Pages Deployment Script
echo "🚀 Starting Cloudflare Pages deployment..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI is not installed. Installing..."
    npm install -g wrangler
fi

# Build the project
echo "📦 Building project..."
npm run build && npm run pages:build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    
    # Ask if user wants to deploy
    read -p "🤔 Do you want to deploy to Cloudflare Pages? (y/n): " answer
    
    if [[ $answer == "y" || $answer == "Y" ]]; then
        echo "🌩️  Deploying to Cloudflare Pages..."
        
        # Login to Cloudflare (if not already logged in)
        wrangler whoami || wrangler login
        
        # Deploy to Pages
        wrangler pages deploy .vercel/output/static --project-name taxonomyapp
        
        if [ $? -eq 0 ]; then
            echo "🎉 Deployment successful!"
            echo "🌐 Your app is now live on Cloudflare Pages!"
        else
            echo "❌ Deployment failed. Please check the error messages above."
        fi
    else
        echo "👍 Build completed. You can deploy manually using:"
        echo "   wrangler pages deploy .vercel/output/static --project-name taxonomyapp"
    fi
else
    echo "❌ Build failed. Please fix the errors and try again."
fi 