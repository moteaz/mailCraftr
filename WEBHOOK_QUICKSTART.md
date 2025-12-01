# 🚀 Webhook System - Quick Start Guide

## Overview
Your MailCraftr application now has a complete webhook system that notifies external systems when events occur.

## 🎯 What You Can Do

### Backend (API)
✅ Automatically sends HTTP POST requests to registered webhooks when:
- Users are created/updated/deleted
- Projects are created/deleted
- Users are added/removed from projects
- Categories are created/updated/deleted
- Templates are created/updated/deleted

### Frontend (Web)
✅ Manage webhooks through a beautiful UI:
- Create webhooks with custom URLs
- Select which events to subscribe to
- Enable/disable webhooks
- Delete webhooks
- Search webhooks

## 🚀 Quick Start (5 Minutes)

### Step 1: Start Your Servers

**Backend:**
```bash
cd api
npm run dev
```

**Frontend:**
```bash
cd web
npm run dev
```

### Step 2: Get a Test Webhook URL

1. Go to https://webhook.site
2. Copy your unique URL (e.g., `https://webhook.site/abc-123`)

### Step 3: Create a Webhook

1. Login to MailCraftr: http://localhost:3000
2. Go to **Dashboard → Webhooks**
3. Click **"Create Webhook"**
4. Paste your webhook.site URL
5. Select events (e.g., `user.created`, `project.created`)
6. Click **"Create Webhook"**

### Step 4: Test It!

1. Go to **Dashboard → Users** (if SUPERADMIN)
2. Create a new user
3. Go back to webhook.site
4. See the webhook payload in real-time! 🎉

## 📋 Example Webhook Payload

```json
{
  "event": "user.created",
  "timestamp": "2024-12-01T14:38:24.000Z",
  "data": {
    "id": 5,
    "email": "test@example.com",
    "role": "USER",
    "createdAt": "2024-12-01T14:38:24.000Z"
  }
}
```

## 🔐 Security (Optional)

Add a secret when creating a webhook to verify authenticity:

1. Create webhook with a secret (e.g., `my-secret-key`)
2. Your webhook receiver gets `X-Webhook-Signature` header
3. Verify the signature using HMAC SHA256

**Node.js Example:**
```javascript
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  return signature === expected;
}
```

## 📚 Available Events

### User Events
- `user.created` - New user registered
- `user.updated` - User details changed
- `user.deleted` - User removed

### Project Events
- `project.created` - New project created
- `project.deleted` - Project removed
- `project.user_added` - User added to project
- `project.user_removed` - User removed from project

### Category Events
- `category.created` - New category created
- `category.updated` - Category details changed
- `category.deleted` - Category removed

### Template Events
- `template.created` - New template created
- `template.updated` - Template details changed
- `template.deleted` - Template removed

## 🛠️ Integration Examples

### Sync to External Database
```javascript
app.post('/webhook', async (req, res) => {
  const { event, data } = req.body;
  
  if (event === 'user.created') {
    await db.users.insert({
      id: data.id,
      email: data.email,
      role: data.role
    });
  }
  
  res.status(200).send('OK');
});
```

### Send Slack Notification
```javascript
app.post('/webhook', async (req, res) => {
  const { event, data } = req.body;
  
  if (event === 'project.created') {
    await axios.post(SLACK_WEBHOOK_URL, {
      text: `📁 New project: ${data.title}`
    });
  }
  
  res.status(200).send('OK');
});
```

### Send Email Notification
```javascript
app.post('/webhook', async (req, res) => {
  const { event, data } = req.body;
  
  if (event === 'user.created') {
    await sendEmail({
      to: 'admin@company.com',
      subject: 'New User Registered',
      body: `${data.email} just signed up!`
    });
  }
  
  res.status(200).send('OK');
});
```

## 🧪 Testing Locally

### Option 1: webhook.site (Easiest)
1. Go to https://webhook.site
2. Use the provided URL
3. See requests in real-time

### Option 2: ngrok (For Local Server)
1. Install ngrok: https://ngrok.com
2. Start your webhook receiver: `node server.js`
3. Expose it: `ngrok http 3001`
4. Use the ngrok URL in MailCraftr

### Option 3: RequestBin
1. Go to https://requestbin.com
2. Create a bin
3. Use the bin URL

## 📖 Documentation

- **Backend Guide**: `api/WEBHOOK_GUIDE.md`
- **Integration Examples**: `api/WEBHOOK_EXAMPLES.md`
- **Implementation Details**: `api/WEBHOOK_IMPLEMENTATION_SUMMARY.md`
- **Frontend Integration**: `web/WEBHOOK_INTEGRATION.md`

## 🎉 You're Done!

Your webhook system is ready to use. Start integrating with external systems:
- CRM systems
- Analytics platforms
- Notification services
- Custom applications
- Third-party tools

## 💡 Tips

1. **Always respond with 200 OK** - Acknowledge receipt quickly
2. **Process async** - Queue long-running tasks
3. **Use HTTPS** - Secure your webhook URLs
4. **Verify signatures** - Use secrets for security
5. **Monitor logs** - Check for failed deliveries

## 🆘 Troubleshooting

**Webhook not firing?**
- Check if webhook is active (Enable/Disable button)
- Verify event name is correct
- Check backend logs

**Signature verification failing?**
- Ensure same secret is used
- Verify HMAC SHA256 algorithm
- Check raw JSON body is hashed

**Timeout errors?**
- Respond within 30 seconds
- Use async processing for long tasks

## 🚀 Next Steps

1. Create your first webhook
2. Test with webhook.site
3. Build your webhook receiver
4. Integrate with your systems
5. Monitor and scale

Happy webhooking! 🎣
