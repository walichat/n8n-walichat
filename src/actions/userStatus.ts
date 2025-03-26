import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { request } from '../request';

export const userStatusProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['user-status'],
      },
    },
    options: [
      {
        name: 'Get User Status',
        value: 'getUserStatus',
        description: 'Get user status stories',
      },
      {
        name: 'Get User Status by ID',
        value: 'getUserStatusById',
        description: 'Get a specific user status by ID',
      },
      {
        name: 'Update User Status',
        value: 'updateUserStatus',
        description: 'Publish a new WhatsApp Status',
      },
      {
        name: 'Delete User Status',
        value: 'deleteUserStatus',
        description: 'Delete user status stories',
      },
    ],
    default: 'getUserStatus',
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
        resource: ['user-status'],
      },
    },
    description: 'The ID of the WhatsApp number',
  },

  // GET USER STATUS BY ID OPTIONS
  {
    displayName: 'Status ID',
    name: 'statusId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['user-status'],
        operation: ['getUserStatusById'],
      },
    },
    description: 'The ID of the status (20-22 hexadecimal length value or 24-length hexadecimal value)',
  },

  // GET USER STATUS OPTIONS
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['user-status'],
        operation: ['getUserStatus'],
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
        displayName: 'My Status Only',
        name: 'mine',
        type: 'boolean',
        default: false,
        description: 'Return only statuses published by your own WhatsApp number',
      },
      {
        displayName: 'Scheduled Only',
        name: 'scheduled',
        type: 'boolean',
        default: false,
        description: 'Return only scheduled status to be published in the future',
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
        description: 'Filter status by WID (WhatsApp ID)',
      },
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Search status by partial text content, contact name or media filename',
      },
      {
        displayName: 'Chat ID',
        name: 'chat',
        type: 'string',
        default: '',
        description: 'Filter status by chat WhatsApp ID',
      },
      {
        displayName: 'Phone Number',
        name: 'phone',
        type: 'string',
        default: '',
        description: 'Return status sent from a given phone number or WhatsApp WID',
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
        displayName: 'Kind',
        name: 'kind',
        type: 'multiOptions',
        options: [
          { name: 'Text', value: 'text' },
          { name: 'Image', value: 'image' },
          { name: 'Video', value: 'video' },
        ],
        default: [],
        description: 'Filter message by entry kind',
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
    ],
  },

  // UPDATE USER STATUS OPTIONS
  {
    displayName: 'Content Type',
    name: 'contentType',
    type: 'options',
    required: true,
    default: 'text',
    displayOptions: {
      show: {
        resource: ['user-status'],
        operation: ['updateUserStatus'],
      },
    },
    options: [
      {
        name: 'Text',
        value: 'text',
      },
      {
        name: 'Media',
        value: 'media',
      },
    ],
    description: 'Type of content for the status update',
  },
  {
    displayName: 'Message',
    name: 'message',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['user-status'],
        operation: ['updateUserStatus'],
        contentType: ['text'],
      },
    },
    description: 'Text content of the status update (max 650 characters)',
  },
  {
    displayName: 'Font Style',
    name: 'font',
    type: 'options',
    required: false,
    default: 'helvetica',
    displayOptions: {
      show: {
        resource: ['user-status'],
        operation: ['updateUserStatus'],
        contentType: ['text'],
      },
    },
    options: [
      { name: 'Helvetica', value: 'helvetica' },
      { name: 'Serif', value: 'serif' },
      { name: 'Norican', value: 'norican' },
    ],
    description: 'Font style for the text status',
  },
  {
    displayName: 'Background Color',
    name: 'color',
    type: 'options',
    required: false,
    default: 'sky_blue',
    displayOptions: {
      show: {
        resource: ['user-status'],
        operation: ['updateUserStatus'],
        contentType: ['text'],
      },
    },
    options: [
      { name: 'Red Purple', value: 'red_purple' },
      { name: 'Moss Green', value: 'moss_green' },
      { name: 'Dark Khaki', value: 'dark_khaki' },
      { name: 'Wine Red', value: 'wine_red' },
      { name: 'Light Taupe', value: 'light_taupe' },
      { name: 'Goldenrod', value: 'goldenrod' },
      { name: 'Olive Green', value: 'olive_green' },
      { name: 'Light Plum', value: 'light_plum' },
      { name: 'Dark Purple', value: 'dark_purple' },
      { name: 'Light Coral', value: 'light_coral' },
      { name: 'Medium Sea Green', value: 'medium_sea_green' },
      { name: 'Salmon', value: 'salmon' },
      { name: 'Sky Blue', value: 'sky_blue' },
      { name: 'Light Sky Blue', value: 'light_sky_blue' },
      { name: 'Dark Taupe', value: 'dark_taupe' },
      { name: 'Slate Gray', value: 'slate_gray' },
      { name: 'Dodger Blue', value: 'dodger_blue' },
      { name: 'Dark Magenta', value: 'dark_magenta' },
      { name: 'Seafoam Green', value: 'seafoam_green' },
      { name: 'Charcoal', value: 'charcoal' },
      { name: 'Periwinkle', value: 'periwinkle' },
    ],
    description: 'Background color for the text status',
  },
  {
    displayName: 'Reference',
    name: 'reference',
    type: 'string',
    required: false,
    default: '',
    displayOptions: {
      show: {
        resource: ['user-status'],
        operation: ['updateUserStatus'],
      },
    },
    description: 'Optional user-defined reference for traceability (max 150 characters)',
  },

  // MEDIA OPTIONS
  {
    displayName: 'Media Source',
    name: 'mediaSource',
    type: 'options',
    required: true,
    default: 'url',
    displayOptions: {
      show: {
        resource: ['user-status'],
        operation: ['updateUserStatus'],
        contentType: ['media'],
      },
    },
    options: [
      {
        name: 'URL',
        value: 'url',
      },
      {
        name: 'File ID',
        value: 'file',
      },
    ],
    description: 'Source of the media file',
  },
  {
    displayName: 'File URL',
    name: 'url',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['user-status'],
        operation: ['updateUserStatus'],
        contentType: ['media'],
        mediaSource: ['url'],
      },
    },
    description: 'URL of the media file (image or video)',
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
        resource: ['user-status'],
        operation: ['updateUserStatus'],
        contentType: ['media'],
        mediaSource: ['file'],
      },
    },
    description: 'ID of the previously uploaded file',
  },
  {
    displayName: 'Caption',
    name: 'mediaMessage',
    type: 'string',
    required: false,
    default: '',
    displayOptions: {
      show: {
        resource: ['user-status'],
        operation: ['updateUserStatus'],
        contentType: ['media'],
      },
    },
    description: 'Optional caption for the media file',
  },
  {
    displayName: 'File Name',
    name: 'filename',
    type: 'string',
    required: false,
    default: '',
    displayOptions: {
      show: {
        resource: ['user-status'],
        operation: ['updateUserStatus'],
        contentType: ['media'],
      },
    },
    description: 'Optional filename for the media file',
  },
  {
    displayName: 'Format',
    name: 'format',
    type: 'options',
    required: false,
    default: 'native',
    displayOptions: {
      show: {
        resource: ['user-status'],
        operation: ['updateUserStatus'],
        contentType: ['media'],
      },
    },
    options: [
      { name: 'Native', value: 'native' },
      { name: 'GIF', value: 'gif' },
      { name: 'Voice Recording', value: 'ptt' },
    ],
    description: 'Format for displaying the media file',
  },

  // SCHEDULING OPTIONS
  {
    displayName: 'Schedule Status',
    name: 'scheduleStatus',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['user-status'],
        operation: ['updateUserStatus'],
      },
    },
    description: 'Whether to schedule the status for later publication',
  },
  {
    displayName: 'Schedule Type',
    name: 'scheduleType',
    type: 'options',
    required: true,
    default: 'delay',
    displayOptions: {
      show: {
        resource: ['user-status'],
        operation: ['updateUserStatus'],
        scheduleStatus: [true],
      },
    },
    options: [
      {
        name: 'Delay (Seconds)',
        value: 'delay',
      },
      {
        name: 'Delay (Time Notation)',
        value: 'delayTo',
      },
      {
        name: 'Specific Date/Time',
        value: 'date',
      },
    ],
    description: 'How to schedule the status',
  },
  {
    displayName: 'Delay (Seconds)',
    name: 'delay',
    type: 'number',
    required: true,
    default: 60,
    displayOptions: {
      show: {
        resource: ['user-status'],
        operation: ['updateUserStatus'],
        scheduleStatus: [true],
        scheduleType: ['delay'],
      },
    },
    description: 'Delay in seconds before publishing the status',
  },
  {
    displayName: 'Delay (Time Notation)',
    name: 'delayTo',
    type: 'options',
    required: true,
    default: '1h',
    displayOptions: {
      show: {
        resource: ['user-status'],
        operation: ['updateUserStatus'],
        scheduleStatus: [true],
        scheduleType: ['delayTo'],
      },
    },
    options: [
      { name: '15 Minutes', value: '15m' },
      { name: '30 Minutes', value: '30m' },
      { name: '1 Hour', value: '1h' },
      { name: '2 Hours', value: '2h' },
      { name: '6 Hours', value: '6h' },
      { name: '12 Hours', value: '12h' },
      { name: '1 Day', value: '1d' },
      { name: '2 Days', value: '2d' },
      { name: '3 Days', value: '3d' },
      { name: '1 Week', value: '1w' },
    ],
    description: 'Delay using time notation (e.g., 1h, 2d)',
  },
  {
    displayName: 'Date/Time',
    name: 'date',
    type: 'dateTime',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['user-status'],
        operation: ['updateUserStatus'],
        scheduleStatus: [true],
        scheduleType: ['date'],
      },
    },
    description: 'Specific date and time to publish the status',
  },

  // DELETE USER STATUS OPTIONS
  {
    displayName: 'Delete Method',
    name: 'deleteMethod',
    type: 'options',
    required: true,
    default: 'selective',
    displayOptions: {
      show: {
        resource: ['user-status'],
        operation: ['deleteUserStatus'],
      },
    },
    options: [
      {
        name: 'Delete All',
        value: 'all',
      },
      {
        name: 'Delete Scheduled Status',
        value: 'scheduled',
      },
      {
        name: 'Delete Specific Status',
        value: 'status',
      },
    ],
    description: 'Method to use for deleting status',
  },
  {
    displayName: 'Scheduled Status IDs',
    name: 'scheduled',
    type: 'string',
    typeOptions: {
      multipleValues: true,
    },
    required: true,
    default: [],
    displayOptions: {
      show: {
        resource: ['user-status'],
        operation: ['deleteUserStatus'],
        deleteMethod: ['scheduled'],
      },
    },
    description: 'IDs of scheduled status to delete (24-length hexadecimal values)',
  },
  {
    displayName: 'Status IDs',
    name: 'status',
    type: 'string',
    typeOptions: {
      multipleValues: true,
    },
    required: true,
    default: [],
    displayOptions: {
      show: {
        resource: ['user-status'],
        operation: ['deleteUserStatus'],
        deleteMethod: ['status'],
      },
    },
    description: 'WhatsApp IDs (WID) of status to delete',
  },
];

export async function executeUserStatusOperations(
  this: IExecuteFunctions | any,
  index: number,
) {
  const operation = this.getNodeParameter('operation', index) as string;
  const deviceId = this.getNodeParameter('deviceId', index) as string;

  // GET USER STATUS BY ID
  if (operation === 'getUserStatusById') {
    const statusId = this.getNodeParameter('statusId', index) as string;

    return request(
      this,
      'GET',
      `/chat/${deviceId}/status/${statusId}`,
    );
  }

  // GET USER STATUS
  if (operation === 'getUserStatus') {
    const filters = this.getNodeParameter('filters', index, {}) as {
      flow?: string;
      mine?: boolean;
      scheduled?: boolean;
      ack?: string[];
      wid?: string[];
      search?: string;
      chat?: string;
      phone?: string;
      type?: string[];
      reference?: string;
      kind?: string[];
      begin?: string;
      end?: string;
      after?: string;
      before?: string;
      sort?: string;
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

    return request(
      this,
      'GET',
      `/chat/${deviceId}/status`,
      undefined,
      queryParameters as Record<string, string>,
    );
  }

  // UPDATE USER STATUS
  if (operation === 'updateUserStatus') {
    const contentType = this.getNodeParameter('contentType', index) as string;
    const reference = this.getNodeParameter('reference', index, '') as string;
    const scheduleStatus = this.getNodeParameter('scheduleStatus', index, false) as boolean;

    const body: {
      message?: string;
      font?: string;
      color?: string;
      reference?: string;
      schedule?: {
        delay?: number;
        delayTo?: string;
        date?: string;
      };
      media?: {
        file?: string;
        url?: string;
        message?: string;
        filename?: string;
        format?: string;
      };
    } = {};

    // Add reference if provided
    if (reference) {
      body.reference = reference;
    }

    // Add scheduling if enabled
    if (scheduleStatus) {
      const scheduleType = this.getNodeParameter('scheduleType', index) as string;
      body.schedule = {};

      if (scheduleType === 'delay') {
        const delay = this.getNodeParameter('delay', index) as number;
        body.schedule.delay = delay;
      } else if (scheduleType === 'delayTo') {
        const delayTo = this.getNodeParameter('delayTo', index) as string;
        body.schedule.delayTo = delayTo;
      } else if (scheduleType === 'date') {
        const date = this.getNodeParameter('date', index) as string;
        body.schedule.date = date;
      }
    }

    // Add content based on type
    if (contentType === 'text') {
      const message = this.getNodeParameter('message', index) as string;
      const font = this.getNodeParameter('font', index, 'helvetica') as string;
      const color = this.getNodeParameter('color', index, 'sky_blue') as string;

      body.message = message;
      body.font = font;
      body.color = color;
    } else if (contentType === 'media') {
      const mediaSource = this.getNodeParameter('mediaSource', index) as string;
      const mediaMessage = this.getNodeParameter('mediaMessage', index, '') as string;
      const filename = this.getNodeParameter('filename', index, '') as string;
      const format = this.getNodeParameter('format', index, 'native') as string;

      body.media = {};

      if (mediaSource === 'url') {
        const url = this.getNodeParameter('url', index) as string;
        body.media.url = url;
      } else if (mediaSource === 'file') {
        const file = this.getNodeParameter('file', index) as string;
        body.media.file = file;
      }

      if (mediaMessage) {
        body.media.message = mediaMessage;
      }

      if (filename) {
        body.media.filename = filename;
      }

      if (format !== 'native') {
        body.media.format = format;
      }
    }

    return request(
      this,
      'POST',
      `/chat/${deviceId}/status`,
      body,
    );
  }

  // DELETE USER STATUS
  if (operation === 'deleteUserStatus') {
    const deleteMethod = this.getNodeParameter('deleteMethod', index) as string;

    const body: {
      all?: boolean;
      scheduled?: string[];
      status?: string[];
    } = {};

    if (deleteMethod === 'all') {
      body.all = true;
    } else if (deleteMethod === 'scheduled') {
      const scheduled = this.getNodeParameter('scheduled', index, []) as string[];
      body.scheduled = scheduled;
    } else if (deleteMethod === 'status') {
      const status = this.getNodeParameter('status', index, []) as string[];
      body.status = status;
    }

    return request(
      this,
      'DELETE',
      `/chat/${deviceId}/status`,
      body,
    );
  }

  throw new Error(`The operation "${operation}" is not supported for user status!`);
}
