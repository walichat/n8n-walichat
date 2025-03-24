import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { request } from '../request';

export const numberProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['numbers'],
      },
    },
    options: [
      {
        name: 'Get WhatsApp Numbers',
        value: 'getNumbers',
        description: 'Get a list of all WhatsApp numbers in your account',
      },
      {
        name: 'Get WhatsApp Number Details',
        value: 'getNumberById',
        description: 'Get details of a specific WhatsApp number',
      },
      {
        name: 'Create WhatsApp Number',
        value: 'createNumber',
        description: 'Create a new WhatsApp number with subscription plan',
      },
      {
        name: 'Update WhatsApp Number',
        value: 'updateNumber',
        description: 'Update WhatsApp number settings',
      },
      {
        name: 'Delete WhatsApp Number',
        value: 'deleteNumber',
        description: 'Delete a WhatsApp number',
      },
      {
        name: 'Delete Chats',
        value: 'deleteChats',
        description: 'Delete chats for a WhatsApp number',
      },
    ],
    default: 'getNumbers',
  },

  // GET NUMBERS FILTERS
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['numbers'],
        operation: ['getNumbers'],
      },
    },
    options: [
      {
        displayName: 'WhatsApp Number IDs',
        name: 'ids',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Filter WhatsApp numbers by specific IDs',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          { name: 'Operative', value: 'operative' },
          { name: 'Pending', value: 'pending' },
          { name: 'Disabled', value: 'disabled' },
          { name: 'Removed', value: 'removed' },
        ],
        default: '',
        description: 'Filter WhatsApp numbers by status',
      },
      {
        displayName: 'Session Status',
        name: 'sessionStatus',
        type: 'options',
        options: [
          { name: 'Authorize', value: 'authorize' },
          { name: 'Online', value: 'online' },
          { name: 'Timeout', value: 'timeout' },
          { name: 'Offline', value: 'offline' },
          { name: 'Error', value: 'error' },
        ],
        default: '',
        description: 'Filter WhatsApp numbers by session status',
      },
      {
        displayName: 'Search Term',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Search WhatsApp numbers by phone number, alias or ID',
      },
      {
        displayName: 'Results Page Size',
        name: 'size',
        type: 'number',
        default: 50,
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

  // PARAMS FOR OPERATIONS THAT REQUIRE NUMBER ID
  {
    displayName: 'WhatsApp Number ID',
    name: 'deviceId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['numbers'],
        operation: ['getNumberById', 'updateNumber', 'deleteNumber', 'deleteChats'],
      },
    },
    description: 'ID of the WhatsApp number',
  },

  // GET NUMBER BY ID - INCLUDE OPTIONS
  {
    displayName: 'Include Options',
    name: 'includeOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['numbers'],
        operation: ['getNumberById'],
      },
    },
    options: [
      {
        displayName: 'Include',
        name: 'include',
        type: 'multiOptions',
        options: [
          { name: 'Agents', value: 'agents' },
          { name: 'Catalog', value: 'catalog' },
          { name: 'Quick Replies', value: 'quickReplies' },
        ],
        default: [],
        description: 'Additional information to include in the response',
      },
      {
        displayName: 'Exclude',
        name: 'exclude',
        type: 'multiOptions',
        options: [
          { name: 'Session', value: 'session' },
          { name: 'Profile', value: 'profile' },
          { name: 'Stats', value: 'stats' },
          { name: 'Queue', value: 'queue' },
        ],
        default: [],
        description: 'Information to exclude from the response',
      },
    ],
  },

  // CREATE NUMBER PARAMETERS
  {
    displayName: 'Alias',
    name: 'alias',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['numbers'],
        operation: ['createNumber'],
      },
    },
    description: 'Alias/name for the WhatsApp number (2-30 characters)',
  },
  {
    displayName: 'Billing Plan',
    name: 'billingPlan',
    type: 'options',
    required: true,
    options: [
      { name: 'Professional', value: 'professional' },
      { name: 'Business', value: 'business' },
      { name: 'Enterprise', value: 'enterprise' },
      { name: 'Gateway Professional', value: 'gateway-professional' },
      { name: 'Gateway Business', value: 'gateway-business' },
      { name: 'Gateway Enterprise', value: 'gateway-enterprise' },
      { name: 'Platform Professional', value: 'io-professional' },
      { name: 'Platform Business', value: 'io-business' },
      { name: 'Platform Enterprise', value: 'io-enterprise' },
    ],
    default: 'professional',
    displayOptions: {
      show: {
        resource: ['numbers'],
        operation: ['createNumber'],
      },
    },
    description: 'Subscription plan for the WhatsApp number',
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['numbers'],
        operation: ['createNumber'],
      },
    },
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description for the WhatsApp number (max 80 characters)',
      },
      {
        displayName: 'Agent IDs',
        name: 'agents',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Agent IDs to provide shared chat access (Platform plans only)',
      },
      {
        displayName: 'Payment Intent',
        name: 'paymentIntent',
        type: 'string',
        default: '',
        description: 'Payment intent ID (starts with pi_)',
      },
    ],
  },

  // UPDATE NUMBER PARAMETERS
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['numbers'],
        operation: ['updateNumber'],
      },
    },
    options: [
      {
        displayName: 'Enable',
        name: 'enable',
        type: 'boolean',
        default: true,
        description: 'Whether to enable or disable the WhatsApp number',
      },
      {
        displayName: 'Alias',
        name: 'alias',
        type: 'string',
        default: '',
        description: 'New alias/name for the WhatsApp number (2-30 characters)',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'New description for the WhatsApp number (max 80 characters)',
      },
      {
        displayName: 'Billing Plan',
        name: 'plan',
        type: 'options',
        options: [
          { name: 'Professional', value: 'professional' },
          { name: 'Business', value: 'business' },
          { name: 'Enterprise', value: 'enterprise' },
          { name: 'Gateway Professional', value: 'gateway-professional' },
          { name: 'Gateway Business', value: 'gateway-business' },
          { name: 'Gateway Enterprise', value: 'gateway-enterprise' },
          { name: 'Platform Professional', value: 'io-professional' },
          { name: 'Platform Business', value: 'io-business' },
          { name: 'Platform Enterprise', value: 'io-enterprise' },
        ],
        default: '',
        description: 'New billing plan (charges may apply)',
      },
      {
        displayName: 'Webhook IDs',
        name: 'webhooks',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Restrict webhook notifications to these webhook endpoint IDs',
      },
      {
        displayName: 'Reboot Policy',
        name: 'rebootPolicy',
        type: 'options',
        options: [
          { name: 'Disabled', value: 'disabled' },
          { name: '10 Minutes', value: '10m' },
          { name: '15 Minutes', value: '15m' },
          { name: '20 Minutes', value: '20m' },
          { name: '25 Minutes', value: '25m' },
          { name: '30 Minutes', value: '30m' },
          { name: '45 Minutes', value: '45m' },
          { name: '1 Hour', value: '1h' },
          { name: '2 Hours', value: '2h' },
          { name: '3 Hours', value: '3h' },
          { name: '4 Hours', value: '4h' },
          { name: '5 Hours', value: '5h' },
          { name: '6 Hours', value: '6h' },
          { name: '8 Hours', value: '8h' },
          { name: '10 Hours', value: '10h' },
          { name: '12 Hours', value: '12h' },
          { name: '18 Hours', value: '18h' },
        ],
        default: '',
        description: 'Device session reboot policy',
      },
      {
        displayName: 'Retention Policy',
        name: 'retentionPolicy',
        type: 'options',
        options: [
          { name: 'Plan Defaults', value: 'plan_defaults' },
          { name: 'Never', value: 'never' },
          { name: '5 Minutes', value: '5m' },
          { name: '15 Minutes', value: '15m' },
          { name: '30 Minutes', value: '30m' },
          { name: '1 Hour', value: '1h' },
          { name: '12 Hours', value: '12h' },
          { name: '24 Hours', value: '24h' },
          { name: '2 Days', value: '2d' },
          { name: '3 Days', value: '3d' },
          { name: '4 Days', value: '4d' },
          { name: '5 Days', value: '5d' },
          { name: '6 Days', value: '6d' },
          { name: '7 Days', value: '7d' },
          { name: '10 Days', value: '10d' },
        ],
        default: '',
        description: 'Data retention policy',
      },
      {
        displayName: 'Delivery Speed',
        name: 'deliverySpeed',
        type: 'options',
        options: [
          { name: 'Plan Default', value: 0 },
          { name: '0.1 Per Minute', value: 0.1 },
          { name: '0.2 Per Minute', value: 0.2 },
          { name: '0.3 Per Minute', value: 0.3 },
          { name: '0.4 Per Minute', value: 0.4 },
          { name: '0.5 Per Minute', value: 0.5 },
          { name: '0.6 Per Minute', value: 0.6 },
          { name: '0.7 Per Minute', value: 0.7 },
          { name: '0.8 Per Minute', value: 0.8 },
          { name: '0.9 Per Minute', value: 0.9 },
          { name: '1 Per Minute', value: 1 },
          { name: '2 Per Minute', value: 2 },
          { name: '3 Per Minute', value: 3 },
          { name: '4 Per Minute', value: 4 },
          { name: '5 Per Minute', value: 5 },
          { name: '6 Per Minute', value: 6 },
          { name: '7 Per Minute', value: 7 },
          { name: '8 Per Minute', value: 8 },
          { name: '9 Per Minute', value: 9 },
          { name: '10 Per Minute', value: 10 },
          { name: '15 Per Minute', value: 15 },
          { name: '20 Per Minute', value: 20 },
          { name: '30 Per Minute', value: 30 },
          { name: '40 Per Minute', value: 40 },
          { name: '50 Per Minute', value: 50 },
          { name: '60 Per Minute', value: 60 },
          { name: '70 Per Minute', value: 70 },
          { name: '80 Per Minute', value: 80 },
          { name: '90 Per Minute', value: 90 },
          { name: '100 Per Minute', value: 100 },
          { name: '120 Per Minute', value: 120 },
          { name: '140 Per Minute', value: 140 },
          { name: '150 Per Minute', value: 150 },
        ],
        default: 0,
        description: 'Maximum message delivery speed per minute',
      },
    ],
  },

  // DELETE CHATS PARAMETERS
  {
    displayName: 'Chat Phone Numbers',
    name: 'phoneNumbers',
    type: 'string',
    typeOptions: {
      multipleValues: true,
      minValue: 1,
      maxValue: 10,
    },
    required: true,
    default: [],
    displayOptions: {
      show: {
        resource: ['numbers'],
        operation: ['deleteChats'],
      },
    },
    description: 'Phone numbers with international country code (1-10 numbers)',
  },
];

export async function executeNumberOperations(
  this: IExecuteFunctions | any,
  index: number,
) {
  const operation = this.getNodeParameter('operation', index) as string;

  // GET NUMBERS
  if (operation === 'getNumbers') {
    const filters = this.getNodeParameter('filters', index, {}) as {
      ids?: string[];
      status?: string;
      sessionStatus?: string;
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
      '/devices',
      undefined,
      queryParameters as Record<string, string>,
    );
  }

  // GET NUMBER BY ID
  if (operation === 'getNumberById') {
    const deviceId = this.getNodeParameter('deviceId', index) as string;
    const includeOptions = this.getNodeParameter('includeOptions', index, {}) as {
      include?: string[];
      exclude?: string[];
    };

    const queryParameters: Record<string, string> = {};

    if (includeOptions.include && includeOptions.include.length > 0) {
      queryParameters.include = includeOptions.include.join(',');
    }

    if (includeOptions.exclude && includeOptions.exclude.length > 0) {
      queryParameters.exclude = includeOptions.exclude.join(',');
    }

    return request(
      this,
      'GET',
      `/devices/${deviceId}`,
      undefined,
      queryParameters,
    );
  }

  // CREATE NUMBER
  if (operation === 'createNumber') {
    const alias = this.getNodeParameter('alias', index) as string;
    const billingPlan = this.getNodeParameter('billingPlan', index) as string;
    const additionalOptions = this.getNodeParameter('additionalOptions', index, {}) as {
      description?: string;
      agents?: string[];
      paymentIntent?: string;
    };

    const body: {
      alias: string;
      billingPlan: string;
      description?: string;
      agents?: string[];
      paymentIntent?: string;
    } = {
      alias,
      billingPlan,
    };

    if (additionalOptions.description) {
      body.description = additionalOptions.description;
    }

    if (additionalOptions.agents && additionalOptions.agents.length > 0) {
      body.agents = additionalOptions.agents;
    }

    if (additionalOptions.paymentIntent) {
      body.paymentIntent = additionalOptions.paymentIntent;
    }

    return request(
      this,
      'POST',
      '/devices',
      body,
    );
  }

  // UPDATE NUMBER
  if (operation === 'updateNumber') {
    const deviceId = this.getNodeParameter('deviceId', index) as string;
    const updateFields = this.getNodeParameter('updateFields', index, {}) as {
      enable?: boolean;
      alias?: string;
      description?: string;
      plan?: string;
      webhooks?: string[];
      rebootPolicy?: string;
      retentionPolicy?: string;
      deliverySpeed?: number;
    };

    const body: Record<string, any> = {};
    const settings: Record<string, any> = {};

    // Handle basic fields
    if (updateFields.enable !== undefined) body.enable = updateFields.enable;
    if (updateFields.alias) body.alias = updateFields.alias;
    if (updateFields.description) body.description = updateFields.description;
    if (updateFields.plan) body.plan = updateFields.plan;
    if (updateFields.webhooks && updateFields.webhooks.length > 0) {
      body.webhooks = updateFields.webhooks;
    }

    // Handle settings fields
    if (updateFields.rebootPolicy) settings.rebootPolicy = updateFields.rebootPolicy;
    if (updateFields.retentionPolicy) settings.retentionPolicy = updateFields.retentionPolicy;
    if (updateFields.deliverySpeed !== undefined) settings.deliverySpeed = updateFields.deliverySpeed;

    // Add settings to body if any settings were defined
    if (Object.keys(settings).length > 0) {
      body.settings = settings;
    }

    return request(
      this,
      'PATCH',
      `/devices/${deviceId}`,
      body,
    );
  }

  // DELETE NUMBER
  if (operation === 'deleteNumber') {
    const deviceId = this.getNodeParameter('deviceId', index) as string;

    return request(
      this,
      'DELETE',
      `/devices/${deviceId}`,
    );
  }

  // DELETE CHATS
  if (operation === 'deleteChats') {
    const deviceId = this.getNodeParameter('deviceId', index) as string;
    const phoneNumbers = this.getNodeParameter('phoneNumbers', index, []) as string[];

    if (!phoneNumbers || phoneNumbers.length === 0) {
      throw new Error('At least one phone number is required');
    }

    if (phoneNumbers.length > 10) {
      throw new Error('Maximum of 10 phone numbers can be deleted at once');
    }

    return request(
      this,
      'DELETE',
      `/devices/${deviceId}/chats`,
      phoneNumbers,
    );
  }

  throw new Error(`The operation "${operation}" is not supported for WhatsApp numbers!`);
}
