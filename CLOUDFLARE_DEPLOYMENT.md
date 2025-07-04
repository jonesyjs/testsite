# Cloudflare Pages Deployment Guide

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Wrangler CLI**: Install globally with `npm install -g wrangler`
3. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, etc.)

## Method 1: Automatic Deployment (Recommended)

### 1. Connect Your Repository

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** > **Create a project**
3. Connect your Git repository (GitHub, GitLab, etc.)
4. Select your repository: `taxonomyapp`

### 2. Configure Build Settings

In the Cloudflare Pages build configuration:

- **Framework preset**: Next.js (Static HTML Export)
- **Build command**: `npm run build && npm run pages:build`
- **Build output directory**: `.vercel/output/static`
- **Root directory**: `/` (leave empty)
- **Node.js version**: `18.x` or `20.x`

### 3. Environment Variables

Add these environment variables in **Settings > Environment variables**:

```
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_space_id
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=your_access_token
NEXT_PUBLIC_CONTENTFUL_PREVIEW_TOKEN=your_preview_token
CONTENTFUL_PREVIEW_SECRET=your_random_secret_string
```

### 4. Deploy

1. Click **Save and Deploy**
2. Your app will be automatically deployed and available at `https://your-project.pages.dev`

## Method 2: Manual Deployment

### 1. Build for Production

```bash
npm run build
npm run pages:build
```

### 2. Deploy with Wrangler

```bash
# Login to Cloudflare
wrangler login

# Deploy to Pages
wrangler pages deploy .vercel/output/static --project-name taxonomyapp
```

## Custom Domain Setup

1. In Cloudflare Dashboard, go to **Pages** > Your Project
2. Click **Custom domains** tab
3. Add your custom domain
4. Follow the DNS setup instructions

## Environment Variables for Production

Make sure to set these in your Cloudflare Pages project:

- `NEXT_PUBLIC_CONTENTFUL_SPACE_ID`
- `NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN`
- `NEXT_PUBLIC_CONTENTFUL_PREVIEW_TOKEN`
- `CONTENTFUL_PREVIEW_SECRET`

## Preview Mode Configuration

Update your Contentful preview URL to:
```
https://your-project.pages.dev/api/preview?secret=YOUR_SECRET&slug={entry.fields.slug}
```

## Troubleshooting

### Build Issues

1. **Node.js version**: Make sure you're using Node.js 18+ in build settings
2. **Build command**: Verify the build command is `npm run build && npm run pages:build`
3. **Output directory**: Should be `.vercel/output/static`

### Runtime Issues

1. **Environment variables**: Double-check all environment variables are set
2. **API routes**: Ensure your API routes work with edge runtime
3. **Contentful connection**: Verify your Contentful tokens have correct permissions

### Common Errors

- **"Module not found"**: Run `npm install` and ensure all dependencies are in package.json
- **"Build failed"**: Check the build logs in Cloudflare Pages dashboard
- **"Preview mode not working"**: Verify your preview secret and Contentful configuration

## Development vs Production

- **Development**: `npm run dev` (local development)
- **Production Build**: `npm run build && npm run pages:build` (for deployment)
- **Local Preview**: `npm run pages:dev` (preview Cloudflare Pages locally)

## Performance Benefits

✅ **Global CDN**: Content delivered from 200+ edge locations  
✅ **Edge Runtime**: Faster cold starts and better performance  
✅ **Automatic HTTPS**: SSL certificates managed automatically  
✅ **Branch Previews**: Automatic deployments for pull requests  
✅ **Analytics**: Built-in web analytics and performance monitoring  

## Next Steps

1. Deploy your app using Method 1 (automatic deployment)
2. Set up your custom domain
3. Configure branch previews for staging
4. Enable Cloudflare Analytics
5. Test your SVG preview functionality in production 