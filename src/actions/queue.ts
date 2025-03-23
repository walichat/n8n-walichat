import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { request } from '../request';

export const queueProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['queue'],
      },
    },
    options: [
      {
        name: 'Get Queue Status',
        value: 'getQueueStatus',
        description: 'Get WhatsApp number queue messages stats information',
      },
      {
        name: 'Set Queue Status',
        value: 'setQueueStatus',
        description: 'Update WhatsApp number queue processing status',
      },
      {
        name: 'Route Queue',
        value: 'routeQueue',
        description: 'Re-route queued messages to a different WhatsApp number',
      },
      {
        name: 'Empty Queue',
        value: 'emptyQueue',
        description: 'Remove all or specific queued messages',
      },
    ],
    default: 'getQueueStatus',
  },
  {
    displayName: 'WhatsApp Number',
    name: 'deviceId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['queue'],
      },
    },
    description: 'The ID of the WhatsApp number',
  },

  // SET QUEUE STATUS OPTIONS
  {
    displayName: 'Status',
    name: 'status',
    type: 'options',
    required: true,
    options: [
      { name: 'Active', value: 'active', description: 'Deliver messages and accept new messages' },
      { name: 'Pause', value: 'pause', description: 'Do not deliver messages but accept new ones' },
      { name: 'Reject', value: 'reject', description: 'Deliver existing messages but reject new ones' },
      { name: 'Freeze', value: 'freeze', description: 'Do not deliver messages and reject new ones' },
    ],
    default: 'active',
    displayOptions: {
      show: {
        resource: ['queue'],
        operation: ['setQueueStatus'],
      },
    },
    description: 'Set messages queue processing status',
  },
  {
    displayName: 'Force Delivery',
    name: 'force',
    type: 'boolean',
    required: false,
    default: false,
    displayOptions: {
      show: {
        resource: ['queue'],
        operation: ['setQueueStatus'],
      },
    },
    description: 'Force delivery of all queued messages with no delay for 30 minutes (only works with "active" or "reject" status)',
  },

  // ROUTE QUEUE OPTIONS
  {
    displayName: 'Target WhatsApp Number ID',
    name: 'device',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['queue'],
        operation: ['routeQueue'],
      },
    },
    description: 'Target device ID to reroute queued messages (24 characters hexadecimal value)',
  },

  // EMPTY QUEUE OPTIONS
  {
    displayName: 'Wait for Completion',
    name: 'wait',
    type: 'boolean',
    required: false,
    default: false,
    displayOptions: {
      show: {
        resource: ['queue'],
        operation: ['emptyQueue'],
      },
    },
    description: 'Wait until all queued messages are deleted (response may take up to 90 seconds)',
  },
  {
    displayName: 'Skip Scheduled Messages',
    name: 'skipScheduled',
    type: 'boolean',
    required: false,
    default: false,
    displayOptions: {
      show: {
        resource: ['queue'],
        operation: ['emptyQueue'],
      },
    },
    description: 'Do not delete scheduled messages that will be delivered in the future',
  },
  {
    displayName: 'Filter Type',
    name: 'filterType',
    type: 'options',
    options: [
      { name: 'None (Delete All)', value: 'none' },
      { name: 'Message IDs', value: 'ids' },
      { name: 'Phone Numbers', value: 'phones' },
      { name: 'Group/Broadcast IDs', value: 'groups' },
      { name: 'Date Range', value: 'dateRange' },
    ],
    default: 'none',
    displayOptions: {
      show: {
        resource: ['queue'],
        operation: ['emptyQueue'],
      },
    },
    description: 'Type of filter to apply when emptying the queue',
  },
  {
    displayName: 'Message IDs',
    name: 'ids',
    type: 'string',
    typeOptions: {
      multipleValues: true,
    },
    required: true,
    default: [],
    displayOptions: {
      show: {
        resource: ['queue'],
        operation: ['emptyQueue'],
        filterType: ['ids'],
      },
    },
    description: 'IDs of queued messages to delete (24 characters hexadecimal value)',
  },
  {
    displayName: 'Phone Numbers',
    name: 'phones',
    type: 'string',
    typeOptions: {
      multipleValues: true,
    },
    required: true,
    default: [],
    displayOptions: {
      show: {
        resource: ['queue'],
        operation: ['emptyQueue'],
        filterType: ['phones'],
      },
    },
    description: 'Phone numbers in E164 format (e.g. +447362053576)',
  },
  {
    displayName: 'Group/Broadcast IDs',
    name: 'groups',
    type: 'string',
    typeOptions: {
      multipleValues: true,
    },
    required: true,
    default: [],
    displayOptions: {
      show: {
        resource: ['queue'],
        operation: ['emptyQueue'],
        filterType: ['groups'],
      },
    },
    description: 'Group/broadcast list WhatsApp IDs (e.g. 447362053576-000000000@g.us)',
  },
  {
    displayName: 'Date Filters',
    name: 'dateFilters',
    type: 'collection',
    placeholder: 'Add Date Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['queue'],
        operation: ['emptyQueue'],
        filterType: ['dateRange'],
      },
    },
    options: [
      {
        displayName: 'Created Before',
        name: 'before',
        type: 'dateTime',
        default: '',
        description: 'Delete messages created before this date',
      },
      {
        displayName: 'Created After',
        name: 'after',
        type: 'dateTime',
        default: '',
        description: 'Delete messages created after this date',
      },
    ],
  },
];

export async function executeQueueOperations(
  this: IExecuteFunctions | any,
  index: number,
) {
  const operation = this.getNodeParameter('operation', index) as string;
  const deviceId = this.getNodeParameter('deviceId', index) as string;

  // GET QUEUE STATUS
  if (operation === 'getQueueStatus') {
    return request(
      this,
      'GET',
      `/devices/${deviceId}/queue`,
    );
  }

  // SET QUEUE STATUS
  if (operation === 'setQueueStatus') {
    const status = this.getNodeParameter('status', index) as string;
    const force = this.getNodeParameter('force', index, false) as boolean;

    const body: {
      status: string;
      force?: boolean;
    } = {
      status,
    };

    if (force) {
      body.force = true;
    }

    return request(
      this,
      'POST',
      `/devices/${deviceId}/queue`,
      body,
    );
  }

  // ROUTE QUEUE
  if (operation === 'routeQueue') {
    const device = this.getNodeParameter('device', index) as string;

    return request(
      this,
      'PATCH',
      `/devices/${deviceId}/queue`,
      { device },
    );
  }

  // EMPTY QUEUE
  if (operation === 'emptyQueue') {
    const wait = this.getNodeParameter('wait', index, false) as boolean;
    const skipScheduled = this.getNodeParameter('skipScheduled', index, false) as boolean;
    const filterType = this.getNodeParameter('filterType', index, 'none') as string;

    const queryParameters: Record<string, string> = {};
    if (wait) {
      queryParameters.wait = 'true';
    }

    const body: {
      skipScheduled?: boolean;
      ids?: string[];
      phones?: string[];
      groups?: string[];
      before?: string;
      after?: string;
    } = {};

    if (skipScheduled) {
      body.skipScheduled = true;
    }

    if (filterType === 'ids') {
      const ids = this.getNodeParameter('ids', index, []) as string[];
      body.ids = ids;
    } else if (filterType === 'phones') {
      const phones = this.getNodeParameter('phones', index, []) as string[];
      body.phones = phones;
    } else if (filterType === 'groups') {
      const groups = this.getNodeParameter('groups', index, []) as string[];
      body.groups = groups;
    } else if (filterType === 'dateRange') {
      const dateFilters = this.getNodeParameter('dateFilters', index, {}) as {
        before?: string;
        after?: string;
      };

      if (dateFilters.before) body.before = dateFilters.before;
      if (dateFilters.after) body.after = dateFilters.after;
    }

    return request(
      this,
      'DELETE',
      `/devices/${deviceId}/queue`,
      Object.keys(body).length ? body : undefined,
      queryParameters,
    );
  }

  throw new Error(`The operation "${operation}" is not supported for queue!`);
}
