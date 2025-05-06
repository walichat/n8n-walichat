import {
  IHookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookFunctions,
  IWebhookResponseData,
  ILoadOptionsFunctions,
} from 'n8n-workflow';
import { IDataObject } from 'n8n-workflow';
import axios from 'axios';

export class WaliChatTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'WaliChat Trigger',
    name: 'walichatTrigger',
    icon: 'file:icon.png',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["event"]}}',
    description: 'Starts the workflow when WaliChat events occur',
    defaults: {
      name: 'WaliChat Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'walichatApiKey',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      {
        displayName: 'Webhook name',
        name: 'webhookName',
        type: 'string',
        default: 'n8n events',
        required: true,
        description: 'Webhook internal name for your reference (max 30 characters)',
        typeOptions: {
          maxLength: 30,
        },
      },
      {
        displayName: 'WhatsApp number',
        name: 'device',
        type: 'options',
        default: '',
        required: false,
        description: 'Restrict webhook events to a specific WhatsApp number (optional)',
        typeOptions: {
          loadOptionsMethod: 'getDevices',
        },
      },
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        default: [],
        required: true,
        description: 'The events to subscribe to',
        options: [
          { name: 'New Inbound Message Received', value: 'message:in:new' },
          { name: 'New Outbound Message Delivered', value: 'message:out:new' },
          { name: 'Message Read or Played by User', value: 'message:out:ack' },
          { name: 'Message Delivery Failed', value: 'message:out:failed' },
          { name: 'Group Updated', value: 'group:update' },
          { name: 'Message Updated (Poll Votes, Meeting Events)', value: 'message:update' },
          { name: 'Message Reaction Added/Removed', value: 'message:reaction' },
          { name: 'New User Status Published', value: 'status:update' },
          { name: 'New Channel Message Received', value: 'channel:in' },
          { name: 'Chat Updated (Assigned, Resolved, etc.)', value: 'chat:update' },
          { name: 'WhatsApp Session Changes', value: 'number:session' },
          { name: 'Contact Information Updated', value: 'contact:update' },
        ],
      },
    ],
  };

  methods = {
    loadOptions: {
      async getDevices(this: ILoadOptionsFunctions) {
        const credentials = await this.getCredentials('walichatApiKey');
        const apiKey = credentials.walichatApiKey as string;

        try {
          const response = await axios.get('https://api.wali.chat/v1/devices?size=100', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
          });

          if (Array.isArray(response.data)) {
            const devices = response.data.map((device: any) => ({
              name: `${device.alias || 'Unnamed'} (${device.phone || 'No phone yet'})`,
              value: device.id,
            }));

            return [
              {
                name: 'All WhatsApp numbers in your account',
                value: '',
              },
              ...devices,
            ];
          }

          return [{ name: 'All WhatsApp numbers in your account', value: '' }];
        } catch (error: any) {
          console.error('Error loading devices:', error.message);
          return [{ name: 'All WhatsApp numbers in your account', value: '' }];
        }
      },
    },
  };

  // This method is called when the webhook is created
  async webhookCreate(this: IHookFunctions): Promise<boolean> {
    const webhookUrl = this.getNodeWebhookUrl('default');
    const webhookName = this.getNodeParameter('webhookName') as string;
    const device = this.getNodeParameter('device', '') as string;
    const events = this.getNodeParameter('events', []) as string[];

    if (!webhookUrl) {
      throw new Error('No webhook URL available for registration');
    }

    if (events.length === 0) {
      throw new Error('At least one event must be selected');
    }

    // Before registering a new webhook, delete any existing one
    const nodeData = this.getWorkflowStaticData('node');
    const webhookId = (nodeData?.webhookId as string) || '';
    if (webhookId) {
      try {
        const credentials = await this.getCredentials('walichatApiKey');
        const apiKey = credentials.walichatApiKey as string;

        await axios.delete(`https://api.wali.chat/v1/webhooks/${webhookId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
        });
      } catch (error) {
        // If the webhook doesn't exist anymore, consider the deletion successful
        if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
          // Webhook doesn't exist, which is fine
        } else {
          console.error('Error deleting existing WaliChat webhook:', error);
          // Continue anyway to create the new webhook
        }
      }
    }

    try {
      const credentials = await this.getCredentials('walichatApiKey');
      const apiKey = credentials.walichatApiKey as string;

      const requestBody: IDataObject = {
        name: `n8n: ${webhookName}`,
        url: webhookUrl,
        events,
      };

      if (device) {
        requestBody.device = device;
      }

      const response = await axios.post('https://api.wali.chat/v1/webhooks', requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (response.data && response.data.id) {
        // Store webhook ID for later use in deregistration
        const nodeData = this.getWorkflowStaticData('node');
        nodeData.webhookId = response.data.id;
        return true;
      }

      return false;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(`WaliChat webhook registration failed: ${error.response.data?.message || error.message}`);
      }
      throw error;
    }
  }
  // This method is called when the webhook is deleted
  async webhookDelete(this: IHookFunctions): Promise<boolean> {
    const nodeData = this.getWorkflowStaticData('node');
    const webhookId = (nodeData.webhookId as string) || '';
    // const webhookId = await this.getNodeParameter('webhookId', '') as string;

    if (!webhookId) {
      // No webhook was registered
      return true;
    }

    try {
      const credentials = await this.getCredentials('walichatApiKey');
      const apiKey = credentials.walichatApiKey as string;

      await axios.delete(`https://api.wali.chat/v1/webhooks/${webhookId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      return true;
    } catch (error) {
      // If the webhook doesn't exist anymore, consider the deletion successful
      if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
        return true;
      }

      if (axios.isAxiosError(error) && error.response) {
        console.error(`WaliChat webhook deletion failed: ${error.response.data?.message || error.message}`);
      } else {
        console.error('Error deleting WaliChat webhook:', error);
      }

      // Return true anyway to allow the node to be deleted
      return true;
    }
  }

  // This method is called when a webhook request is received
  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const req = this.getRequestObject();
    const body = req.body;

    // Return the data
    return {
      workflowData: [this.helpers.returnJsonArray(body)],
    };
  }
}
