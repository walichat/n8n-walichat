import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { request } from '../request';

export const webhookProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['webhooks'],
      },
    },
    options: [
      {
        name: 'Get Webhooks',
        value: 'getWebhooks',
        description: 'Get all active webhooks',
      },
      {
        name: 'Create Webhook',
        value: 'createWebhook',
        description: 'Register a new webhook endpoint',
      },
      {
        name: 'Get Webhook',
        value: 'getWebhook',
        description: 'Get a webhook by ID',
      },
      {
        name: 'Update Webhook',
        value: 'updateWebhook',
        description: 'Update an existing webhook',
      },
      {
        name: 'Delete Webhook',
        value: 'deleteWebhook',
        description: 'Delete a webhook endpoint',
      },
      {
        name: 'Enable Webhook',
        value: 'enableWebhook',
        description: 'Enable a disabled webhook',
      },
      {
        name: 'Get Webhook Logs',
        value: 'getWebhookLogs',
        description: 'Get logs for a webhook by ID',
      },
    ],
    default: 'getWebhooks',
  },

  // GET WEBHOOKS FILTERS
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['webhooks'],
        operation: ['getWebhooks'],
      },
    },
    options: [
      {
        displayName: 'Device IDs',
        name: 'devices',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getDevices',
          multipleValues: true,
        },
        default: [],
        displayOptions: {
          show: {
            resource: ['webhooks'],
            operation: ['getWebhooks'],
          },
        },
        description: 'Filter webhooks by device IDs',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'multiOptions',
        options: [
          { name: 'Active', value: 'active' },
          { name: 'Disabled', value: 'disabled' },
          { name: 'Pending', value: 'pending' },
        ],
        default: [],
        description: 'Filter webhooks by status',
      },
      {
        displayName: 'Search Term',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Search webhooks by text',
      },
      {
        displayName: 'Results Page Size',
        name: 'size',
        type: 'number',
        default: 20,
        description: 'Number of results per page',
      },
      {
        displayName: 'Page Number',
        name: 'page',
        type: 'number',
        default: 0,
        description: 'Page number (starting from 0)',
      },
    ],
  },

  // WEBHOOK ID PARAMETER FOR SINGLE WEBHOOK OPERATIONS
  {
    displayName: 'Webhook ID',
    name: 'webhookId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['webhooks'],
        operation: ['getWebhook', 'updateWebhook', 'deleteWebhook', 'enableWebhook', 'getWebhookLogs'],
      },
    },
    description: 'ID of the webhook',
  },

  // CREATE WEBHOOK PARAMETERS
  {
    displayName: 'Webhook Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['webhooks'],
        operation: ['createWebhook', 'updateWebhook'],
      },
    },
    description: 'Internal name for the webhook (max 30 characters)',
  },
  {
    displayName: 'Webhook URL',
    name: 'url',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['webhooks'],
        operation: ['createWebhook', 'updateWebhook'],
      },
    },
    description: 'Endpoint URL that will receive HTTP POST requests when events occur (must be public)',
  },
  {
    displayName: 'Event Types',
    name: 'events',
    type: 'multiOptions',
    required: true,
    displayOptions: {
      show: {
        resource: ['webhooks'],
        operation: ['createWebhook', 'updateWebhook'],
      },
    },
    options: [
      { name: 'New Inbound Message', value: 'message:in:new' },
      { name: 'New Outbound Message', value: 'message:out:new' },
      { name: 'Outbound Message Sent', value: 'message:out:sent' },
      { name: 'Outbound Message Delivery Status', value: 'message:out:ack' },
      { name: 'Outbound Message Failed', value: 'message:out:failed' },
      { name: 'Message Updated', value: 'message:update' },
      { name: 'Message Reaction', value: 'message:reaction' },
      { name: 'Channel Message Received', value: 'channel:in' },
      { name: 'Status Update', value: 'status:update' },
      { name: 'Group Update', value: 'group:update' },
      { name: 'Chat Update', value: 'chat:update' },
      { name: 'Contact Update', value: 'contact:update' },
      { name: 'WhatsApp Session Status', value: 'number:session' },
    ],
    default: ['message:in:new'],
    description: 'Event types to be notified by this webhook',
  },
  {
    displayName: 'Device ID (Optional)',
    name: 'device',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getDevices',
    },
    required: false,
    default: '',
    displayOptions: {
      show: {
        resource: ['webhooks'],
        operation: ['createWebhook', 'updateWebhook'],
      },
    },
    description: 'Restrict webhook to a specific WhatsApp device (24 characters hexadecimal)',
  },

  // GET WEBHOOK LOGS OPTIONS
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['webhooks'],
        operation: ['getWebhookLogs'],
      },
    },
    options: [
      {
        displayName: 'Maximum Entries',
        name: 'size',
        type: 'number',
        default: 20,
        description: 'Maximum number of log entries to retrieve',
      },
      {
        displayName: 'Skip Entries',
        name: 'skip',
        type: 'number',
        default: 0,
        description: 'Number of log entries to skip',
      },
    ],
  },
];

export async function executeWebhookOperations(
  this: IExecuteFunctions | any,
  index: number,
) {
  const operation = this.getNodeParameter('operation', index) as string;

  // GET WEBHOOKS
  if (operation === 'getWebhooks') {
    const filters = this.getNodeParameter('filters', index, {}) as {
      devices?: string[];
      status?: string[];
      search?: string;
      size?: number;
      page?: number;
    };

    const queryParameters: Record<string, string | string[] | number> = {};

    // Add all filters to query parameters
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== '' &&
          (typeof value !== 'object' || (Array.isArray(value) && value.length > 0))) {
        queryParameters[key] = value;
      }
    }

    return request(
      this,
      'GET',
      '/webhooks',
      undefined,
      queryParameters as Record<string, string>,
    );
  }

  // CREATE WEBHOOK
  if (operation === 'createWebhook') {
    const name = this.getNodeParameter('name', index) as string;
    const url = this.getNodeParameter('url', index) as string;
    const events = this.getNodeParameter('events', index) as string[];
    const device = this.getNodeParameter('device', index, '') as string;

    const body: {
      name: string;
      url: string;
      events: string[];
      device?: string;
    } = {
      name,
      url,
      events,
    };

    if (device) {
      body.device = device;
    }

    return request(
      this,
      'POST',
      '/webhooks',
      body,
    );
  }

  // GET WEBHOOK
  if (operation === 'getWebhook') {
    const webhookId = this.getNodeParameter('webhookId', index) as string;

    return request(
      this,
      'GET',
      `/webhooks/${webhookId}`,
    );
  }

  // UPDATE WEBHOOK
  if (operation === 'updateWebhook') {
    const webhookId = this.getNodeParameter('webhookId', index) as string;
    const name = this.getNodeParameter('name', index) as string;
    const url = this.getNodeParameter('url', index) as string;
    const events = this.getNodeParameter('events', index) as string[];
    const device = this.getNodeParameter('device', index, '') as string;

    const body: {
      name: string;
      url: string;
      events: string[];
      device?: string;
    } = {
      name,
      url,
      events,
    };

    if (device) {
      body.device = device;
    }

    return request(
      this,
      'PATCH',
      `/webhooks/${webhookId}`,
      body,
    );
  }

  // DELETE WEBHOOK
  if (operation === 'deleteWebhook') {
    const webhookId = this.getNodeParameter('webhookId', index) as string;

    return request(
      this,
      'DELETE',
      `/webhooks/${webhookId}`,
    );
  }

  // ENABLE WEBHOOK
  if (operation === 'enableWebhook') {
    const webhookId = this.getNodeParameter('webhookId', index) as string;

    return request(
      this,
      'POST',
      `/webhooks/${webhookId}/enable`,
    );
  }

  // GET WEBHOOK LOGS
  if (operation === 'getWebhookLogs') {
    const webhookId = this.getNodeParameter('webhookId', index) as string;
    const options = this.getNodeParameter('options', index, {}) as {
      size?: number;
      skip?: number;
    };

    const queryParameters: Record<string, string> = {};

    if (options.size !== undefined) {
      queryParameters.size = options.size.toString();
    }

    if (options.skip !== undefined) {
      queryParameters.skip = options.skip.toString();
    }

    return request(
      this,
      'GET',
      `/webhooks/${webhookId}/logs`,
      undefined,
      queryParameters,
    );
  }

  throw new Error(`The operation "${operation}" is not supported for webhooks!`);
}
