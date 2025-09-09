# n8n plugin for WaliChat WhatsApp API

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![NPM Version](https://img.shields.io/npm/v/n8n-nodes-walichat.svg)](https://www.npmjs.com/package/n8n-nodes-walichat)

[WaliChat n8n plugin](https://wali.chat)

This is an [n8n](https://n8n.io) community node that integrates [WaliChat's WhatsApp API](https://app.wali.chat/docs) functionality into your n8n workflows.

Send WhatsApp messages, upload media files, validate phone numbers, manage chats, contacts, team members, departments, and more - all within your automated workflows.

[WaliChat](https://wali.chat) is a versatile WhatsApp Team Chat and API solution for business messaging to automate anything on WhatsApp.

[Check out the API documentation and examples here](https://app.wali.chat/docs)

> **Product update**: 🚀 no more need to host n8n on your own, try [WaliChat Flows today for a fully managed WhatsApp No-Code Automation Workflows](https://wali.chat/flows) ⚡✨

## 🚀 Ready to Build WhatsApp Automations?

Get started with step-by-step tutorials and real-world examples:

- **📚 [10+ Complete Tutorials](https://medium.com/search?q=%40walichat+n8n)** - Build AI agents, chatbots, and advanced automations with detailed guides
- **🎥 [Video Walkthroughs](https://www.youtube.com/@walichat/search?query=n8n)** - Watch live demos and follow along with our YouTube tutorials

**Popular automation ideas:**
- AI-powered customer support bots
- Lead qualification workflows
- Order status notifications
- Appointment booking systems
- Multi-language customer support with business-specific trained data

[Start building your first](https://wali.chat) WhatsApp automation in minutes! 💡

## Contents

- [Requirements](#requirements)
- [Installation](#installation)
  - [Community Nodes (Recommended)](#community-nodes-recommended)
  - [Manual installation](#manual-installation)
- [Setup](#setup)
- [Features](#features)
  - [Send Text Messages](#send-text-messages)
  - [Send Multimedia Messages](#send-multimedia-messages)
  - [Schedule Messages](#schedule-messages)
  - [Contacts Management](#contacts-management)
  - [Webhooks & Real-time Events](#webhooks--real-time-events)
  - [Templates & Automation](#templates--automation)
  - [Advanced Features](#advanced-features)
  - [Utility Functions](#utility-functions)
- [Configuring n8n Webhooks for External Access](#configuring-n8n-webhooks-for-external-access)
  - [Using ngrok for Public Webhook URLs](#using-ngrok-for-public-webhook-urls)

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
6. You can now use WaliChat's node in your workflows: if you can't see it, restart n8n instance

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

## Configuring n8n Webhooks for External Access

To receive events from WaliChat or other external services, you'll need to configure n8n with a publicly accessible URL. By default, n8n runs locally and generates webhook URLs using localhost, which external services cannot reach.

#### Understanding Webhook Configuration

n8n creates webhook URLs by combining the protocol, host, and port settings. When running behind a reverse proxy or needing public access, you must manually set the webhook URL.

#### Setting the Webhook URL

##### Temporary Configuration (Session Only)

###### Mac / Linux

```bash
export WEBHOOK_URL=https://your-domain.com/
n8n start
```

###### Windows (Command Prompt)

```cmd
set WEBHOOK_URL=https://your-domain.com/
n8n start
```

###### Windows (PowerShell)

```powershell
$env:WEBHOOK_URL = "https://your-domain.com/"
n8n start
```

##### Permanent Configuration

###### Mac / Linux

Add to your `~/.bashrc`, `~/.zshrc`, or appropriate shell configuration file:
```bash
echo 'export WEBHOOK_URL=https://your-domain.com/' >> ~/.bashrc
source ~/.bashrc
```

###### Windows

Set a system environment variable through:
1. Right-click on 'This PC' or 'My Computer' → Properties
2. Click 'Advanced system settings'
3. Click 'Environment Variables'
4. Add a new system variable with:
   - Name: `WEBHOOK_URL`
   - Value: `https://your-domain.com/`

#### Verifying Your Webhook Configuration

1. Start n8n after setting the webhook URL
2. Create a new workflow and add an "WaliChat" node that uses webhooks
3. The webhook URL should now show your custom domain instead of localhost
4. External services can now successfully send events to your n8n instance

> **Note**: Ensure your domain is properly set up with SSL and that your network/firewall allows incoming connections to the port your n8n instance is using.

### Using ngrok for Public Webhook URLs

If you're developing locally and need a quick way to expose your n8n instance to the internet for testing webhooks, [ngrok](https://ngrok.com) is a great solution.

#### Installing ngrok

##### Mac

```bash
# Using Homebrew
brew install ngrok
```

[Or download and install manually here](https://ngrok.com/downloads/mac-os)

##### Linux

[Follow the instructions described here](https://ngrok.com/downloads/linux?tab=install)

##### Windows

1. Download ngrok from [https://ngrok.com/download](https://ngrok.com/download)
2. Extract the zip file
3. Optionally, add the ngrok executable to your PATH or move it to a directory that's already in your PATH

[Alternatively follow the instructions here](https://ngrok.com/downloads/windows)

#### Setting Up ngrok

1. Sign up for a free account at [https://ngrok.com](https://ngrok.com)
2. Get your auth token from the ngrok dashboard
3. Configure ngrok with your auth token:
   ```bash
   ngrok authtoken YOUR_AUTH_TOKEN
   ```

#### Using ngrok with n8n

1. Start your n8n instance first:
   ```bash
   n8n start
   ```

2. In a new terminal window, start ngrok pointing to n8n's default port:
   ```bash
   ngrok http 5678
   ```

3. Ngrok will display a URL like `https://abc123.ngrok.io`

4. Set this as your n8n webhook URL in a new terminal:

   Mac/Linux:
   ```bash
   export WEBHOOK_URL=https://abc123.ngrok.io/
   n8n start
   ```

   Windows (Command Prompt):
   ```cmd
   set WEBHOOK_URL=https://abc123.ngrok.io/
   n8n start
   ```

   Windows (PowerShell):
   ```powershell
   $env:WEBHOOK_URL = "https://abc123.ngrok.io/"
   n8n start
   ```

5. You'll need to restart n8n for the webhook URL changes to take effect

#### Example Workflow

1. Start n8n on port 5678
2. Launch ngrok: `ngrok http 5678`
3. Note the ngrok URL (e.g., `https://abc123.ngrok.io`)
4. Stop n8n
5. Set the webhook URL environment variable with the ngrok URL
6. Restart n8n
7. Create a workflow with a WaliChat webhook trigger
8. The webhook URL will now use your ngrok domain and be accessible from the internet

> **Note**: Free ngrok sessions expire after a few hours and the URL changes each time you restart ngrok. For production use, consider a permanent solution like a proper domain with a reverse proxy.

## License

MIT
