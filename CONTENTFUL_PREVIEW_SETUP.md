# Contentful Live Preview Setup

## Environment Variables

Add these variables to your `.env.local` file:

```bash
# Contentful Configuration
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_space_id
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=your_access_token
NEXT_PUBLIC_CONTENTFUL_PREVIEW_TOKEN=your_preview_token

# Preview Mode Secret (generate a random string)
CONTENTFUL_PREVIEW_SECRET=your_random_secret_string
```

## Getting Your Contentful Tokens

1. **Space ID**: Found in your Contentful space settings
2. **Access Token**: Create a new Content Delivery API token in your space settings
3. **Preview Token**: Create a new Content Preview API token in your space settings

## Configuring Contentful Preview

1. In your Contentful space, go to **Settings > Content preview**
2. Add a new content preview with:
   - **Name**: Next.js App
   - **Description**: Live preview for Next.js application
   - **URL**: `http://localhost:3000/api/preview?secret=YOUR_SECRET&slug={entry.fields.slug}`
   - Replace `YOUR_SECRET` with your `CONTENTFUL_PREVIEW_SECRET` value

## How It Works

- **Live Preview**: When enabled, content updates every 2 seconds
- **Draft Content**: Shows unpublished changes from Contentful
- **Real-time Updates**: SVG changes appear immediately without manual refresh
- **Toggle**: Use the "Enable Preview" button to switch between published and draft content

## Usage

1. Make changes to your SVG content in Contentful (don't publish yet)
2. Enable preview mode using the toggle button
3. See your changes update in real-time
4. Toggle back to see the published version

## Troubleshooting

- Ensure all environment variables are set correctly
- Check that your preview token has the correct permissions
- Verify the preview URL is configured correctly in Contentful
- Make sure your content type is named `svgAsset` with a `svgCode` field 