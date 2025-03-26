import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { request } from '../request';

export const chatProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['chats'],
      },
    },
    options: [
      {
        name: 'Get Chats',
        value: 'getDeviceChats',
        description: 'Get a list of chats',
      },
      {
        name: 'Get Chat Details',
        value: 'getDeviceChatDetails',
        description: 'Get details of a specific chat',
      },
      {
        name: 'Send Typing Status',
        value: 'sendTypingStatus',
        description: 'Send typing or recording status on a chat',
      },
      {
        name: 'Sync Device Chats',
        value: 'syncDeviceChats',
        description: 'Synchronize device messages across chats',
      },
      {
        name: 'Sync Chat Messages',
        value: 'syncDeviceChatMessages',
        description: 'Synchronize messages of a specific chat',
      },
      {
        name: 'Update Chat Read Status',
        value: 'updateChatReadStatus',
        description: 'Mark a chat as read or unread',
      },
      {
        name: 'Set Chat Status',
        value: 'setChatStatus',
        description: 'Update chat internal status',
      },
      {
        name: 'Get Group Participants',
        value: 'getGroupParticipants',
        description: 'Get participants in a group chat',
      },
      {
        name: 'Assign Chat Agent',
        value: 'assignChatAgent',
        description: 'Assign chat to a team member or department',
      },
      {
        name: 'Unassign Chat Agent',
        value: 'unassignChatAgent',
        description: 'Unassign chat from team member or department',
      },
      {
        name: 'Create Chat Note',
        value: 'createChatNote',
        description: 'Create a private note in a chat',
      },
      {
        name: 'Delete Chat Note',
        value: 'deleteChatNote',
        description: 'Delete private chat notes',
      },
      {
        name: 'Update Chat Labels',
        value: 'updateChatLabels',
        description: 'Set, update, or remove labels on a chat',
      },
      {
        name: 'Update Chat Attributes',
        value: 'updateChatMeta',
        description: 'Update chat attributes like muted or pinned',
      },
      {
        name: 'Archive Chat',
        value: 'archiveChat',
        description: 'Archive a chat',
      },
      {
        name: 'Unarchive Chat',
        value: 'unarchiveChat',
        description: 'Unarchive a chat',
      },
      {
        name: 'Delete Chat',
        value: 'deleteDeviceChat',
        description: 'Delete a chat',
      },
      {
        name: 'Bulk Update Chats',
        value: 'bulkChatsUpdate',
        description: 'Update multiple chats in bulk',
      },
    ],
    default: 'getDeviceChats',
  },
  {
    displayName: 'WhatsApp Number',
    name: 'deviceId',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getDevices',
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['chats'],
      },
    },
    description: 'The ID of the WhatsApp number',
  },

  // CHAT ID PARAMETER FOR SINGLE CHAT OPERATIONS
  {
    displayName: 'Chat ID',
    name: 'chatId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: [
          'getDeviceChatDetails',
          'syncDeviceChatMessages',
          'updateChatReadStatus',
          'setChatStatus',
          'getGroupParticipants',
          'assignChatAgent',
          'unassignChatAgent',
          'createChatNote',
          'deleteChatNote',
          'updateChatLabels',
          'updateChatMeta',
          'archiveChat',
          'unarchiveChat',
          'deleteDeviceChat'
        ],
      },
    },
    description: 'The ID of the chat (e.g., 447362053576@c.us for a user, 44736205357600000000@g.us for a group)',
  },

  // GET CHATS FILTERS
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['getDeviceChats'],
      },
    },
    options: [
      {
        displayName: 'Status',
        name: 'status',
        type: 'multiOptions',
        options: [
          { name: 'Pending', value: 'pending' },
          { name: 'Active', value: 'active' },
          { name: 'Resolved', value: 'resolved' },
        ],
        default: [],
        description: 'Filter chats by status',
      },
      {
        displayName: 'Unread Only',
        name: 'unread',
        type: 'boolean',
        default: false,
        description: 'Filter chats with unread messages',
      },
      {
        displayName: 'Active Chats Only',
        name: 'active',
        type: 'boolean',
        default: false,
        description: 'Filter only active chats/groups/channels',
      },
      {
        displayName: 'Can Send Messages',
        name: 'canSend',
        type: 'boolean',
        default: false,
        description: 'Filter chats that can receive messages',
      },
      {
        displayName: 'Read-Only Chats',
        name: 'readOnly',
        type: 'boolean',
        default: false,
        description: 'Filter read-only chats that cannot accept messages',
      },
      {
        displayName: 'Chat Type',
        name: 'type',
        type: 'multiOptions',
        options: [
          { name: 'User', value: 'user' },
          { name: 'Group', value: 'group' },
          { name: 'Channel', value: 'channel' },
        ],
        default: [],
        description: 'Filter chats by type',
      },
      {
        displayName: 'Assigned Agent IDs',
        name: 'agent',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Filter chats assigned to specific agents',
      },
      {
        displayName: 'Search Term',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Search chats by text that matches in phone number, name, etc.',
      },
      {
        displayName: 'Labels',
        name: 'labels',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Filter chats by labels. Use * to include any labeled chat.',
      },
      {
        displayName: 'Exclude Labels',
        name: 'labelsExclude',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Exclude chats with specific labels. Use * to exclude any labeled chat.',
      },
      {
        displayName: 'Include Items',
        name: 'include',
        type: 'multiOptions',
        options: [
          { name: 'Messages', value: 'messages' },
          { name: 'Notes', value: 'notes' },
          { name: 'Participants', value: 'participants' },
        ],
        default: [],
        description: 'Include related data in the response',
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
        displayName: 'Sort',
        name: 'sort',
        type: 'options',
        options: [
          { name: 'Most Recent First', value: 'lastMessageAt:desc' },
          { name: 'Oldest First', value: 'lastMessageAt:asc' },
          { name: 'Unread First', value: 'unreadCount:desc' },
          { name: 'Name A-Z', value: 'name:asc' },
          { name: 'Name Z-A', value: 'name:desc' },
        ],
        default: 'lastMessageAt:desc',
        description: 'Sort order for results',
      },
    ],
  },

  // GET CHAT DETAILS OPTIONS
  {
    displayName: 'Include Items',
    name: 'include',
    type: 'multiOptions',
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['getDeviceChatDetails'],
      },
    },
    options: [
      { name: 'Messages', value: 'messages' },
      { name: 'Notes', value: 'notes' },
      { name: 'Participants', value: 'participants' },
    ],
    default: [],
    description: 'Include related data in the response',
  },

  // SEND TYPING STATUS OPTIONS
  {
    displayName: 'Action',
    name: 'action',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['sendTypingStatus'],
      },
    },
    options: [
      { name: 'Typing', value: 'typing' },
      { name: 'Recording', value: 'recording' },
      { name: 'Stop', value: 'stop' },
    ],
    default: 'typing',
    description: 'Type of status to send',
  },
  {
    displayName: 'Duration (seconds)',
    name: 'duration',
    type: 'number',
    typeOptions: {
      minValue: 2,
      maxValue: 30,
    },
    required: false,
    default: 2,
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['sendTypingStatus'],
      },
    },
    description: 'Duration in seconds for the typing status (2-30 seconds)',
  },
  {
    displayName: 'Target Type',
    name: 'targetType',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['sendTypingStatus'],
      },
    },
    options: [
      { name: 'User Chat', value: 'chat' },
      { name: 'Group Chat', value: 'group' },
    ],
    default: 'chat',
    description: 'Type of chat to send the typing status to',
  },
  {
    displayName: 'User Phone Number',
    name: 'chat',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['sendTypingStatus'],
        targetType: ['chat'],
      },
    },
    description: 'Phone number in E.164 format (e.g., +447362053576)',
  },
  {
    displayName: 'Group ID',
    name: 'group',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getGroups',
      loadOptionsDependsOn: ['device', 'targetType'],
      loadOptionsParameters: {
        target: 'group',
      },
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['sendTypingStatus'],
        targetType: ['group'],
      },
    },
    description: 'Group chat ID (e.g., 44736205357600000000@g.us)',
  },

  // SYNC DEVICE CHATS OPTIONS
  {
    displayName: 'Maximum Chats',
    name: 'size',
    type: 'number',
    default: 50,
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['syncDeviceChats'],
      },
    },
    description: 'Maximum recent chats to sync',
  },
  {
    displayName: 'Maximum Messages Per Chat',
    name: 'messages',
    type: 'number',
    default: 50,
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['syncDeviceChats'],
      },
    },
    description: 'Maximum messages to sync per chat',
  },

  // SYNC CHAT MESSAGES OPTIONS
  {
    displayName: 'Maximum Messages',
    name: 'size',
    type: 'number',
    default: 50,
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['syncDeviceChatMessages'],
      },
    },
    description: 'Maximum recent messages to sync in the chat',
  },
  {
    displayName: 'Page Number',
    name: 'page',
    type: 'number',
    default: 0,
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['syncDeviceChatMessages'],
      },
    },
    description: 'Page number (starting from 0)',
  },

  // UPDATE CHAT READ STATUS OPTIONS
  {
    displayName: 'Unread Status',
    name: 'unread',
    type: 'boolean',
    required: true,
    default: false,
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['updateChatReadStatus'],
      },
    },
    description: 'Whether to mark the chat as unread or read',
  },

  // SET CHAT STATUS OPTIONS
  {
    displayName: 'Status',
    name: 'status',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['setChatStatus'],
      },
    },
    options: [
      { name: 'Active', value: 'active' },
      { name: 'Pending', value: 'pending' },
      { name: 'Resolved', value: 'resolved' },
      { name: 'Archived', value: 'archived' },
      { name: 'Removed', value: 'removed' },
    ],
    default: 'active',
    description: 'Chat internal status',
  },

  // GET GROUP PARTICIPANTS OPTIONS
  {
    displayName: 'Filters',
    name: 'participantFilters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['getGroupParticipants'],
      },
    },
    options: [
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Search participants by name, phone number, WhatsApp ID',
      },
      {
        displayName: 'Phone Numbers',
        name: 'phone',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Filter participants by phone number',
      },
      {
        displayName: 'Role',
        name: 'role',
        type: 'multiOptions',
        options: [
          { name: 'Admin', value: 'admin' },
          { name: 'Owner', value: 'owner' },
          { name: 'Participant', value: 'participant' },
        ],
        default: [],
        description: 'Filter participants by role',
      },
      {
        displayName: 'Only Contacts',
        name: 'contact',
        type: 'boolean',
        default: false,
        description: 'Filter only participants that are contacts in the WhatsApp agenda',
      },
      {
        displayName: 'Include Contact Info',
        name: 'include',
        type: 'multiOptions',
        options: [
          { name: 'Contact', value: 'contact' },
        ],
        default: [],
        description: 'Include participant contact information if available',
      },
      {
        displayName: 'Results Page Size',
        name: 'size',
        type: 'number',
        default: 20,
        description: 'Maximum results per page',
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

  // ASSIGN CHAT AGENT OPTIONS
  {
    displayName: 'Assignment Type',
    name: 'assignmentType',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['assignChatAgent'],
      },
    },
    options: [
      { name: 'Agent ID', value: 'agent' },
      { name: 'Agent Email', value: 'email' },
      { name: 'Department', value: 'department' },
      { name: 'Agent and Department', value: 'both' },
    ],
    default: 'agent',
    description: 'How to assign the chat',
  },
  {
    displayName: 'Agent ID',
    name: 'agent',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getTeamAgents',
      loadOptionsDependsOn: ['device'],
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['assignChatAgent'],
        assignmentType: ['agent', 'both'],
      },
    },
    description: 'ID of the agent to assign the chat to',
  },
  {
    displayName: 'Agent Email',
    name: 'email',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['assignChatAgent'],
        assignmentType: ['email'],
      },
    },
    description: 'Email of the agent to assign the chat to',
  },
  {
    displayName: 'Department ID',
    name: 'department',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getDepartments',
      loadOptionsDependsOn: ['device'],
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['assignChatAgent'],
        assignmentType: ['department', 'both'],
      },
    },
    description: 'ID of the department to assign the chat to',
  },

  // CREATE CHAT NOTE OPTIONS
  {
    displayName: 'Note Message',
    name: 'message',
    type: 'string',
    typeOptions: {
      rows: 4,
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['createChatNote'],
      },
    },
    description: 'Text content of the note (2-6000 characters). WhatsApp rich text syntax allowed.',
  },
  {
    displayName: 'Advanced Options',
    name: 'noteAdvancedOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['createChatNote'],
      },
    },
    options: [
      {
        displayName: 'Quote Message ID',
        name: 'quote',
        type: 'string',
        default: '',
        description: 'Optional message or note ID to quote',
      },
      {
        displayName: 'Author ID',
        name: 'author',
        type: 'string',
        default: '',
        description: 'Optional author user ID that creates the note',
      },
    ],
  },

  // DELETE CHAT NOTE OPTIONS
  {
    displayName: 'Note IDs',
    name: 'ids',
    type: 'string',
    typeOptions: {
      multipleValues: true,
    },
    required: true,
    default: [],
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['deleteChatNote'],
      },
    },
    description: 'IDs of the notes to delete',
  },

  // UPDATE CHAT LABELS OPTIONS
  {
    displayName: 'Labels',
    name: 'labels',
    type: 'string',
    typeOptions: {
      multipleValues: true,
    },
    required: true,
    default: [],
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['updateChatLabels'],
      },
    },
    description: 'Labels to set on the chat',
  },
  {
    displayName: 'Update Type',
    name: 'updateType',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['updateChatLabels'],
      },
    },
    options: [
      { name: 'Replace All', value: 'replace' },
      { name: 'Add/Update (Upsert)', value: 'upsert' },
      { name: 'Remove Only', value: 'remove' },
    ],
    default: 'replace',
    description: 'How to update the labels',
  },

  // UPDATE CHAT ATTRIBUTES OPTIONS
  {
    displayName: 'Attributes',
    name: 'attributes',
    type: 'collection',
    placeholder: 'Add Attribute',
    default: {},
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['updateChatMeta'],
      },
    },
    options: [
      {
        displayName: 'Pinned',
        name: 'pinned',
        type: 'boolean',
        default: false,
        description: 'Whether to pin or unpin the chat',
      },
      {
        displayName: 'Muted',
        name: 'muted',
        type: 'boolean',
        default: false,
        description: 'Whether to mute or unmute the chat',
      },
    ],
  },

  // DELETE CHAT OPTIONS
  {
    displayName: 'Delete from WhatsApp',
    name: 'whatsapp',
    type: 'boolean',
    required: false,
    default: false,
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['deleteDeviceChat'],
      },
    },
    description: 'Whether to delete the chat on WhatsApp app as well',
  },
  {
    displayName: 'Force Delete',
    name: 'force',
    type: 'boolean',
    required: false,
    default: false,
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['deleteDeviceChat'],
        whatsapp: [true],
      },
    },
    description: 'Force flag chat as removed when deletion on WhatsApp fails',
  },

  // BULK UPDATE CHATS OPTIONS
  {
    displayName: 'Action',
    name: 'action',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['bulkChatsUpdate'],
      },
    },
    options: [
      { name: 'Resolve', value: 'resolve' },
      { name: 'Unresolve', value: 'unresolve' },
      { name: 'Pin', value: 'pin' },
      { name: 'Unpin', value: 'unpin' },
      { name: 'Mute', value: 'mute' },
      { name: 'Unmute', value: 'unmute' },
      { name: 'Assign', value: 'assign' },
      { name: 'Unassign', value: 'unassign' },
      { name: 'Block', value: 'block' },
      { name: 'Unblock', value: 'unblock' },
      { name: 'Read', value: 'read' },
      { name: 'Unread', value: 'unread' },
      { name: 'Labels', value: 'labels' },
    ],
    default: 'resolve',
    description: 'Action to perform on the chats',
  },
  {
    displayName: 'Chat IDs/Phone Numbers',
    name: 'chats',
    type: 'string',
    typeOptions: {
      multipleValues: true,
    },
    required: true,
    default: [],
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['bulkChatsUpdate'],
      },
    },
    description: 'List of chat IDs or phone numbers to update (e.g., +447362053576, 447362053576@c.us)',
  },
  {
    displayName: 'Labels to Add',
    name: 'addLabels',
    type: 'string',
    typeOptions: {
      multipleValues: true,
    },
    required: true,
    default: [],
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['bulkChatsUpdate'],
        action: ['labels'],
      },
    },
    description: 'Labels to add to the chats',
  },
  {
    displayName: 'Labels to Remove',
    name: 'removeLabels',
    type: 'string',
    typeOptions: {
      multipleValues: true,
    },
    required: false,
    default: [],
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['bulkChatsUpdate'],
        action: ['labels'],
      },
    },
    description: 'Labels to remove from the chats',
  },
  {
    displayName: 'Agent ID',
    name: 'agent',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getTeamAgents',
      loadOptionsDependsOn: ['deviceId'],
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['bulkChatsUpdate'],
        action: ['assign'],
      },
    },
    description: 'Agent ID to assign the chats to',
  },
  {
    displayName: 'Department ID',
    name: 'department',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getDepartments',
      loadOptionsDependsOn: ['deviceId'],
    },
    required: false,
    default: '',
    displayOptions: {
      show: {
        resource: ['chats'],
        operation: ['bulkChatsUpdate'],
        action: ['assign'],
      },
    },
    description: 'Optional department ID to assign the chats to',
  },
];

export async function executeChatOperations(
  this: IExecuteFunctions | any,
  index: number,
) {
  const operation = this.getNodeParameter('operation', index) as string;
  const deviceId = this.getNodeParameter('deviceId', index) as string;

  // GET DEVICE CHATS
  if (operation === 'getDeviceChats') {
    const filters = this.getNodeParameter('filters', index, {}) as {
      status?: string[];
      unread?: boolean;
      active?: boolean;
      canSend?: boolean;
      readOnly?: boolean;
      type?: string[];
      agent?: string[];
      search?: string;
      labels?: string[];
      labelsExclude?: string[];
      include?: string[];
      size?: number;
      page?: number;
      sort?: string;
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
      `/chat/${deviceId}/chats`,
      undefined,
      queryParameters as Record<string, string>,
    );
  }

  // GET DEVICE CHAT DETAILS
  if (operation === 'getDeviceChatDetails') {
    const chatId = this.getNodeParameter('chatId', index) as string;
    const include = this.getNodeParameter('include', index, []) as string[];

    const queryParameters: Record<string, string[]> = {};
    if (include && include.length > 0) {
      queryParameters.include = include;
    }

    // Convert array values to comma-separated strings
    const stringifiedQueryParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(queryParameters)) {
      if (Array.isArray(value)) {
        stringifiedQueryParams[key] = value.join(',');
      } else {
        stringifiedQueryParams[key] = value as string;
      }
    }

    return request(
      this,
      'GET',
      `/chat/${deviceId}/chats/${chatId}`,
      undefined,
      stringifiedQueryParams,
    );
  }

  // SEND TYPING STATUS
  if (operation === 'sendTypingStatus') {
    const action = this.getNodeParameter('action', index) as string;
    const duration = this.getNodeParameter('duration', index, 2) as number;
    const targetType = this.getNodeParameter('targetType', index) as string;

    const body: {
      action: string;
      duration?: number;
      chat?: string;
      group?: string;
    } = {
      action,
    };

    if (duration !== 2) {
      body.duration = duration;
    }

    if (targetType === 'chat') {
      const chat = this.getNodeParameter('chat', index) as string;
      body.chat = chat;
    } else if (targetType === 'group') {
      const group = this.getNodeParameter('group', index) as string;
      body.group = group;
    }

    return request(
      this,
      'POST',
      `/chat/${deviceId}/typing`,
      body,
    );
  }

  // SYNC DEVICE CHATS
  if (operation === 'syncDeviceChats') {
    const size = this.getNodeParameter('size', index, 50) as number;
    const messages = this.getNodeParameter('messages', index, 50) as number;

    const queryParameters: Record<string, string> = {};
    if (size !== 50) queryParameters.size = size.toString();
    if (messages !== 50) queryParameters.messages = messages.toString();

    return request(
      this,
      'POST',
      `/chat/${deviceId}/sync`,
      undefined,
      queryParameters,
    );
  }

  // SYNC DEVICE CHAT MESSAGES
  if (operation === 'syncDeviceChatMessages') {
    const chatId = this.getNodeParameter('chatId', index) as string;
    const size = this.getNodeParameter('size', index, 50) as number;
    const page = this.getNodeParameter('page', index, 0) as number;

    const queryParameters: Record<string, string> = {};
    if (size !== 50) queryParameters.size = size.toString();
    if (page !== 0) queryParameters.page = page.toString();

    return request(
      this,
      'GET',
      `/chat/${deviceId}/chats/${chatId}/sync`,
      undefined,
      queryParameters,
    );
  }

  // UPDATE CHAT READ STATUS
  if (operation === 'updateChatReadStatus') {
    const chatId = this.getNodeParameter('chatId', index) as string;
    const unread = this.getNodeParameter('unread', index) as boolean;

    return request(
      this,
      'PATCH',
      `/chat/${deviceId}/chats/${chatId}/unread`,
      { unread },
    );
  }

  // SET CHAT STATUS
  if (operation === 'setChatStatus') {
    const chatId = this.getNodeParameter('chatId', index) as string;
    const status = this.getNodeParameter('status', index) as string;

    return request(
      this,
      'PATCH',
      `/chat/${deviceId}/chats/${chatId}/status`,
      { status },
    );
  }

  // GET GROUP PARTICIPANTS
  if (operation === 'getGroupParticipants') {
    const chatId = this.getNodeParameter('chatId', index) as string;
    const filters = this.getNodeParameter('participantFilters', index, {}) as {
      search?: string;
      phone?: string[];
      role?: string[];
      contact?: boolean;
      include?: string[];
      size?: number;
      page?: number;
    };

    const queryParameters: Record<string, string | string[] | boolean | number> = {};

    // Add all filters to query parameters
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== '' &&
          (typeof value !== 'object' || (Array.isArray(value) && value.length > 0))) {
        queryParameters[key] = value;
      }
    }

    // Convert complex query parameter types to strings
    const stringifiedQueryParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(queryParameters)) {
      if (Array.isArray(value)) {
        stringifiedQueryParams[key] = value.join(',');
      } else if (typeof value === 'boolean' || typeof value === 'number') {
        stringifiedQueryParams[key] = value.toString();
      } else {
        stringifiedQueryParams[key] = value as string;
      }
    }

    return request(
      this,
      'GET',
      `/chat/${deviceId}/chats/${chatId}/participants`,
      undefined,
      stringifiedQueryParams,
    );
  }

  // ASSIGN CHAT AGENT
  if (operation === 'assignChatAgent') {
    const chatId = this.getNodeParameter('chatId', index) as string;
    const assignmentType = this.getNodeParameter('assignmentType', index) as string;

    const body: {
      agent?: string;
      email?: string;
      department?: string;
    } = {};

    if (assignmentType === 'agent' || assignmentType === 'both') {
      const agent = this.getNodeParameter('agent', index) as string;
      body.agent = agent;
    }

    if (assignmentType === 'email') {
      const email = this.getNodeParameter('email', index) as string;
      body.email = email;
    }

    if (assignmentType === 'department' || assignmentType === 'both') {
      const department = this.getNodeParameter('department', index) as string;
      body.department = department;
    }

    return request(
      this,
      'PATCH',
      `/chat/${deviceId}/chats/${chatId}/owner`,
      body,
    );
  }

  // UNASSIGN CHAT AGENT
  if (operation === 'unassignChatAgent') {
    const chatId = this.getNodeParameter('chatId', index) as string;

    return request(
      this,
      'DELETE',
      `/chat/${deviceId}/chats/${chatId}/owner`,
    );
  }

  // CREATE CHAT NOTE
  if (operation === 'createChatNote') {
    const chatId = this.getNodeParameter('chatId', index) as string;
    const message = this.getNodeParameter('message', index) as string;
    const advancedOptions = this.getNodeParameter('noteAdvancedOptions', index, {}) as {
      quote?: string;
      author?: string;
    };

    const body: {
      message: string;
      quote?: string;
      author?: string;
    } = {
      message,
    };

    if (advancedOptions.quote) body.quote = advancedOptions.quote;
    if (advancedOptions.author) body.author = advancedOptions.author;

    return request(
      this,
      'POST',
      `/chat/${deviceId}/chats/${chatId}/notes`,
      body,
    );
  }

  // DELETE CHAT NOTE
  if (operation === 'deleteChatNote') {
    const chatId = this.getNodeParameter('chatId', index) as string;
    const ids = this.getNodeParameter('ids', index, []) as string[];

    return request(
      this,
      'DELETE',
      `/chat/${deviceId}/chats/${chatId}/notes`,
      { ids },
    );
  }

  // UPDATE CHAT LABELS
  if (operation === 'updateChatLabels') {
    const chatId = this.getNodeParameter('chatId', index) as string;
    const labels = this.getNodeParameter('labels', index, []) as string[];
    const updateType = this.getNodeParameter('updateType', index) as string;

    const queryParameters: Record<string, string> = {};

    if (updateType === 'upsert') {
      queryParameters.upsert = 'true';
    } else if (updateType === 'remove') {
      queryParameters.remove = 'true';
    }

    return request(
      this,
      'PATCH',
      `/chat/${deviceId}/chats/${chatId}/labels`,
      labels,
      queryParameters,
    );
  }

  // UPDATE CHAT META ATTRIBUTES
  if (operation === 'updateChatMeta') {
    const chatId = this.getNodeParameter('chatId', index) as string;
    const attributes = this.getNodeParameter('attributes', index, {}) as {
      pinned?: boolean;
      muted?: boolean;
    };

    const body: {
      pinned?: boolean;
      muted?: boolean;
    } = {};

    if (attributes.pinned !== undefined) body.pinned = attributes.pinned;
    if (attributes.muted !== undefined) body.muted = attributes.muted;

    return request(
      this,
      'PATCH',
      `/chat/${deviceId}/chats/${chatId}/attributes`,
      body,
    );
  }

  // ARCHIVE CHAT
  if (operation === 'archiveChat') {
    const chatId = this.getNodeParameter('chatId', index) as string;

    return request(
      this,
      'PUT',
      `/chat/${deviceId}/chats/${chatId}/archive`,
    );
  }

  // UNARCHIVE CHAT
  if (operation === 'unarchiveChat') {
    const chatId = this.getNodeParameter('chatId', index) as string;

    return request(
      this,
      'DELETE',
      `/chat/${deviceId}/chats/${chatId}/archive`,
    );
  }

  // DELETE DEVICE CHAT
  if (operation === 'deleteDeviceChat') {
    const chatId = this.getNodeParameter('chatId', index) as string;
    const whatsapp = this.getNodeParameter('whatsapp', index, false) as boolean;
    const force = whatsapp ? this.getNodeParameter('force', index, false) as boolean : false;

    const body: {
      whatsapp?: boolean;
      force?: boolean;
    } = {};

    if (whatsapp) {
      body.whatsapp = true;
      if (force) body.force = true;
    }

    return request(
      this,
      'DELETE',
      `/chat/${deviceId}/chats/${chatId}`,
      Object.keys(body).length > 0 ? body : undefined,
    );
  }

  // BULK UPDATE CHATS
  if (operation === 'bulkChatsUpdate') {
    const action = this.getNodeParameter('action', index) as string;
    const chats = this.getNodeParameter('chats', index, []) as string[];

    const body: {
      action: string;
      chats: string[];
      params?: {
        add?: string[];
        remove?: string[];
        agent?: string;
        department?: string;
      };
    } = {
      action,
      chats,
    };

    if (action === 'labels') {
      const addLabels = this.getNodeParameter('addLabels', index, []) as string[];
      const removeLabels = this.getNodeParameter('removeLabels', index, []) as string[];

      body.params = {
        add: addLabels,
      };

      if (removeLabels.length > 0) {
        body.params.remove = removeLabels;
      }
    } else if (action === 'assign') {
      const agent = this.getNodeParameter('agent', index) as string;
      const department = this.getNodeParameter('department', index, '') as string;

      body.params = {
        agent,
      };

      if (department) {
        body.params.department = department;
      }
    }

    return request(
      this,
      'PATCH',
      `/chat/${deviceId}/chats`,
      body,
    );
  }

  throw new Error(`The operation "${operation}" is not supported for chats!`);
}
