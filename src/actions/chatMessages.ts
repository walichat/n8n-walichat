import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { request } from '../request';

export const chatMessageProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['chat-messages'],
      },
    },
    options: [
      {
        name: 'Get Messages',
        value: 'getChatMessages',
        description: 'Retrieve chat messages filtered by various parameters',
      },
      {
        name: 'Get Message Details',
        value: 'getDeviceMessageDetails',
        description: 'Get detailed information about a specific message',
      },
      {
        name: 'Get Message Delivery Info',
        value: 'getMessageAckInfo',
        description: 'Get delivery information for an outbound message',
      },
      {
        name: 'Edit Message',
        value: 'editMessage',
        description: 'Edit a sent message (within 20 minutes of sending)',
      },
      {
        name: 'Delete Message',
        value: 'deleteDeviceMessage',
        description: 'Delete a message locally or revoke it for everyone',
      },
    ],
    default: 'getChatMessages',
  },
  {
    displayName: 'WhatsApp Number',
    name: 'deviceId',
    type: 'string',
    required: true,
    default: '',
    typeOptions: {
      loadOptionsMethod: 'getDevices',
    },
    displayOptions: {
      show: {
        resource: ['chat-messages'],
      },
    },
    description: 'The ID of the WhatsApp number',
  },

  // GET MESSAGES FILTERS
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['chat-messages'],
        operation: ['getChatMessages'],
      },
    },
    options: [
      {
        displayName: 'Flow',
        name: 'flow',
        type: 'options',
        options: [
          { name: 'Inbound', value: 'inbound' },
          { name: 'Outbound', value: 'outbound' },
        ],
        default: '',
        description: 'Filter by inbound or outbound messages',
      },
      {
        displayName: 'Delivery Status',
        name: 'ack',
        type: 'multiOptions',
        options: [
          { name: 'Pending', value: 'pending' },
          { name: 'Sent', value: 'sent' },
          { name: 'Delivered', value: 'delivered' },
          { name: 'Read', value: 'read' },
          { name: 'Failed', value: 'failed' },
        ],
        default: [],
        description: 'Filter messages by delivery ACK status',
      },
      {
        displayName: 'WhatsApp IDs',
        name: 'wid',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Filter messages by WID (WhatsApp ID)',
      },
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Search messages by text content, contact name or media filename',
      },
      {
        displayName: 'Chat ID',
        name: 'chat',
        type: 'string',
        typeOptions: {
          loadOptionsMethod: 'getGroups',
          loadOptionsDependsOn: ['deviceId'],
        },
        default: '',
        description: 'Filter messages by chat WhatsApp ID (user, group, or channel)',
      },
      {
        displayName: 'From',
        name: 'from',
        type: 'string',
        default: '',
        description: 'Return messages sent from a given phone number or WhatsApp WID',
      },
      {
        displayName: 'To',
        name: 'to',
        type: 'string',
        default: '',
        description: 'Return messages received to the given phone number or WhatsApp WID',
      },
      {
        displayName: 'Chat Type',
        name: 'type',
        type: 'multiOptions',
        options: [
          { name: 'User', value: 'user' },
          { name: 'Group', value: 'group' },
          { name: 'Broadcast', value: 'broadcast' },
        ],
        default: [],
        description: 'Filter messages by chat type',
      },
      {
        displayName: 'Reference',
        name: 'reference',
        type: 'string',
        default: '',
        description: 'Filter messages by reference field exact match',
      },
      {
        displayName: 'Message Type',
        name: 'kind',
        type: 'multiOptions',
        options: [
          { name: 'Text', value: 'text' },
          { name: 'Image', value: 'image' },
          { name: 'Audio', value: 'audio' },
          { name: 'Voice', value: 'voice' },
          { name: 'Video', value: 'video' },
          { name: 'Document', value: 'document' },
          { name: 'Contact', value: 'contact' },
          { name: 'Location', value: 'location' },
          { name: 'System', value: 'system' },
        ],
        default: [],
        description: 'Filter message by type',
      },
      {
        displayName: 'Sync Messages',
        name: 'sync',
        type: 'boolean',
        default: false,
        description: 'Whether to sync messages from the WhatsApp session if no messages are available',
      },
      {
        displayName: 'Begin From Message ID',
        name: 'begin',
        type: 'string',
        default: '',
        description: 'Return newest messages starting from the given message ID',
      },
      {
        displayName: 'End At Message ID',
        name: 'end',
        type: 'string',
        default: '',
        description: 'Return oldest messages starting from the given message ID',
      },
      {
        displayName: 'Created After',
        name: 'after',
        type: 'dateTime',
        default: '',
        description: 'Messages created after the given date',
      },
      {
        displayName: 'Created Before',
        name: 'before',
        type: 'dateTime',
        default: '',
        description: 'Messages created before the given date',
      },
      {
        displayName: 'Include',
        name: 'include',
        type: 'multiOptions',
        options: [
          { name: 'Contact', value: 'contact' },
          { name: 'Chat', value: 'chat' },
          { name: 'Media', value: 'media' },
        ],
        default: [],
        description: 'Include nested related documents per message',
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
        description: 'Sort messages by date',
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
      {
        displayName: 'Skip Messages',
        name: 'skip',
        type: 'number',
        default: 0,
        description: 'Skip previous messages (only applicable if sync=true)',
      },
    ],
  },

  // MESSAGE ID PARAMETER FOR SINGLE MESSAGE OPERATIONS
  {
    displayName: 'Message ID',
    name: 'messageId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['chat-messages'],
        operation: ['getDeviceMessageDetails', 'getMessageAckInfo', 'editMessage', 'deleteDeviceMessage'],
      },
    },
    description: 'The ID of the message (WhatsApp hexadecimal ID)',
  },

  // EDIT MESSAGE PARAMETERS
  {
    displayName: 'New Message Text',
    name: 'message',
    type: 'string',
    typeOptions: {
      rows: 4,
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['chat-messages'],
        operation: ['editMessage'],
      },
    },
    description: 'New text content for the message',
  },

  // DELETE MESSAGE PARAMETERS
  {
    displayName: 'Options',
    name: 'deleteOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['chat-messages'],
        operation: ['deleteDeviceMessage'],
      },
    },
    options: [
      {
        displayName: 'Clean Message Box',
        name: 'clean',
        type: 'boolean',
        default: false,
        description: 'Delete the message deletion information box from the chat list',
      },
      {
        displayName: 'Force Delete Locally',
        name: 'force',
        type: 'boolean',
        default: false,
        description: 'Force message deletion locally even if it cannot be revoked on the receiver side',
      },
      {
        displayName: 'Revoke for Everyone',
        name: 'revoke',
        type: 'boolean',
        default: false,
        description: 'Revoke and delete message for everyone (only works within 60 minutes of sending)',
      },
    ],
  },
];

export async function executeChatMessageOperations(
  this: IExecuteFunctions | any,
  index: number,
) {
  const operation = this.getNodeParameter('operation', index) as string;
  const deviceId = this.getNodeParameter('deviceId', index) as string;

  // GET CHAT MESSAGES
  if (operation === 'getChatMessages') {
    const filters = this.getNodeParameter('filters', index, {}) as {
      flow?: string;
      ack?: string[];
      wid?: string[];
      search?: string;
      chat?: string;
      from?: string;
      to?: string;
      type?: string[];
      reference?: string;
      kind?: string[];
      sync?: boolean;
      begin?: string;
      end?: string;
      after?: string;
      before?: string;
      include?: string[];
      sort?: string;
      page?: number;
      size?: number;
      skip?: number;
    };

    const queryParameters: Record<string, string | string[] | boolean | number> = {};

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
      `/chat/${deviceId}/messages`,
      undefined,
      queryParameters as Record<string, string>,
    );
  }

  // GET DEVICE MESSAGE DETAILS
  if (operation === 'getDeviceMessageDetails') {
    const messageId = this.getNodeParameter('messageId', index) as string;

    return request(
      this,
      'GET',
      `/chat/${deviceId}/messages/${messageId}`,
    );
  }

  // GET MESSAGE ACK INFO
  if (operation === 'getMessageAckInfo') {
    const messageId = this.getNodeParameter('messageId', index) as string;

    return request(
      this,
      'GET',
      `/chat/${deviceId}/messages/${messageId}/ackinfo`,
    );
  }

  // EDIT MESSAGE
  if (operation === 'editMessage') {
    const messageId = this.getNodeParameter('messageId', index) as string;
    const message = this.getNodeParameter('message', index) as string;

    return request(
      this,
      'PATCH',
      `/chat/${deviceId}/messages/${messageId}`,
      { message },
    );
  }

  // DELETE DEVICE MESSAGE
  if (operation === 'deleteDeviceMessage') {
    const messageId = this.getNodeParameter('messageId', index) as string;
    const deleteOptions = this.getNodeParameter('deleteOptions', index, {}) as {
      clean?: boolean;
      force?: boolean;
      revoke?: boolean;
    };

    const queryParameters: Record<string, string> = {};

    if (deleteOptions.clean) {
      queryParameters.clean = 'true';
    }

    if (deleteOptions.force) {
      queryParameters.force = 'true';
    }

    if (deleteOptions.revoke) {
      queryParameters.revoke = 'true';
    }

    return request(
      this,
      'DELETE',
      `/chat/${deviceId}/messages/${messageId}`,
      undefined,
      queryParameters,
    );
  }

  throw new Error(`The operation "${operation}" is not supported for chat messages!`);
}
