import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { request } from '../request';

export const meetingLinkProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['meeting-links'],
      },
    },
    options: [
      {
        name: 'Get Meeting Links',
        value: 'getMeetingLinks',
        description: 'Get active meeting links for a WhatsApp number',
      },
      {
        name: 'Create Meeting Link',
        value: 'createMeetingLink',
        description: 'Create a new WhatsApp meeting link for voice or video call',
      },
      {
        name: 'Delete Meeting Links',
        value: 'deleteMeetingLinks',
        description: 'Delete one or multiple meeting links',
      },
    ],
    default: 'getMeetingLinks',
  },
  {
    displayName: 'WhatsApp Number',
    name: 'deviceId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['meeting-links'],
      },
    },
    description: 'The ID of the WhatsApp number',
  },

  // GET MEETING LINKS OPTIONS
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['meeting-links'],
        operation: ['getMeetingLinks'],
      },
    },
    options: [
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Search links by URL, token or message',
      },
      {
        displayName: 'Created Before',
        name: 'before',
        type: 'dateTime',
        default: '',
        description: 'Filter links created before a specific date',
      },
      {
        displayName: 'Created After',
        name: 'after',
        type: 'dateTime',
        default: '',
        description: 'Filter links created after a specific date',
      },
      {
        displayName: 'Expires Before',
        name: 'expiresBefore',
        type: 'dateTime',
        default: '',
        description: 'Filter links that expire before a specific date',
      },
      {
        displayName: 'Expires After',
        name: 'expiresAfter',
        type: 'dateTime',
        default: '',
        description: 'Filter links that expire after a specific date',
      },
      {
        displayName: 'Link Type',
        name: 'kind',
        type: 'multiOptions',
        options: [
          {
            name: 'Voice',
            value: 'voice',
          },
          {
            name: 'Video',
            value: 'video',
          },
        ],
        default: [],
        description: 'Filter links by type (voice or video)',
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

  // CREATE MEETING LINK OPTIONS
  {
    displayName: 'Link Type',
    name: 'kind',
    type: 'options',
    required: true,
    default: 'voice',
    displayOptions: {
      show: {
        resource: ['meeting-links'],
        operation: ['createMeetingLink'],
      },
    },
    options: [
      {
        name: 'Voice Call',
        value: 'voice',
      },
      {
        name: 'Video Call',
        value: 'video',
      },
    ],
    description: 'Type of meeting link to create',
  },
  {
    displayName: 'Call Description',
    name: 'message',
    type: 'string',
    required: false,
    default: '',
    displayOptions: {
      show: {
        resource: ['meeting-links'],
        operation: ['createMeetingLink'],
      },
    },
    description: 'Optional message describing the purpose of the call (max 500 characters)',
  },
  {
    displayName: 'Expiration',
    name: 'expiration',
    type: 'options',
    required: false,
    default: '30d',
    displayOptions: {
      show: {
        resource: ['meeting-links'],
        operation: ['createMeetingLink'],
      },
    },
    options: [
      { name: '1 Hour', value: '1h' },
      { name: '2 Hours', value: '2h' },
      { name: '8 Hours', value: '8h' },
      { name: '12 Hours', value: '12h' },
      { name: '24 Hours', value: '24h' },
      { name: '2 Days', value: '2d' },
      { name: '3 Days', value: '3d' },
      { name: '4 Days', value: '4d' },
      { name: '5 Days', value: '5d' },
      { name: '6 Days', value: '6d' },
      { name: '7 Days', value: '7d' },
      { name: '15 Days', value: '15d' },
      { name: '30 Days', value: '30d' },
    ],
    description: 'When the meeting link will expire if not used',
  },

  // DELETE MEETING LINKS OPTIONS
  {
    displayName: 'Delete Method',
    name: 'deleteMethod',
    type: 'options',
    required: true,
    default: 'specific',
    displayOptions: {
      show: {
        resource: ['meeting-links'],
        operation: ['deleteMeetingLinks'],
      },
    },
    options: [
      {
        name: 'Delete All',
        value: 'all',
      },
      {
        name: 'Delete Specific Links',
        value: 'specific',
      },
      {
        name: 'Delete By Date Range',
        value: 'dateRange',
      },
    ],
    description: 'Method to use for deleting meeting links',
  },
  {
    displayName: 'Link IDs',
    name: 'ids',
    type: 'string',
    required: true,
    typeOptions: {
      multipleValues: true,
    },
    default: [],
    displayOptions: {
      show: {
        resource: ['meeting-links'],
        operation: ['deleteMeetingLinks'],
        deleteMethod: ['specific'],
      },
    },
    description: 'IDs of meeting links to delete',
  },
  {
    displayName: 'Link URLs',
    name: 'urls',
    type: 'string',
    required: false,
    typeOptions: {
      multipleValues: true,
    },
    default: [],
    displayOptions: {
      show: {
        resource: ['meeting-links'],
        operation: ['deleteMeetingLinks'],
        deleteMethod: ['specific'],
      },
    },
    description: 'URLs of meeting links to delete (e.g., https://call.whatsapp.com/voice/447362053576)',
  },
  {
    displayName: 'Date Filters',
    name: 'dateFilters',
    type: 'collection',
    placeholder: 'Add Date Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['meeting-links'],
        operation: ['deleteMeetingLinks'],
        deleteMethod: ['dateRange'],
      },
    },
    options: [
      {
        displayName: 'Created Before',
        name: 'createdBefore',
        type: 'dateTime',
        default: '',
        description: 'Delete links created before this date',
      },
      {
        displayName: 'Created After',
        name: 'createdAfter',
        type: 'dateTime',
        default: '',
        description: 'Delete links created after this date',
      },
      {
        displayName: 'Expires Before',
        name: 'expiresBefore',
        type: 'dateTime',
        default: '',
        description: 'Delete links that expire before this date',
      },
      {
        displayName: 'Expires After',
        name: 'expiresAfter',
        type: 'dateTime',
        default: '',
        description: 'Delete links that expire after this date',
      },
    ],
  },
];

export async function executeMeetingLinkOperations(
  this: IExecuteFunctions | any,
  index: number,
) {
  const operation = this.getNodeParameter('operation', index) as string;
  const deviceId = this.getNodeParameter('deviceId', index) as string;

  // GET MEETING LINKS
  if (operation === 'getMeetingLinks') {
    const filters = this.getNodeParameter('filters', index, {}) as {
      search?: string;
      before?: string;
      after?: string;
      expiresBefore?: string;
      expiresAfter?: string;
      kind?: string[];
      size?: number;
      page?: number;
    };

    const queryParameters: Record<string, string | string[]> = {};

    if (filters.search) queryParameters.search = filters.search;
    if (filters.before) queryParameters.before = filters.before;
    if (filters.after) queryParameters.after = filters.after;
    if (filters.expiresBefore) queryParameters.expiresBefore = filters.expiresBefore;
    if (filters.expiresAfter) queryParameters.expiresAfter = filters.expiresAfter;
    if (filters.kind && filters.kind.length > 0) queryParameters.kind = filters.kind;
    if (filters.size) queryParameters.size = filters.size.toString();
    if (filters.page !== undefined) queryParameters.page = filters.page.toString();

    return request(
      this,
      'GET',
      `/devices/${deviceId}/meeting-links`,
      undefined,
      queryParameters as Record<string, string>,
    );
  }

  // CREATE MEETING LINK
  if (operation === 'createMeetingLink') {
    const kind = this.getNodeParameter('kind', index) as string;
    const message = this.getNodeParameter('message', index, '') as string;
    const expiration = this.getNodeParameter('expiration', index, '30d') as string;

    const body: {
      kind: string;
      message?: string;
      expiration?: string;
    } = {
      kind,
    };

    if (message) {
      body.message = message;
    }

    if (expiration && expiration !== '30d') {
      body.expiration = expiration;
    }

    return request(
      this,
      'POST',
      `/devices/${deviceId}/meeting-links`,
      body,
    );
  }

  // DELETE MEETING LINKS
  if (operation === 'deleteMeetingLinks') {
    const deleteMethod = this.getNodeParameter('deleteMethod', index) as string;

    const body: {
      all?: boolean;
      ids?: string[];
      urls?: string[];
      createdBefore?: string;
      createdAfter?: string;
      expiresBefore?: string;
      expiresAfter?: string;
    } = {};

    if (deleteMethod === 'all') {
      body.all = true;
    } else if (deleteMethod === 'specific') {
      const ids = this.getNodeParameter('ids', index, []) as string[];
      const urls = this.getNodeParameter('urls', index, []) as string[];

      if (ids && ids.length > 0) {
        body.ids = ids;
      }

      if (urls && urls.length > 0) {
        body.urls = urls;
      }

      if (!body.ids && !body.urls) {
        throw new Error('You must specify at least one ID or URL to delete specific meeting links');
      }
    } else if (deleteMethod === 'dateRange') {
      const dateFilters = this.getNodeParameter('dateFilters', index, {}) as {
        createdBefore?: string;
        createdAfter?: string;
        expiresBefore?: string;
        expiresAfter?: string;
      };

      if (dateFilters.createdBefore) body.createdBefore = dateFilters.createdBefore;
      if (dateFilters.createdAfter) body.createdAfter = dateFilters.createdAfter;
      if (dateFilters.expiresBefore) body.expiresBefore = dateFilters.expiresBefore;
      if (dateFilters.expiresAfter) body.expiresAfter = dateFilters.expiresAfter;

      if (!body.createdBefore && !body.createdAfter && !body.expiresBefore && !body.expiresAfter) {
        throw new Error('You must specify at least one date filter when using the date range delete method');
      }
    }

    return request(
      this,
      'DELETE',
      `/devices/${deviceId}/meeting-links`,
      body,
    );
  }

  throw new Error(`The operation "${operation}" is not supported for meeting links!`);
}
