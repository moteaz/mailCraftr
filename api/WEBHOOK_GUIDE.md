# Webhook System Guide

## Overview
The webhook system allows external systems to receive real-time notifications when events occur in MailCraftr.

## Available Events

### User Events
- `user.created` - Triggered when a new user is created
- `user.updated` - Triggered when a user is updated
- `user.deleted` - Triggered when a user is deleted

### Project Events
- `project.created` - Triggered when a new project is created
- `project.deleted` - Triggered when a project is deleted
- `project.user_added` - Triggered when a user is added to a project
- `project.user_removed` - Triggered when a user is removed from a project

### Category Events
- `category.created` - Triggered when a new category is created
- `category.updated` - Triggered when a category is updated
- `category.deleted` - Triggered when a category is deleted

### Template Events
- `template.created` - Triggered when a new template is created
- `template.updated` - Triggered when a template is updated
- `template.deleted` - Triggered when a template is deleted

## API Endpoints

### Create Webhook
```http
POST /webhooks
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://your-system.com/webhook",
  "events": ["user.created", "project.created"],
  "secret": "optional-secret-for-signature-verification"
}
```

### Get My Webhooks
```http
GET /webhooks/my-webhooks
Authorization: Bearer <token>
```

### Get All Webhooks (SUPERADMIN only)
```http
GET /webhooks/all
Authorization: Bearer <token>
```

### Get Webhook by ID
```http
GET /webhooks/:id
Authorization: Bearer <token>
```

### Update Webhook
```http
PATCH /webhooks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://new-url.com/webhook",
  "events": ["user.created", "user.updated"],
  "active": true
}
```

### Delete Webhook
```http
DELETE /webhooks/:id
Authorization: Bearer <token>
```

## Webhook Payload Structure

All webhook events send a POST request with the following JSON structure:

```json
{
  "event": "user.created",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "role": "USER",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

## Headers Sent

- `Content-Type: application/json`
- `X-Webhook-Event: <event-name>` - The event type
- `X-Webhook-Signature: <signature>` - HMAC SHA256 signature (if secret provided)

## Signature Verification

If you provide a secret when creating the webhook, each request will include an `X-Webhook-Signature` header.

### Verify Signature (Node.js Example)
```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return signature === expectedSignature;
}

// In your webhook handler
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const isValid = verifyWebhookSignature(req.body, signature, 'your-secret');
  
  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process webhook
  console.log('Event:', req.body.event);
  console.log('Data:', req.body.data);
  
  res.status(200).send('OK');
});
```

### Verify Signature (Python Example)
```python
import hmac
import hashlib
import json

def verify_webhook_signature(payload, signature, secret):
    expected_signature = hmac.new(
        secret.encode(),
        json.dumps(payload).encode(),
        hashlib.sha256
    ).hexdigest()
    
    return signature == expected_signature

# In your webhook handler
@app.route('/webhook', methods=['POST'])
def webhook():
    signature = request.headers.get('X-Webhook-Signature')
    payload = request.json
    
    if not verify_webhook_signature(payload, signature, 'your-secret'):
        return 'Invalid signature', 401
    
    # Process webhook
    print(f"Event: {payload['event']}")
    print(f"Data: {payload['data']}")
    
    return 'OK', 200
```

## Best Practices

1. **Always respond with 200 OK** - Respond quickly to acknowledge receipt
2. **Process asynchronously** - Queue webhook processing for later
3. **Verify signatures** - Always verify the signature if you provided a secret
4. **Handle retries** - Currently no automatic retries (can be added if needed)
5. **Use HTTPS** - Always use HTTPS URLs for security
6. **Monitor failures** - Check logs for failed webhook deliveries

## Testing Your Webhook

You can use services like:
- [webhook.site](https://webhook.site) - Get a test URL instantly
- [ngrok](https://ngrok.com) - Expose your local server
- [RequestBin](https://requestbin.com) - Inspect webhook requests

## Example: Testing with webhook.site

1. Go to https://webhook.site
2. Copy your unique URL
3. Create a webhook in MailCraftr:
```bash
curl -X POST http://localhost:3000/webhooks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://webhook.site/your-unique-id",
    "events": ["user.created", "project.created"]
  }'
```
4. Create a user or project
5. Check webhook.site to see the payload

## Troubleshooting

### Webhook not firing
- Check if webhook is active: `GET /webhooks/:id`
- Verify the event name is correct
- Check server logs for errors

### Signature verification failing
- Ensure you're using the same secret
- Verify you're hashing the raw JSON body
- Check the signature algorithm (HMAC SHA256)

### Timeout errors
- Ensure your webhook endpoint responds within 30 seconds
- Use async processing for long-running tasks
