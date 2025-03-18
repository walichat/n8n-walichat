# n8n plugin for WaliChat WhatsApp API

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![NPM Version](https://img.shields.io/npm/v/n8n-nodes-walichat.svg)](https://www.npmjs.com/package/n8n-nodes-walichat)

[WaliChat n8n plugin](https://wali.chat)

This is an [n8n](https://n8n.io) community node that integrates [WaliChat's WhatsApp API](https://app.wali.chat/docs) functionality into your n8n workflows.

Send WhatsApp messages, upload media files, validate phone numbers, and more - all within your automated workflows.

[WaliChat](https://wali.chat) is a simple and versatile WhatsApp API solution for business messaging to virtually automate anything on WhatsApp.

## Requirements

- **[Node.js](https://nodejs.org):** v16 or higher
- **[n8n](https://n8n.io):** v1.70 or later
- **WaliChat account:** [sign up for free to get API access](https://wali.chat/register)
- **API Key:** [obtain your API key here](https://app.wali.chat/developers/apikeys)
- **WhatsApp number:** At least one WhatsApp number [connected to WaliChat](https://app.wali.chat/create)

## Installation

### Community Nodes (Recommended)

1. Go to **Settings** > **Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-walichat` in the "Enter npm package name" field
4. Agree to the risks of using community nodes: select "I understand the risks of installing unverified code from a public source"
5. Select **Install**
6. After installation, restart your n8n instance

### Manual installation

To get started, install the package in your n8n root directory:

```bash
# Using npm
npm install n8n-nodes-walichat

# Alternatively, for Docker-based installations
docker exec -it n8n npm install n8n-nodes-walichat
```

After installation, restart your n8n instance.

## Setup

1. Go to **Credentials**
2. Select **Add Credential** button
3. Select **WaliChat** from the "Search for app" dropdown
4. Enter your WaliChat API key in the **API Key** field
   - [Get your WaliChat API key here](https://app.wali.chat/developers/apikeys)
5. Select **Save** to store your credentials

## Features

### Send Text Messages
- Send formatted text messages to any WhatsApp user
- Support for rich text formatting (bold, italic, monospace, strikethrough)
- Add URLs with preview capability
- Include emojis and special characters
- Send to individual contacts or broadcast to multiple recipients

### Send Multimedia Messages
- Send images, videos, documents, and audio files
- Support for GIFs and stickers
- Upload files by URL or from local storage
- Add captions to media messages
- Set media message attributes (filename, mimetype, etc.)

### Schedule Messages
- Schedule messages for future delivery
- Set specific date and time for delivery
- Schedule recurring messages with external triggers
- Cancel scheduled messages before delivery

### Contacts Management
- Validate if phone numbers exist on WhatsApp
- Check contact's profile information
- Add contacts to your address book
- Create and manage contact groups

### Webhooks & Real-time Events
- Process incoming messages via webhooks
- React to message status updates (sent, delivered, read)
- Handle group events (joins, leaves, topic changes)
- Monitor connection status changes
- Receive call notifications

### Templates & Automation
- Send template messages for business accounts
- Use message variables for personalization
- Create automated reply workflows
- Set up conditional message flows based on responses

### Advanced Features
- Send interactive buttons and list messages
- Create polls and gather responses
- Send location messages
- Implement quick reply buttons
- Handle message reactions

### Utility Functions
- Download and process media from incoming messages
- Generate QR codes for WhatsApp Web login
- Monitor device battery and connection status
- Manage multiple WhatsApp accounts from a single workflow

## License

MIT
