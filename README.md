# Next.js App Router Contentful Live Preview SDK Example

This is a simplified example project that demonstrates how to use the `@contentful/live-preview` SDK with a Next.js App Router application for displaying individual blog posts with live preview functionality.

## Step 1. Installation

Install the dependencies:

```bash
npm install
```

## Step 2. Environment variables

To run this project, you will need to add the following environment variables to your `.env.local` file:

In your Contentful dashboard go to **Settings > API keys** and copy the variables.

**Required:**
- `CONTENTFUL_SPACE_ID`: This is the Space ID of your Contentful space.
- `CONTENTFUL_ACCESS_TOKEN`: This is the Content Delivery API access token, which is used for fetching **published** data from your Contentful space.
- `CONTENTFUL_PREVIEW_ACCESS_TOKEN`: This is the Content Preview API access token, which is used for fetching **draft** data from your Contentful space.

**Optional (for live preview):**
- `CONTENTFUL_PREVIEW_SECRET`: This can be any value you want. It must be URL friendly as it will be sent as a query parameter to enable draft mode.

Example `.env.local`:
```
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_delivery_token_here
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_token_here
CONTENTFUL_PREVIEW_SECRET=any_url_safe_string
```

## Step 3. Setting up the content model

You need to create two content types in your Contentful space:

### Create a `post` content type

From your Contentful space, go to **Content model** and create a content type:

- Give it the **Name** `Post`, the **Api Identifier** should be `post`

Add these fields:

- `title` - **Text** field (type **short text**)
- `slug` - **Text** field. You can optionally go to the settings of this field, and under **Appearance**, select **Slug** to display it as a slug of the `title` field.
- `summary` - **Text** field (type **short text**)
- `excerpt` - **Text** field (type **short text**)
- `date` - **Date and time** field
- `author` - **Reference** field (references Author content type)

### Create an `author` content type

Create another content type:

- Give it the **Name** `Author`, the **Api Identifier** should be `author`

Add these fields:

- `name` - **Text** field (type **short text**)
- `picture` - **Media** field (type **one file**)

Save both content types and populate them with content in the **Content** tab.

## Step 4. Setting up Content preview

In order to enable the live preview feature in your local development environment, you need to set up the Content preview URL in your Contentful space.

In your Contentful space, go to **Settings > Content preview** and add a new content preview for development.
The **Name** field may be anything, like `Development preview`. Then, under **Select content types**, check **Post** and set its value to:

```
http://localhost:3000/api/enable-draft-post?secret={CONTENTFUL_PREVIEW_SECRET}&slug={entry.fields.slug}
```

To securely manage your `CONTENTFUL_PREVIEW_SECRET` token, consider storing it as a [Custom preview token](https://www.contentful.com/developers/docs/tutorials/general/content-preview/#custom-%20preview-tokens) within Contentful. Alternatively, you can directly embed the token into the URL by replacing `{CONTENTFUL_PREVIEW_SECRET}` with its actual value found in the .env.local file.

## Step 5. Running the project

To run the project, you can use:

```bash
npm run dev    # Development mode
npm run build  # Build for production
npm run start  # Run production build
```

## Step 6. Setting up ngrok for webhook development (Optional)

If you want to test Contentful webhooks locally, you'll need to expose your local development server to the internet using ngrok.

### Install ngrok

```bash
# Using Homebrew (macOS)
brew install ngrok/ngrok/ngrok

# Or download from https://ngrok.com/download
```

### Authenticate ngrok

1. Sign up for a free account at https://dashboard.ngrok.com/signup
2. Get your authtoken from https://dashboard.ngrok.com/get-started/your-authtoken
3. Configure ngrok with your token:

```bash
ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
```

### Running with ngrok

You need **two terminal windows/tabs** running simultaneously:

**Terminal 1 - Next.js App:**
```bash
npm run dev
```

**Terminal 2 - ngrok Tunnel:**
```bash
ngrok http 3000
```

### Webhook endpoint

Once both are running, ngrok will provide a public HTTPS URL like:
```
https://abc123.ngrok-free.app
```

Your webhook endpoint will be:
```
https://abc123.ngrok-free.app/api/contentful-webhook
```

### Contentful webhook configuration

In your Contentful space:
1. Go to **Settings → Webhooks → Add Webhook**
2. Set URL to: `https://YOUR_NGROK_URL.ngrok-free.app/api/contentful-webhook`
3. Choose events (e.g., `Entry.publish`, `Entry.unpublish`)
4. Save the webhook

### Optional: Webhook security

For production-like security, add to your `.env.local`:
```
CONTENTFUL_WEBHOOK_SECRET=your_webhook_secret_here
```

### Debugging webhooks

- **ngrok inspector**: Visit http://localhost:4040 to see all webhook requests in real-time
- **Server logs**: Check your Next.js terminal for webhook payload logs

## Step 7. Accessing your posts

Since this app focuses on individual post pages, you can access your posts at:

```
http://localhost:3000/post-page/{slug}
```

Replace `{slug}` with the slug of your post.

## Step 8. Testing live preview

1. Visit the preview URL with your secret:
   ```
   http://localhost:3000/api/enable-draft-post?secret=YOUR_PREVIEW_SECRET&slug=your-post-slug
   ```

2. You'll be redirected to the post page with draft mode enabled

3. Open the post in Contentful's editor and make changes - you should see them reflected in real-time

## Deploy on Vercel

To deploy your local project to Vercel, push it to GitHub/GitLab/Bitbucket and [import to Vercel](https://vercel.com/new).

**Important**: When you import your project on Vercel, make sure to click on **Environment Variables** and set them to match your `.env.local` file.
