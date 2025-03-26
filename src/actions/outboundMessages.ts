import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { request } from '../request';

export const outboundMessageProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['outbound-messages'],
      },
    },
    options: [
      {
        name: 'Search Messages',
        value: 'searchMessages',
        description: 'Search for outbound messages',
      },
      {
        name: 'Get Message',
        value: 'getMessage',
        description: 'Get a specific outbound message by ID',
      },
      {
        name: 'Update Message',
        value: 'updateMessage',
        description: 'Update a queued message',
      },
      {
        name: 'Delete Message',
        value: 'deleteMessage',
        description: 'Delete a message',
      },
    ],
    default: 'searchMessages',
  },

  // SEARCH MESSAGES FILTERS
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['outbound-messages'],
        operation: ['searchMessages'],
      },
    },
    options: [
      {
        displayName: 'Search Term',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Search messages by text content, phone number, group or message IDs',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'multiOptions',
        options: [
          { name: 'Queued', value: 'queued' },
          { name: 'Processing', value: 'processing' },
          { name: 'Sent', value: 'sent' },
          { name: 'Delivered', value: 'delivered' },
          { name: 'Read', value: 'read' },
          { name: 'Failed', value: 'failed' },
          { name: 'Pending', value: 'pending' },
        ],
        default: [],
        description: 'Filter messages by status',
      },
      {
        displayName: 'Delivery Status',
        name: 'deliveryStatus',
        type: 'multiOptions',
        options: [
          { name: 'Pending', value: 'pending' },
          { name: 'Sent', value: 'sent' },
          { name: 'Delivered', value: 'delivered' },
          { name: 'Read', value: 'read' },
          { name: 'Failed', value: 'failed' },
        ],
        default: [],
        description: 'Filter messages by delivery status',
      },
      {
        displayName: 'Webhook Status',
        name: 'webhookStatus',
        type: 'multiOptions',
        options: [
          { name: 'Pending', value: 'pending' },
          { name: 'Success', value: 'success' },
          { name: 'Failed', value: 'failed' },
        ],
        default: [],
        description: 'Filter messages by webhook status',
      },
      {
        displayName: 'Include',
        name: 'include',
        type: 'multiOptions',
        options: [
          { name: 'Device', value: 'device' },
          { name: 'Agent', value: 'agent' },
          { name: 'Events', value: 'events' },
        ],
        default: [],
        description: 'Expand subentity documents per message',
      },
      {
        displayName: 'Message IDs',
        name: 'ids',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Filter by specific message IDs',
      },
      {
        displayName: 'Agent IDs',
        name: 'agents',
        type: 'string',
        typeOptions: {
          multipleValues: true,
          loadOptionsMethod: 'getTeamAgents',
        },
        default: [],
        description: 'Filter messages sent by specific agent IDs',
      },
      {
        displayName: 'Source',
        name: 'source',
        type: 'options',
        options: [
          { name: 'API', value: 'api' },
          { name: 'Web Chat', value: 'chat' },
        ],
        default: '',
        description: 'Message creation origin',
      },
      {
        displayName: 'Target Type',
        name: 'target',
        type: 'options',
        options: [
          { name: 'User', value: 'user' },
          { name: 'Group', value: 'group' },
          { name: 'Channel', value: 'channel' },
        ],
        default: '',
        description: 'Chat kind of the message target',
      },
      {
        displayName: 'Message Type',
        name: 'type',
        type: 'multiOptions',
        options: [
          { name: 'Text', value: 'text' },
          { name: 'Image', value: 'image' },
          { name: 'Video', value: 'video' },
          { name: 'Audio', value: 'audio' },
          { name: 'Voice', value: 'voice' },
          { name: 'Document', value: 'document' },
          { name: 'Location', value: 'location' },
          { name: 'Contact', value: 'contact' },
          { name: 'Buttons', value: 'buttons' },
          { name: 'List', value: 'list' },
          { name: 'Template', value: 'template' },
        ],
        default: [],
        description: 'Filter messages by type',
      },
      {
        displayName: 'WhatsApp IDs',
        name: 'waIds',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Filter by WhatsApp message IDs',
      },
      {
        displayName: 'Device IDs',
        name: 'devices',
        type: 'string',
        typeOptions: {
          multipleValues: true,
          loadOptionsMethod: 'getDevices',
        },
        default: [],
        description: 'Filter by specific device IDs',
      },
      {
        displayName: 'Device',
        name: 'device',
        type: 'string',
        typeOptions: {
          loadOptionsMethod: 'getDevices',
        },
        default: '',
        description: 'Filter by device ID or phone number',
      },
      {
        displayName: 'Reference',
        name: 'reference',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Filter by message reference',
      },
      {
        displayName: 'Priority',
        name: 'priority',
        type: 'multiOptions',
        options: [
          { name: 'Low', value: 'low' },
          { name: 'Normal', value: 'normal' },
          { name: 'High', value: 'high' },
          { name: 'Urgent', value: 'urgent' },
        ],
        default: [],
        description: 'Filter by message priority',
      },
      {
        displayName: 'Phone Number',
        name: 'phone',
        type: 'string',
        default: '',
        description: 'Filter by target phone number (E.164 format)',
      },
      {
        displayName: 'Group ID',
        name: 'group',
        type: 'string',
        typeOptions: {
          loadOptionsMethod: 'getGroups',
          loadOptionsDependsOn: ['device'],
        },
        default: '',
        description: 'Filter by target group WhatsApp ID',
      },
      {
        displayName: 'Channel ID',
        name: 'channel',
        type: 'string',
        default: '',
        description: 'Filter by target channel WhatsApp ID',
      },
      {
        displayName: 'Delivery After',
        name: 'after',
        type: 'dateTime',
        default: '',
        description: 'Messages scheduled for delivery after this date',
      },
      {
        displayName: 'Delivery Before',
        name: 'before',
        type: 'dateTime',
        default: '',
        description: 'Messages scheduled for delivery before this date',
      },
      {
        displayName: 'Created After',
        name: 'createdAfter',
        type: 'dateTime',
        default: '',
        description: 'Messages created after this date',
      },
      {
        displayName: 'Created Before',
        name: 'createdBefore',
        type: 'dateTime',
        default: '',
        description: 'Messages created before this date',
      },
      {
        displayName: 'Sort',
        name: 'sort',
        type: 'options',
        options: [
          { name: 'Recent First', value: 'date:desc' },
          { name: 'Oldest First', value: 'date:asc' },
        ],
        default: 'date:desc',
        description: 'Sort order for results',
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

  // GET MESSAGE BY ID
  {
    displayName: 'Message ID',
    name: 'messageId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['outbound-messages'],
        operation: ['getMessage', 'updateMessage', 'deleteMessage'],
      },
    },
    description: 'ID of the message',
  },
  {
    displayName: 'Include',
    name: 'include',
    type: 'multiOptions',
    displayOptions: {
      show: {
        resource: ['outbound-messages'],
        operation: ['getMessage'],
      },
    },
    options: [
      { name: 'Device', value: 'device' },
      { name: 'Agent', value: 'agent' },
      { name: 'Events', value: 'events' },
    ],
    default: [],
    description: 'Include additional information in the response',
  },

  // UPDATE MESSAGE OPTIONS
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['outbound-messages'],
        operation: ['updateMessage'],
      },
    },
    options: [
      {
        displayName: 'Message Text',
        name: 'message',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        description: 'New text content for the message',
      },
      {
        displayName: 'Phone Number',
        name: 'phone',
        type: 'string',
        default: '',
        description: 'New target phone number in E.164 format (e.g., +447362053576)',
      },
      {
        displayName: 'Group ID',
        name: 'group',
        type: 'string',
        typeOptions: {
          loadOptionsMethod: 'getGroups',
          loadOptionsDependsOn: ['device'],
        },
        default: '',
        description: 'New target group WhatsApp ID',
      },
      {
        displayName: 'Channel ID',
        name: 'channel',
        type: 'string',
        default: '',
        description: 'New target channel WhatsApp ID',
      },
      {
        displayName: 'Chat ID',
        name: 'chat',
        type: 'string',
        default: '',
        description: 'New target chat WhatsApp ID',
      },
      {
        displayName: 'Device ID',
        name: 'device',
        type: 'string',
        typeOptions: {
          loadOptionsMethod: 'getDevices',
        },
        default: '',
        description: 'New WhatsApp device ID for message delivery',
      },
      {
        displayName: 'Agent ID',
        name: 'agent',
        type: 'string',
        typeOptions: {
          loadOptionsMethod: 'getTeamAgents',
          loadOptionsDependsOn: ['device'],
        },
        default: '',
        description: 'New agent ID to send the message on behalf of',
      },
      {
        displayName: 'Scheduled Delivery',
        name: 'deliverAt',
        type: 'dateTime',
        default: '',
        description: 'New scheduled delivery date/time',
      },
      {
        displayName: 'Priority',
        name: 'priority',
        type: 'options',
        options: [
          { name: 'Low', value: 'low' },
          { name: 'Normal', value: 'normal' },
          { name: 'High', value: 'high' },
          { name: 'Urgent', value: 'urgent' },
        ],
        default: 'normal',
        description: 'New message priority',
      },
      {
        displayName: 'Reference',
        name: 'reference',
        type: 'string',
        default: '',
        description: 'New message reference for tracking',
      },
      {
        displayName: 'Remove Fields',
        name: 'remove',
        type: 'multiOptions',
        options: [
          { name: 'Reference', value: 'reference' },
          { name: 'Media', value: 'media' },
          { name: 'Media File', value: 'media.file' },
          { name: 'Media Message', value: 'media.message' },
          { name: 'Media Reference', value: 'media.reference' },
          { name: 'Location', value: 'location' },
          { name: 'Location Address', value: 'location.address' },
          { name: 'Location Coordinates', value: 'location.coordinates' },
        ],
        default: [],
        description: 'Fields to remove from the message',
      },
    ],
  },

  // DELETE MESSAGE OPTIONS
  {
    displayName: 'Force Delete',
    name: 'force',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['outbound-messages'],
        operation: ['deleteMessage'],
      },
    },
    description: 'Whether to force message deletion, even if already delivered or processing',
  },
];

export async function executeOutboundMessageOperations(
  this: IExecuteFunctions | any,
  index: number,
) {
  const operation = this.getNodeParameter('operation', index) as string;

  // SEARCH MESSAGES
  if (operation === 'searchMessages') {
    const filters = this.getNodeParameter('filters', index, {}) as {
      search?: string;
      status?: string[];
      deliveryStatus?: string[];
      webhookStatus?: string[];
      include?: string[];
      ids?: string[];
      agents?: string[];
      source?: string;
      target?: string;
      type?: string[];
      waIds?: string[];
      devices?: string[];
      device?: string;
      reference?: string[];
      priority?: string[];
      phone?: string;
      group?: string;
      channel?: string;
      after?: string;
      before?: string;
      createdAfter?: string;
      createdBefore?: string;
      sort?: string;
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
      '/messages',
      undefined,
      queryParameters as Record<string, string>,
    );
  }

  // GET MESSAGE
  if (operation === 'getMessage') {
    const messageId = this.getNodeParameter('messageId', index) as string;
    const include = this.getNodeParameter('include', index, []) as string[];

    const queryParameters: Record<string, string> = {};
    if (include && include.length > 0) {
      queryParameters.include = include.join(',');
    }

    return request(
      this,
      'GET',
      `/messages/${messageId}`,
      undefined,
      queryParameters,
    );
  }

  // UPDATE MESSAGE
  if (operation === 'updateMessage') {
    const messageId = this.getNodeParameter('messageId', index) as string;
    const updateFields = this.getNodeParameter('updateFields', index, {}) as {
      message?: string;
      phone?: string;
      group?: string;
      channel?: string;
      chat?: string;
      device?: string;
      agent?: string;
      deliverAt?: string;
      priority?: string;
      reference?: string;
      remove?: string[];
    };

    const body: Record<string, any> = {};

    // Add update fields to request body
    for (const [key, value] of Object.entries(updateFields)) {
      if (key === 'remove') continue; // Handle remove separately
      if (value !== undefined && value !== '') {
        body[key] = value;
      }
    }

    // Add remove array if specified
    if (updateFields.remove && updateFields.remove.length > 0) {
      body.remove = updateFields.remove;
    }

    return request(
      this,
      'PATCH',
      `/messages/${messageId}`,
      body,
    );
  }

  // DELETE MESSAGE
  if (operation === 'deleteMessage') {
    const messageId = this.getNodeParameter('messageId', index) as string;
    const force = this.getNodeParameter('force', index, false) as boolean;

    const queryParameters: Record<string, string> = {};
    if (force) {
      queryParameters.force = 'true';
    }

    return request(
      this,
      'DELETE',
      `/messages/${messageId}`,
      undefined,
      queryParameters,
    );
  }

  throw new Error(`The operation "${operation}" is not supported for outbound messages!`);
}
