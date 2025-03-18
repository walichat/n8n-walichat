import {
    NodeConnectionType,
    NodeOperationError,
    type INodeType,
    type INodeTypeDescription,
    type IWebhookFunctions,
    type IWebhookResponseData,
    type IHookFunctions,
    type IExecuteFunctions,
    type INodeExecutionData,
} from 'n8n-workflow';
import axios from 'axios';
import { BaseNode } from '../Base/BaseNode';

export class Webhook extends BaseNode implements INodeType {
    description: INodeTypeDescription = {
      displayName: 'WaliChat Webhook Event',
      name: 'walichatWebhookTrigger',
      icon: 'file:../../../icon.png',
      group: ['trigger'],
      version: 1,
      description: 'Triggers when an event occurs on your WhatsApp number, such as a new message is received. See list of supported webhook events below.',
      defaults: {
        name: 'WaliChat Webhook Event',
        color: '#1A82e2',
      },
      inputs: [],
      outputs: [NodeConnectionType.Main],
      credentials: [
        {
          name: 'WaliChatApiKey',
          required: true,
        },
      ],
      properties: [
        {
          displayName: 'Name',
          name: 'name',
          type: 'string',
          default: 'New WaliChat Event',
          description: 'The name for the registered webhook',
          required: true,
        },
        {
          displayName: 'WhatsApp number',
          name: 'device',
          type: 'string',
          default: '',
          description: 'Restrict events to a specific WhatsApp number. By default all numbers will be notified.',
          required: false,
          typeOptions: {
            loadOptionsMethod: 'getDevices',
          },
        },
        {
          displayName: 'Events',
          name: 'events',
          type: 'multiOptions',
          options: [
            {
              name: 'New incoming message',
              value: 'message:in:new',
            },
            {
              name: 'New outgoing message',
              value: 'message:out:new',
            },
            {
              name: 'Message read acknowledgment',
              value: 'message:out:ack',
            },
            {
              name: 'Message update',
              value: 'message:update',
            },
            {
              name: 'New message reaction',
              value: 'message:reaction',
            },
            {
              name: 'New user status story',
              value: 'status:update',
            },
            {
              name: 'New channel inbound message',
              value: 'channel:in',
            },
            {
              name: 'WhatsApp number session update',
              value: 'number:session',
            },
            {
              name: 'Group update',
              value: 'group:update',
            },
            {
              name: 'Chat update',
              value: 'chat:update',
            },
            {
              name: 'Contact update',
              value: 'contact:update',
            },
            {
              name: 'Message delivery failed',
              value: 'message:out:failed',
            },
          ],
          default: ['message:in:new'],
          description: 'Select one or multiple events to trigger the webhook',
          required: true,
        },
      ],
      webhooks: [
        {
          // Incoming webhook settings for the node
          name: 'default',
          httpMethod: 'POST',
          // The path portion of the webhook URL, e.g. /webhook/walichat
          path: '',
        },
      ],
    };

    webhookMethods = {
      default: {
        async checkExists(this: IHookFunctions): Promise<boolean> {
          const url = this.getNodeWebhookUrl('default');
          const credentials = await this.getCredentials('WaliChatApiKey');
          if (!credentials || !credentials.apiKey) {
            throw new NodeOperationError(this.getNode(), 'No WaliChat API Key credentials found!');
          }
          const apiKey = credentials.apiKey as string;

          const webhooks = await axios.get('https://api.wali.chat/v1/webhooks?size=100', {
              headers: {
                Authorization: `Bearer ${apiKey}`,
              }
          })

          const webhook = webhooks.data.find((webhook: any) => webhook.url === url);
          if (!webhook) {
            return false;
          }
          if (webhook.status !== 'active') {
            await axios.delete(`https://api.wali.chat/v1/webhooks/${webhook.id}`, {
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                }
            });
            return false
          }

          return true
        },
        async create(this: IHookFunctions): Promise<boolean> {
          const credentials = await this.getCredentials('WaliChatApiKey');
          if (!credentials || !credentials.apiKey) {
            throw new NodeOperationError(this.getNode(), 'No WaliChat API Key credentials found!');
          }
          const apiKey = credentials.apiKey as string;

          // Build our webhook URL that will be called by WaliChat.
          const webhookUrl = this.getNodeWebhookUrl('default') as string;

          // Get parameters from the node.
          const name = this.getNodeParameter('name', 0) as string;
          const device = this.getNodeParameter('device', 0) as string;
          const events = this.getNodeParameter('events', 0) as string[];

          // Build the body to register the webhook.
          const body: {
              name: string;
              device?: string;
              url: string;
              events: string[];
          } = {
              name,
              url: webhookUrl,
              events: ['message:in:new'],
          };

          // Include the device field only if provided.
          if (device) {
              body.device = device;
          }
          if (events?.length) {
              body.events = events
          }

          // Register the webhook via the external API.
          try {
            await axios.post('https://api.wali.chat/v1/webhooks', body, {
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
            });
          } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
              console.error('Error response body:', error.response.data);
            } else {
              console.error('Error:', error.message);
            }
            throw new NodeOperationError(this.getNode(), `Failed to register webhook: ${error.status} ${error.response?.data?.message || error.message}`);
          }

          return true
        },
        async delete(this: IHookFunctions): Promise<boolean> {
          // Find webhook by URL and delete it
          const url = this.getNodeWebhookUrl('default');
          const credentials = await this.getCredentials('WaliChatApiKey');
          if (!credentials || !credentials.apiKey) {
            throw new NodeOperationError(this.getNode(), 'No WaliChat API Key credentials found!');
          }
          const apiKey = credentials.apiKey as string;

          const webhooks = await axios.get('https://api.wali.chat/v1/webhooks?size=100', {
              headers: {
                Authorization: `Bearer ${apiKey}`,
              }
          })

          const webhook = webhooks.data.find((webhook: any) => webhook.url === url);
          if (!webhook) {
            return false
          }

          // Delete webhook
          await axios.delete(`https://api.wali.chat/v1/webhooks/${webhook.id}`, {
              headers: {
                Authorization: `Bearer ${apiKey}`,
              }
          });
          return true
        }
      }
    }

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
      // Implementation of the execute method
      return [[]];
    }

    // This method is invoked when your externally registered webhook receives an event.
    async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
        // Get the incoming request object.
        const req = this.getRequestObject();

        // Simply pass the request body as the output data to trigger the workflow.
        return {
            workflowData: [this.helpers.returnJsonArray(req.body)],
        };
    }
}
