import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { request } from '../request';

export const chatFileProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['chat-files'],
      },
    },
    options: [
      {
        name: 'Get Files',
        value: 'getDeviceFiles',
        description: 'Search and retrieve files from the current device',
      },
      {
        name: 'Get File Details',
        value: 'getDeviceFileDetails',
        description: 'Get detailed information about a specific file',
      },
      {
        name: 'Download File',
        value: 'downloadDeviceFileDetails',
        description: 'Download file contents by ID',
      },
    ],
    default: 'getDeviceFiles',
  },
  {
    displayName: 'WhatsApp Number',
    name: 'device',
    type: 'string',
    required: true,
    default: '',
    typeOptions: {
      loadOptionsMethod: 'getDevices',
    },
    displayOptions: {
      show: {
        resource: ['chat-files'],
      },
    },
    description: 'The ID of the WhatsApp number',
  },

  // FILE ID PARAMETER FOR SINGLE FILE OPERATIONS
  {
    displayName: 'File ID',
    name: 'fileId',
    type: 'string',
    required: true,
    default: '',
    typeOptions: {
      loadOptionsMethod: 'getFiles',
    },
    displayOptions: {
      show: {
        resource: ['chat-files'],
        operation: ['getDeviceFileDetails', 'downloadDeviceFileDetails'],
      },
    },
    description: 'The ID of the file',
  },

  // GET FILES FILTERS
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['chat-files'],
        operation: ['getDeviceFiles'],
      },
    },
    options: [
      {
        displayName: 'File Type',
        name: 'type',
        type: 'multiOptions',
        options: [
          { name: 'Image', value: 'image' },
          { name: 'Video', value: 'video' },
          { name: 'Audio', value: 'audio' },
          { name: 'Voice', value: 'ptt' },
          { name: 'Document', value: 'document' },
          { name: 'Sticker', value: 'sticker' },
        ],
        default: [],
        description: 'Filter files by media type',
      },
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Search files by filename, caption, message ID or chat ID',
      },
      {
        displayName: 'Chat IDs',
        name: 'chat',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Filter files by chat WhatsApp IDs. E.g., 447362053576@c.us',
      },
      {
        displayName: 'File IDs',
        name: 'ids',
        type: 'string',
        typeOptions: {
          multipleValues: true,
          loadOptionsMethod: 'getFiles',
        },
        default: [],
        description: 'Filter files by IDs',
      },
      {
        displayName: 'Message IDs',
        name: 'message',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Filter files by origin message WhatsApp IDs',
      },
      {
        displayName: 'Flow',
        name: 'flow',
        type: 'options',
        options: [
          { name: 'Inbound', value: 'in' },
          { name: 'Outbound', value: 'out' },
        ],
        default: '',
        description: 'Filter media message flow that contains the file',
      },
      {
        displayName: 'Created After',
        name: 'after',
        type: 'dateTime',
        default: '',
        description: 'Files created after the given date',
      },
      {
        displayName: 'Created Before',
        name: 'before',
        type: 'dateTime',
        default: '',
        description: 'Files created before the given date',
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
          { name: 'Recent First', value: 'date:desc' },
          { name: 'Oldest First', value: 'date:asc' },
          { name: 'Largest First', value: 'size:desc' },
          { name: 'Smallest First', value: 'size:asc' },
        ],
        default: 'date:desc',
        description: 'Files sorting criteria',
      },
    ],
  },
];

export async function executeChatFileOperations(
  this: IExecuteFunctions | any,
  index: number,
) {
  const operation = this.getNodeParameter('operation', index) as string;
  const device = this.getNodeParameter('device', index) as string;

  // GET DEVICE FILES
  if (operation === 'getDeviceFiles') {
    const filters = this.getNodeParameter('filters', index, {}) as {
      type?: string[];
      search?: string;
      chat?: string[];
      ids?: string[];
      message?: string[];
      flow?: string;
      after?: string;
      before?: string;
      size?: number;
      page?: number;
      sort?: string;
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
      `/chat/${device}/files`,
      undefined,
      queryParameters as Record<string, string>,
    );
  }

  // GET DEVICE FILE DETAILS
  if (operation === 'getDeviceFileDetails') {
    const fileId = this.getNodeParameter('fileId', index) as string;

    return request(
      this,
      'GET',
      `/chat/${device}/files/${fileId}`,
    );
  }

  // DOWNLOAD DEVICE FILE
  if (operation === 'downloadDeviceFileDetails') {
    const fileId = this.getNodeParameter('fileId', index) as string;

    // For file downloads, we might need to handle binary data differently
    // Set Accept header to handle binary data
    const customHeaders = {
      'Accept': '*/*',
    };

    return request(
      this,
      'GET',
      `/chat/${device}/files/${fileId}/download`,
      undefined,
      undefined,
      customHeaders,
    );
  }

  throw new Error(`The operation "${operation}" is not supported for chat files!`);
}
