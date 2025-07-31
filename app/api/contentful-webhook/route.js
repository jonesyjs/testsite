import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Webhook signature verification
function verifyWebhookSignature(payload, signature, secret) {
  if (!signature || !secret) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  // Compare signatures securely
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request) {
  try {
    // Get raw payload for signature verification
    const rawPayload = await request.text();
    const signature = request.headers.get('x-contentful-webhook-signature');
    
    console.log('🎣 Webhook received:', {
      timestamp: new Date().toISOString(),
      hasSignature: !!signature,
      payloadSize: rawPayload.length,
      headers: Object.fromEntries(request.headers.entries())
    });

    // Verify webhook signature if secret is configured
    const webhookSecret = process.env.CONTENTFUL_WEBHOOK_SECRET;
    
    if (webhookSecret && signature) {
      const isValid = verifyWebhookSignature(rawPayload, signature, webhookSecret);
      if (!isValid) {
        console.error('❌ Invalid webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' }, 
          { status: 401 }
        );
      }
      console.log('✅ Webhook signature verified');
    } else if (webhookSecret) {
      console.warn('⚠️  Webhook secret configured but no signature received');
    }

    // Parse the payload
    const webhook = JSON.parse(rawPayload);
    
    // Log the full payload for debugging
    console.log('📦 Webhook payload:', JSON.stringify(webhook, null, 2));

    // Handle the custom payload structure
    const webhookInfo = {
      event: webhook.webhook?.event,
      environment: webhook.webhook?.environment,
      space: webhook.webhook?.space,
      triggeredAt: webhook.webhook?.triggeredAt
    };

    const postInfo = {
      id: webhook.post?.id,
      contentType: webhook.post?.contentType,
      slug: webhook.post?.slug,
      title: webhook.post?.title,
      summary: webhook.post?.summary,
      excerpt: webhook.post?.excerpt,
      publishedAt: webhook.post?.publishedAt,
      version: webhook.post?.version
    };

    const authorInfo = {
      name: webhook.author?.name,
      id: webhook.author?.id
    };

    const statusInfo = {
      published: webhook.status?.published === 'true',
      archived: webhook.status?.archived === 'true'
    };

    console.log('🎯 Parsed custom webhook data:', {
      event: webhookInfo.event,
      post: {
        title: postInfo.title,
        slug: postInfo.slug,
        published: statusInfo.published
      },
      author: authorInfo.name
    });

    // Handle different event types
    if (postInfo.contentType === 'post') {
      console.log('📝 Post webhook received:', {
        event: webhookInfo.event,
        title: postInfo.title,
        slug: postInfo.slug,
        author: authorInfo.name,
        published: statusInfo.published,
        version: postInfo.version
      });
    }

    return NextResponse.json({ 
      status: 'success',
      timestamp: new Date().toISOString(),
      processed: {
        event: webhookInfo.event,
        postId: postInfo.id,
        slug: postInfo.slug,
        title: postInfo.title,
        published: statusInfo.published
      }
    });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Webhook processing failed',
        message: error.message,
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    endpoint: 'contentful-webhook',
    timestamp: new Date().toISOString()
  });
}