# Webhook Integration Examples

## Quick Start

### 1. Create a Webhook

First, login and get your JWT token:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "motez@gmail.com",
    "password": "your-password"
  }'
```

Create a webhook subscription:
```bash
curl -X POST http://localhost:3000/webhooks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://webhook.site/your-unique-id",
    "events": ["user.created", "project.created", "template.created"],
    "secret": "my-secret-key"
  }'
```

### 2. Test with webhook.site

1. Visit https://webhook.site
2. Copy your unique URL
3. Create a webhook with that URL
4. Perform actions (create user, project, etc.)
5. See real-time webhook deliveries on webhook.site

## Example Webhook Receiver (Node.js/Express)

```javascript
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const WEBHOOK_SECRET = 'my-secret-key';

function verifySignature(payload, signature) {
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');
  return signature === expectedSignature;
}

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const event = req.headers['x-webhook-event'];
  
  // Verify signature
  if (!verifySignature(req.body, signature)) {
    console.error('Invalid signature');
    return res.status(401).send('Unauthorized');
  }
  
  // Process event
  console.log(`Received event: ${event}`);
  console.log('Payload:', JSON.stringify(req.body, null, 2));
  
  // Handle different events
  switch (req.body.event) {
    case 'user.created':
      console.log(`New user created: ${req.body.data.email}`);
      // Add to your CRM, send welcome email, etc.
      break;
      
    case 'project.created':
      console.log(`New project: ${req.body.data.title}`);
      // Sync to your system, create resources, etc.
      break;
      
    case 'template.created':
      console.log(`New template: ${req.body.data.name}`);
      // Index in search, backup, etc.
      break;
      
    default:
      console.log('Unhandled event type');
  }
  
  // Always respond quickly
  res.status(200).send('OK');
});

app.listen(3001, () => {
  console.log('Webhook receiver running on port 3001');
});
```

## Example Webhook Receiver (Python/Flask)

```python
from flask import Flask, request, jsonify
import hmac
import hashlib
import json

app = Flask(__name__)
WEBHOOK_SECRET = 'my-secret-key'

def verify_signature(payload, signature):
    expected_signature = hmac.new(
        WEBHOOK_SECRET.encode(),
        json.dumps(payload, separators=(',', ':')).encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected_signature)

@app.route('/webhook', methods=['POST'])
def webhook():
    signature = request.headers.get('X-Webhook-Signature')
    event = request.headers.get('X-Webhook-Event')
    payload = request.json
    
    # Verify signature
    if not verify_signature(payload, signature):
        return jsonify({'error': 'Invalid signature'}), 401
    
    # Process event
    print(f"Received event: {event}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    # Handle different events
    event_type = payload.get('event')
    data = payload.get('data')
    
    if event_type == 'user.created':
        print(f"New user created: {data.get('email')}")
        # Add to your CRM, send welcome email, etc.
        
    elif event_type == 'project.created':
        print(f"New project: {data.get('title')}")
        # Sync to your system, create resources, etc.
        
    elif event_type == 'template.created':
        print(f"New template: {data.get('name')}")
        # Index in search, backup, etc.
    
    return jsonify({'status': 'success'}), 200

if __name__ == '__main__':
    app.run(port=3001)
```

## Example: Sync to External Database

```javascript
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: 'postgresql://user:pass@localhost/mydb'
});

app.post('/webhook', async (req, res) => {
  const { event, data } = req.body;
  
  try {
    switch (event) {
      case 'user.created':
        await pool.query(
          'INSERT INTO users (id, email, role, created_at) VALUES ($1, $2, $3, $4)',
          [data.id, data.email, data.role, data.createdAt]
        );
        console.log('User synced to database');
        break;
        
      case 'project.created':
        await pool.query(
          'INSERT INTO projects (id, title, description, owner_id) VALUES ($1, $2, $3, $4)',
          [data.id, data.title, data.description, data.ownerId]
        );
        console.log('Project synced to database');
        break;
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).send('Error');
  }
});

app.listen(3001);
```

## Example: Send Slack Notification

```javascript
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL';

app.post('/webhook', async (req, res) => {
  const { event, data } = req.body;
  
  let message = '';
  
  switch (event) {
    case 'user.created':
      message = `🎉 New user registered: ${data.email}`;
      break;
    case 'project.created':
      message = `📁 New project created: ${data.title}`;
      break;
    case 'template.created':
      message = `📝 New template created: ${data.name}`;
      break;
  }
  
  if (message) {
    await axios.post(SLACK_WEBHOOK_URL, {
      text: message,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: message
          }
        }
      ]
    });
  }
  
  res.status(200).send('OK');
});

app.listen(3001);
```

## Testing Locally with ngrok

1. Install ngrok: https://ngrok.com/download
2. Start your webhook receiver on port 3001
3. Expose it with ngrok:
```bash
ngrok http 3001
```
4. Use the ngrok URL in your webhook configuration:
```bash
curl -X POST http://localhost:3000/webhooks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-id.ngrok.io/webhook",
    "events": ["user.created"]
  }'
```

## Managing Webhooks

### List your webhooks
```bash
curl -X GET http://localhost:3000/webhooks/my-webhooks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update a webhook
```bash
curl -X PATCH http://localhost:3000/webhooks/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "events": ["user.created", "user.updated", "user.deleted"],
    "active": true
  }'
```

### Disable a webhook
```bash
curl -X PATCH http://localhost:3000/webhooks/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "active": false
  }'
```

### Delete a webhook
```bash
curl -X DELETE http://localhost:3000/webhooks/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```
