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
import { rawRequest } from '../request';

const clientRuntime = process.env.N8N_RUNTIME_CLIENT || 'n8n';

const sampleWebhookEvents = [
  {
    id: 'inbound-text',
    type: 'text',
    name: 'On text message received',
    event: 'message:in:new'
  },
  {
    id: 'outbound-text',
    type: 'text',
    name: 'On text message sent',
    event: 'message:out:new'
  },
  {
    id: 'inbound-image',
    type: 'image',
    name: 'On image message received',
    event: 'message:in:new'
  },
  {
    id: 'outbound-image',
    type: 'image',
    name: 'On image message sent',
    event: 'message:out:new'
  },
  {
    id: 'inbound-video',
    type: 'video',
    name: 'On video message received',
    event: 'message:in:new'
  },
  {
    id: 'outbound-video',
    type: 'video',
    name: 'On video message sent',
    event: 'message:out:new'
  },
  {
    id: 'inbound-audio',
    type: 'audio',
    name: 'On audio message received',
    event: 'message:in:new'
  },
  {
    id: 'outbound-audio',
    type: 'audio',
    name: 'On audio message sent',
    event: 'message:out:new'
  },
  {
    id: 'inbound-document',
    type: 'document',
    name: 'On document message received',
    event: 'message:in:new'
  },
  {
    id: 'outbound-document',
    type: 'document',
    name: 'On document message sent',
    event: 'message:out:new'
  },
  {
    id: 'inbound-contacts',
    type: 'contacts',
    name: 'On contacts message received',
    event: 'message:in:new'
  },
  {
    id: 'outbound-contacts',
    type: 'contacts',
    name: 'On contacts message sent',
    event: 'message:out:new'
  },
  {
    id: 'inbound-location',
    type: 'location',
    name: 'On location message received',
    event: 'message:in:new'
  },
  {
    id: 'outbound-location',
    type: 'location',
    name: 'On location message sent',
    event: 'message:out:new'
  },
  {
    id: 'inbound-buttons',
    type: 'buttons',
    name: 'On buttons message received',
    event: 'message:in:new'
  },
  {
    id: 'outbound-buttons',
    type: 'buttons',
    name: 'On buttons message sent',
    event: 'message:out:new'
  },
  {
    id: 'inbound-buttons-response',
    type: 'buttons',
    subtype: 'response',
    name: 'On inbound buttons reply message',
    event: 'message:in:new'
  },
  {
    id: 'inbound-list',
    type: 'list',
    name: 'On list message received',
    event: 'message:in:new'
  },
  {
    id: 'outbound-list',
    type: 'list',
    name: 'On outbound message sent',
    event: 'message:out:new'
  },
  {
    id: 'inbound-list-response',
    type: 'list',
    subtype: 'response',
    name: 'On inbound list response message',
    event: 'message:in:new'
  },
  {
    id: 'inbound-product',
    type: 'catalog',
    name: 'On product catalog message received',
    event: 'message:in:new'
  },
  {
    id: 'outbound-product',
    type: 'catalog',
    name: 'On product catalog message sent',
    event: 'message:out:new'
  },
  {
    id: 'inbound-order',
    type: 'order',
    name: 'On order catalog message received',
    event: 'message:in:new'
  },
  {
    id: 'outbound-order',
    type: 'order',
    name: 'On order catalog message sent',
    event: 'message:out:new'
  },
  {
    id: 'inbound-reaction',
    type: 'reaction',
    name: 'On inbound message with reaction',
    event: 'message:reaction'
  },
  {
    id: 'outbound-reaction',
    type: 'reaction',
    name: 'On outbound message with reaction',
    event: 'message:reaction'
  },
  {
    id: 'inbound-reaction-deleted',
    type: 'reaction',
    name: 'Inbound message reaction was deleted',
    event: 'message:reaction'
  },
  {
    id: 'inbound-poll',
    type: 'poll',
    name: 'On poll message received',
    event: 'message:in:new'
  },
  {
    id: 'inbound-event',
    type: 'event',
    name: 'On group event message received',
    event: 'message:in:new'
  },
  {
    id: 'inbound-link-preview',
    type: 'link-preview',
    name: 'On message with link preview received',
    event: 'message:in:new'
  },
  {
    id: 'outbound-link-preview',
    type: 'link-preview',
    name: 'On message with link preview sent',
    event: 'message:out:new'
  },
  {
    id: 'inbound-quoted',
    type: 'quoted',
    name: 'On quoted message received',
    event: 'message:in:new'
  },
  {
    id: 'outbound-quoted',
    type: 'quoted',
    name: 'On quoted message sent',
    event: 'message:out:new'
  },
  {
    id: 'outbound-read',
    type: 'text',
    name: 'When a sent message is read the user',
    event: 'message:out:ack'
  },
  {
    id: 'outbound-played',
    type: 'audio',
    name: 'When a sent audio message is played the user',
    event: 'message:out:ack'
  },
  {
    id: 'autoreply',
    type: 'text',
    name: 'Auto reply message is sent to the user',
    event: 'message:out:new'
  },
  {
    id: 'group-inbound',
    type: 'group-inbound',
    name: 'On group message received',
    event: 'message:in:new'
  },
  {
    id: 'group-outbound',
    type: 'group-outbound',
    name: 'On group message sent',
    event: 'message:out:new'
  },
  {
    id: 'inbound-group-mentions',
    type: 'group-mentions',
    name: 'On group mentions message received',
    event: 'message:in:new'
  },
  {
    id: 'outbound-failed',
    type: 'outbound-failed',
    name: 'Outbound messages failed',
    event: 'message:out:failed'
  },
  {
    id: 'chat-update',
    type: 'chat',
    name: 'Chat is updated',
    event: 'chat:update'
  },
  {
    id: 'contact-update',
    type: 'chat',
    name: 'Contact updated',
    event: 'contact:update'
  },
  {
    id: 'message-update-poll',
    type: 'poll',
    name: 'Message update on new poll votes',
    event: 'message:update'
  },
  {
    id: 'message-update-event',
    type: 'event',
    name: 'Message update on new event attendees',
    event: 'message:update'
  },
  {
    id: 'message-update-edit',
    type: 'text',
    name: 'Message content is edited',
    event: 'message:update'
  },
  {
    id: 'group-update-add',
    type: 'group-update',
    name: 'Group participants added',
    event: 'group:update',
  },
  {
    id: 'group-update-remove',
    type: 'group-update',
    name: 'Group participants removed',
    event: 'group:update',
  },
  {
    id: 'group-update-subject',
    type: 'group-update',
    name: 'Group subject updated',
    event: 'group:update',
  },
  {
    id: 'group-update-restrict',
    type: 'group-update',
    name: 'Group edit permissions restricted',
    event: 'group:update',
  },
  {
    id: 'group-update-restrict-off',
    type: 'group-update',
    name: 'Group edit permissions extended',
    event: 'group:update',
  },
  {
    id: 'group-update-announce',
    type: 'group-update',
    name: 'Group send messages permissions restricted',
    event: 'group:update',
  },
  {
    id: 'group-update-announce-off',
    type: 'group-update',
    name: 'Group edit permissions extended',
    event: 'group:update',
  },
  {
    id: 'status-update',
    type: 'text',
    name: 'On user status with text',
    event: 'status:update'
  },
  {
    id: 'status-update-image',
    type: 'image',
    name: 'On user status with image',
    event: 'status:update'
  },
  {
    id: 'status-update-video',
    type: 'video',
    name: 'On user status with video',
    event: 'status:update'
  },
  {
    id: 'channel-message',
    type: 'channel',
    name: 'WhatsApp Channel\'s new inbound image message',
    event: 'channel:in'
  },
  {
    id: 'channel-image',
    type: 'image',
    name: 'WhatsApp Channel\'s new inbound image message',
    event: 'channel:in'
  },
  {
    id: 'number-session',
    type: 'text',
    name: 'WhatsApp number session status update',
    event: 'number:session'
  },
]

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
        default: 'Automations',
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
      {
        displayName: 'Sample event to notify',
        name: 'sampleEvent',
        type: 'options',
        required: false,
        default: '',
        description: 'Select a sample event that matches your use case to test and configure the webhook JSON data structure in the next steps of your workflow.',
        typeOptions: {
          loadOptionsMethod: 'getSampleEvents',
          loadOptionsDependsOn: ['events'],
        },
      }
    ],
  };

  methods = {
    loadOptions: {
      async getDevices(this: ILoadOptionsFunctions) {
        const credentials = await this.getCredentials('walichatApiKey');
        const apiKey = credentials.walichatApiKey as string;

        try {
          const response = await rawRequest({ url: '/devices?size=100' }, apiKey);

          if (Array.isArray(response.data) && response.data.length > 0) {
            const devices = response.data.map((device: any) => ({
              name: `${device.alias || 'Unnamed'} (${device.phone || 'No phone yet'})`,
              value: device.id,
            }));

            if (clientRuntime) {
              return devices
            }

            return [
              {
                name: 'All WhatsApp numbers in your account',
                value: '',
              },
              ...devices,
            ];
          }

          if (clientRuntime) {
            return [
              {
                name: 'No WhatsApp numbers available: connect one or upgrade plan ',
                value: 'invalid',
              }
            ];
          }
          return [{ name: 'All WhatsApp numbers in your account', value: '' }];
        } catch (error: any) {
          return [{ name: 'All WhatsApp numbers in your account', value: '' }];
        }
      },
      async getSampleEvents(this: ILoadOptionsFunctions) {
        const selectedEvents = this.getNodeParameter('events', []) as string[];
        if (!selectedEvents || selectedEvents.length === 0) {
          return [];
        }

        // Filter sample events based on selected events
        const filteredSampleEvents = sampleWebhookEvents.filter(sample =>
          selectedEvents.includes(sample.event)
        );

        return filteredSampleEvents.map(sample => ({
          name: sample.name,
          value: sample.id,
        }));
      },
    },
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default');
        const nodeData = this.getWorkflowStaticData('node');
        const webhookId = nodeData.webhookId as string;
        if (!webhookId) {
          return false;
        }

        const credentials = await this.getCredentials('walichatApiKey');
        const apiKey = credentials.walichatApiKey as string;
        const workflowId = this.getWorkflow().id;
        const sample = this.getNodeParameter('sampleEvent', '') as string || 'inbound-text';

        try {
          const response = await rawRequest({ url: `/webhooks/${webhookId}?workflow=${workflowId}&sample=${sample}` }, apiKey);
          return response.data.url === webhookUrl;
        } catch (error) {
          // Delete all workflow specific webhooks
          try {
            await rawRequest({
              url: `/webhooks/${webhookId}`,
              method: 'DELETE'
            }, apiKey);
          } catch (error: any) {
            console.error(`Error deleting existing webhook existence:`, webhookId, error.message, error.response?.data);
          }
          if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
            return false;
          }
          return false;
          // throw error;
        }
      },

      async create(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default');
        const webhookName = this.getNodeParameter('webhookName') as string;
        const device = this.getNodeParameter('device', '') as string;
        const events = this.getNodeParameter('events', []) as string[];
        // Get the n8n workflow ID
        const workflowId = this.getWorkflow().id;

        if (!webhookUrl) {
          throw new Error('No webhook URL available for registration');
        }
        if (events.length === 0) {
          throw new Error('At least one event must be selected');
        }

        try {
          const credentials = await this.getCredentials('walichatApiKey');
          const apiKey = credentials.walichatApiKey as string;
          const sample = this.getNodeParameter('sampleEvent', '') as string || 'inbound-text';
          const url = `${webhookUrl}?workflow=${workflowId}`;

          const prefix = clientRuntime.replace('_', '')
          const requestBody: IDataObject = {
            name: `${prefix}: ${webhookName}`,
            url,
            events,
          };

          if (device) {
            requestBody.device = device;
          }

          const response = await rawRequest({
            url: '/webhooks',
            method: 'POST',
            data: requestBody,
            params: { sample },
            headers: {
              'Content-Type': 'application/json',
            },
          }, apiKey);

          if (response.data && response.data.id) {
            const nodeData = this.getWorkflowStaticData('node');
            nodeData.webhookId = response.data.id;
            return true;
          }

          return false;
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            if (error.response.status === 409) {
              return true;
            }
            throw new Error(`WaliChat webhook registration failed: ${device || "(no device)"} ${error.response.data?.message || error.message}`);
          }
          throw error;
        }
      },

      async delete(this: IHookFunctions): Promise<boolean> {
        const nodeData = this.getWorkflowStaticData('node');
        const webhookId = nodeData.webhookId as string;

        if (!webhookId) {
          return true;
        }

        try {
          const credentials = await this.getCredentials('walichatApiKey');
          const apiKey = credentials.walichatApiKey as string;
          const workflowId = this.getWorkflow().id;

          await rawRequest({
            url: `/webhooks/${webhookId}?workflow=${workflowId}`,
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
          }, apiKey);

          return true;
        } catch (error) {
          if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
            return true;
          }
          if (axios.isAxiosError(error) && error.response) {
            console.error(`WaliChat webhook deletion failed: ${webhookId} ${error.response.status || '<no status>'} ${error.response.data?.message || error.message}`);
          } else {
            console.error('Error deleting WaliChat webhook:', webhookId, error);
          }
          return true;
        }
      },
    },
  };

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
