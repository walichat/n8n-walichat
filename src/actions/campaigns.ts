import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { request } from '../request';

export const campaignProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['campaigns'],
      },
    },
    options: [
      {
        name: 'Get Campaigns',
        value: 'getCampaigns',
        description: 'Get a list of campaigns',
      },
      {
        name: 'Get Campaign',
        value: 'getCampaign',
        description: 'Get a specific campaign by ID',
      },
      {
        name: 'Update Campaign Status',
        value: 'updateCampaign',
        description: 'Start or stop a campaign',
      },
      {
        name: 'Get Campaign Contacts',
        value: 'getCampaignContacts',
        description: 'Get contacts for a specific campaign',
      },
      {
        name: 'Delete Campaign',
        value: 'deleteCampaign',
        description: 'Delete a campaign',
      },
    ],
    default: 'getCampaigns',
  },

  // GET CAMPAIGNS OPTIONS
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['campaigns'],
        operation: ['getCampaigns'],
      },
    },
    options: [
      {
        displayName: 'Before Date',
        name: 'before',
        type: 'dateTime',
        default: '',
        description: 'Filter campaigns created before this date',
      },
      {
        displayName: 'After Date',
        name: 'after',
        type: 'dateTime',
        default: '',
        description: 'Filter campaigns created after this date',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'multiOptions',
        options: [
          { name: 'Draft', value: 'draft' },
          { name: 'Pending', value: 'pending' },
          { name: 'Processing', value: 'processing' },
          { name: 'Completed', value: 'completed' },
          { name: 'Failed', value: 'failed' },
          { name: 'Stopped', value: 'stopped' },
          { name: 'Paused', value: 'paused' },
          { name: 'Incomplete', value: 'incomplete' },
        ],
        default: [],
        description: 'Filter by campaign status',
      },
      {
        displayName: 'Device IDs',
        name: 'device',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Filter by WhatsApp device IDs',
      },
      {
        displayName: 'Owner User IDs',
        name: 'owner',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Filter by owner user IDs',
      },
      {
        displayName: 'Campaign IDs',
        name: 'id',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Filter by campaign IDs',
      },
      {
        displayName: 'Phone Numbers',
        name: 'phone',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Filter campaigns by recipient phone numbers (e.g., +447362053576)',
      },
      {
        displayName: 'Group IDs',
        name: 'group',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Filter campaigns by recipient group chats (e.g., 44736205357600000000@g.us)',
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
        ],
        default: 'date:desc',
        description: 'Sort order for results',
      },
    ],
  },

  // CAMPAIGN ID PARAMETER FOR SINGLE CAMPAIGN OPERATIONS
  {
    displayName: 'Campaign ID',
    name: 'campaignId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['campaigns'],
        operation: ['getCampaign', 'updateCampaign', 'getCampaignContacts', 'deleteCampaign'],
      },
    },
    description: 'ID of the campaign',
  },

  // UPDATE CAMPAIGN STATUS
  {
    displayName: 'Action',
    name: 'action',
    type: 'options',
    required: true,
    options: [
      { name: 'Start Campaign', value: 'start' },
      { name: 'Stop Campaign', value: 'stop' },
    ],
    default: 'start',
    displayOptions: {
      show: {
        resource: ['campaigns'],
        operation: ['updateCampaign'],
      },
    },
    description: 'Action to perform on the campaign',
  },

  // GET CAMPAIGN CONTACTS OPTIONS
  {
    displayName: 'Filters',
    name: 'contactFilters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['campaigns'],
        operation: ['getCampaignContacts'],
      },
    },
    options: [
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Search contacts by phone number, contact name or target group ID',
      },
      {
        displayName: 'Target',
        name: 'target',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Filter by contact target: phone number or group WhatsApp ID',
      },
      {
        displayName: 'Kind',
        name: 'kind',
        type: 'multiOptions',
        options: [
          { name: 'Phone', value: 'phone' },
          { name: 'Group', value: 'group' },
        ],
        default: [],
        description: 'Filter by target kind',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'multiOptions',
        options: [
          { name: 'Pending', value: 'pending' },
          { name: 'Processing', value: 'processing' },
          { name: 'Delivered', value: 'delivered' },
          { name: 'Failed', value: 'failed' },
        ],
        default: [],
        description: 'Filter by delivery status',
      },
      {
        displayName: 'ACK Status',
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
        description: 'Filter by delivery ACK status',
      },
      {
        displayName: 'WhatsApp Message IDs',
        name: 'wid',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Filter contacts by WhatsApp message IDs',
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
        ],
        default: 'date:desc',
        description: 'Sort order for results',
      },
    ],
  },
];

export async function executeCampaignOperations(
  this: IExecuteFunctions | any,
  index: number,
) {
  const operation = this.getNodeParameter('operation', index) as string;

  // GET CAMPAIGNS
  if (operation === 'getCampaigns') {
    const filters = this.getNodeParameter('filters', index, {}) as {
      before?: string;
      after?: string;
      status?: string[];
      device?: string[];
      owner?: string[];
      id?: string[];
      phone?: string[];
      group?: string[];
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
      '/campaigns',
      undefined,
      queryParameters as Record<string, string>,
    );
  }

  // GET CAMPAIGN
  if (operation === 'getCampaign') {
    const campaignId = this.getNodeParameter('campaignId', index) as string;

    return request(
      this,
      'GET',
      `/campaigns/${campaignId}`,
    );
  }

  // UPDATE CAMPAIGN STATUS
  if (operation === 'updateCampaign') {
    const campaignId = this.getNodeParameter('campaignId', index) as string;
    const action = this.getNodeParameter('action', index) as string;

    return request(
      this,
      'PUT',
      `/campaigns/${campaignId}/status`,
      { action },
    );
  }

  // GET CAMPAIGN CONTACTS
  if (operation === 'getCampaignContacts') {
    const campaignId = this.getNodeParameter('campaignId', index) as string;
    const filters = this.getNodeParameter('contactFilters', index, {}) as {
      search?: string;
      target?: string[];
      kind?: string[];
      status?: string[];
      ack?: string[];
      wid?: string[];
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
      `/campaigns/${campaignId}/contacts`,
      undefined,
      queryParameters as Record<string, string>,
    );
  }

  // DELETE CAMPAIGN
  if (operation === 'deleteCampaign') {
    const campaignId = this.getNodeParameter('campaignId', index) as string;

    return request(
      this,
      'DELETE',
      `/campaigns/${campaignId}`,
    );
  }

  throw new Error(`The operation "${operation}" is not supported for campaigns!`);
}
