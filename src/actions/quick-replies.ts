import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { request } from '../request';

export const quickReplyProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['quick-replies'],
      },
    },
    options: [
      {
        name: 'Get Quick Replies',
        value: 'getQuickReplies',
        description: 'Get a list of available quick replies',
      },
      {
        name: 'Create Quick Reply',
        value: 'createQuickReply',
        description: 'Create a new quick reply',
      },
      {
        name: 'Update Quick Reply',
        value: 'updateQuickReply',
        description: 'Update an existing quick reply',
      },
      {
        name: 'Delete Quick Replies',
        value: 'deleteQuickReplies',
        description: 'Delete one or multiple quick replies',
      },
    ],
    default: 'getQuickReplies',
  },
  {
    displayName: 'WhatsApp Number',
    name: 'device',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getDevices',
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['quick-replies'],
      },
    },
    description: 'The ID of the WhatsApp number',
  },

  // GET QUICK REPLIES FILTERS
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['quick-replies'],
        operation: ['getQuickReplies'],
      },
    },
    options: [
      {
        displayName: 'Scope',
        name: 'scope',
        type: 'options',
        options: [
          { name: 'WhatsApp Business Synced', value: 'wa' },
          { name: 'Chat Created', value: 'chat' },
        ],
        default: '',
        description: 'Filter quick replies by definition scope',
      },
      {
        displayName: 'Permissions',
        name: 'permissions',
        type: 'multiOptions',
        options: [
          { name: 'Public', value: 'public' },
          { name: 'Read-only', value: 'readonly' },
          { name: 'Private', value: 'private' },
        ],
        default: [],
        description: 'Filter quick replies by permission level',
      },
      {
        displayName: 'Agents',
        name: 'agents',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Filter quick replies created by specific agent IDs',
      },
      {
        displayName: 'Results Page Size',
        name: 'size',
        type: 'number',
        default: 20,
        description: 'Maximum number of results per page',
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

  // CREATE/UPDATE QUICK REPLY OPTIONS
  {
    displayName: 'Shortcut',
    name: 'shortcut',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['quick-replies'],
        operation: ['createQuickReply', 'updateQuickReply'],
      },
    },
    description: 'Shortcut keyword for the quick reply (2-25 characters)',
  },
  {
    displayName: 'Message',
    name: 'message',
    type: 'string',
    required: true,
    typeOptions: {
      rows: 4,
    },
    default: '',
    displayOptions: {
      show: {
        resource: ['quick-replies'],
        operation: ['createQuickReply', 'updateQuickReply'],
      },
    },
    description: 'Message content for the quick reply (4-6000 characters)',
  },
  {
    displayName: 'Permission',
    name: 'permission',
    type: 'options',
    required: false,
    default: 'public',
    displayOptions: {
      show: {
        resource: ['quick-replies'],
        operation: ['createQuickReply', 'updateQuickReply'],
      },
    },
    options: [
      { name: 'Public', value: 'public' },
      { name: 'Read-only', value: 'readonly' },
      { name: 'Private', value: 'private' },
    ],
    description: 'Access permission for the quick reply',
  },
  {
    displayName: 'Include Media File',
    name: 'includeFile',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['quick-replies'],
        operation: ['createQuickReply', 'updateQuickReply'],
      },
    },
    description: 'Whether to include a media file with the quick reply',
  },
  {
    displayName: 'File ID',
    name: 'file',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getFiles',
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['quick-replies'],
        operation: ['createQuickReply', 'updateQuickReply'],
        includeFile: [true],
      },
    },
    description: 'ID of the previously uploaded file to attach (24 character hex value)',
  },
  {
    displayName: 'Keywords',
    name: 'keywords',
    type: 'string',
    typeOptions: {
      multipleValues: true,
      multipleValueButtonText: 'Add Keyword',
    },
    required: false,
    default: [],
    displayOptions: {
      show: {
        resource: ['quick-replies'],
        operation: ['createQuickReply', 'updateQuickReply'],
      },
    },
    description: 'Optional keywords for the quick reply (max 3, alphanumeric only)',
  },

  // ID field for update
  {
    displayName: 'Quick Reply ID',
    name: 'id',
    type: 'string',
    required: false,
    default: '',
    displayOptions: {
      show: {
        resource: ['quick-replies'],
        operation: ['updateQuickReply'],
      },
    },
    description: 'ID of the quick reply to update (24 character hex value)',
  },

  // DELETE QUICK REPLIES OPTIONS
  {
    displayName: 'Delete Method',
    name: 'deleteMethod',
    type: 'options',
    required: true,
    default: 'specific',
    displayOptions: {
      show: {
        resource: ['quick-replies'],
        operation: ['deleteQuickReplies'],
      },
    },
    options: [
      {
        name: 'Delete All Quick Replies',
        value: 'all',
      },
      {
        name: 'Delete by ID or Shortcut',
        value: 'specific',
      },
    ],
    description: 'Method to use for deleting quick replies',
  },
  {
    displayName: 'Items to Delete',
    name: 'deleteItems',
    placeholder: 'Add Item',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
    },
    default: {},
    displayOptions: {
      show: {
        resource: ['quick-replies'],
        operation: ['deleteQuickReplies'],
        deleteMethod: ['specific'],
      },
    },
    options: [
      {
        name: 'items',
        displayName: 'Item',
        values: [
          {
            displayName: 'Type',
            name: 'type',
            type: 'options',
            options: [
              {
                name: 'ID',
                value: 'id',
              },
              {
                name: 'Shortcut',
                value: 'shortcut',
              },
            ],
            default: 'id',
            description: 'The type of identifier to use',
          },
          {
            displayName: 'ID',
            name: 'id',
            type: 'string',
            displayOptions: {
              show: {
                type: ['id'],
              },
            },
            default: '',
            description: 'The ID of the quick reply to delete',
          },
          {
            displayName: 'Shortcut',
            name: 'shortcut',
            type: 'string',
            displayOptions: {
              show: {
                type: ['shortcut'],
              },
            },
            default: '',
            description: 'The shortcut of the quick reply to delete',
          },
        ],
      },
    ],
  },
];

export async function executeQuickReplyOperations(
  this: IExecuteFunctions | any,
  index: number,
) {
  const operation = this.getNodeParameter('operation', index) as string;
  const device = this.getNodeParameter('device', index) as string;

  // GET QUICK REPLIES
  if (operation === 'getQuickReplies') {
    const filters = this.getNodeParameter('filters', index, {}) as {
      scope?: string;
      permissions?: string[];
      agents?: string[];
      size?: number;
      page?: number;
    };

    const queryParameters: Record<string, string | string[]> = {};

    if (filters.scope) queryParameters.scope = filters.scope;
    if (filters.permissions && filters.permissions.length > 0) queryParameters.permissions = filters.permissions;
    if (filters.agents && filters.agents.length > 0) queryParameters.agents = filters.agents;
    if (filters.size) queryParameters.size = filters.size.toString();
    if (filters.page !== undefined) queryParameters.page = filters.page.toString();

    return request(
      this,
      'GET',
      `/devices/${device}/quickReplies`,
      undefined,
      queryParameters as Record<string, string>,
    );
  }

  // CREATE QUICK REPLY
  if (operation === 'createQuickReply') {
    const shortcut = this.getNodeParameter('shortcut', index) as string;
    const message = this.getNodeParameter('message', index) as string;
    const permission = this.getNodeParameter('permission', index, 'public') as string;
    const includeFile = this.getNodeParameter('includeFile', index, false) as boolean;
    const keywords = this.getNodeParameter('keywords', index, []) as string[];

    const body: {
      shortcut: string;
      message: string;
      permission?: string;
      file?: string;
      keywords?: string[];
    } = {
      shortcut,
      message,
    };

    if (permission !== 'public') {
      body.permission = permission;
    }

    if (includeFile) {
      const file = this.getNodeParameter('file', index) as string;
      body.file = file;
    }

    if (keywords && keywords.length > 0) {
      body.keywords = keywords;
    }

    return request(
      this,
      'POST',
      `/devices/${device}/quickReplies`,
      body,
    );
  }

  // UPDATE QUICK REPLY
  if (operation === 'updateQuickReply') {
    const shortcut = this.getNodeParameter('shortcut', index) as string;
    const message = this.getNodeParameter('message', index) as string;
    const id = this.getNodeParameter('id', index, '') as string;
    const permission = this.getNodeParameter('permission', index, '') as string;
    const includeFile = this.getNodeParameter('includeFile', index, false) as boolean;
    const keywords = this.getNodeParameter('keywords', index, []) as string[];

    const body: {
      shortcut: string;
      message: string;
      id?: string;
      permission?: string;
      file?: string;
      keywords?: string[];
    } = {
      shortcut,
      message,
    };

    if (id) {
      body.id = id;
    }

    if (permission) {
      body.permission = permission;
    }

    if (includeFile) {
      const file = this.getNodeParameter('file', index) as string;
      body.file = file;
    }

    if (keywords && keywords.length > 0) {
      body.keywords = keywords;
    }

    return request(
      this,
      'PATCH',
      `/devices/${device}/quickReplies`,
      body,
    );
  }

  // DELETE QUICK REPLIES
  if (operation === 'deleteQuickReplies') {
    const deleteMethod = this.getNodeParameter('deleteMethod', index) as string;

    if (deleteMethod === 'all') {
      // Delete all quick replies
      return request(
        this,
        'DELETE',
        `/devices/${device}/quickReplies`,
        [{ all: true }],
      );
    } else {
      // Delete specific quick replies
      const deleteItems = this.getNodeParameter('deleteItems', index, { items: [] }) as {
        items: Array<{
          type: string;
          id?: string;
          shortcut?: string;
        }>;
      };

      if (!deleteItems.items || deleteItems.items.length === 0) {
        throw new Error('You must specify at least one item to delete');
      }

      const items = deleteItems.items.map(item => {
        if (item.type === 'id' && item.id) {
          return { id: item.id };
        } else if (item.type === 'shortcut' && item.shortcut) {
          return { shortcut: item.shortcut };
        }
        return null;
      }).filter(item => item !== null);

      if (items.length === 0) {
        throw new Error('Invalid delete items specified');
      }

      return request(
        this,
        'DELETE',
        `/devices/${device}/quickReplies`,
        items,
      );
    }
  }

  throw new Error(`The operation "${operation}" is not supported for quick replies!`);
}
