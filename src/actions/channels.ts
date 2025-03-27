import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { request } from '../request';
import { countries } from '../constants/countries';

export const channelProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['channels'],
      },
    },
    options: [
      {
        name: 'Get Channels',
        value: 'getDeviceChannels',
        description: 'Get all channels for a WhatsApp number',
      },
      {
        name: 'Get Channel',
        value: 'getChannelById',
        description: 'Get details of a specific channel',
      },
      {
        name: 'Create Channel',
        value: 'createChannel',
        description: 'Create a new WhatsApp channel',
      },
      {
        name: 'Update Channel',
        value: 'updateChannel',
        description: 'Update channel details',
      },
      {
        name: 'Update Channel Image',
        value: 'channelUpdateImage',
        description: 'Update channel profile image',
      },
      {
        name: 'Delete Channel',
        value: 'deleteChannel',
        description: 'Delete/unfollow a channel',
      },
      {
        name: 'Join Channel',
        value: 'joinChannel',
        description: 'Join a channel by invite code or URL',
      },
      {
        name: 'Search Channels',
        value: 'searchChannels',
        description: 'Search for public channels',
      },
    ],
    default: 'getDeviceChannels',
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
        resource: ['channels'],
      },
    },
    description: 'The ID of the WhatsApp number',
  },
  // Channel ID field - used by multiple operations
  {
    displayName: 'Channel ID',
    name: 'channelId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['channels'],
        operation: ['getChannelById', 'updateChannel', 'deleteChannel', 'channelUpdateImage'],
      },
    },
    description: 'The ID of the channel (e.g: 123000098765421000, 123000098765421000@newsletter)',
  },

  // GET CHANNELS OPTIONS
  {
    displayName: 'Permission',
    name: 'permission',
    type: 'string',
    required: false,
    default: '',
    displayOptions: {
      show: {
        resource: ['channels'],
        operation: ['getDeviceChannels'],
      },
    },
    description: 'Filter channels by permission type',
  },
  {
    displayName: 'Results Page Size',
    name: 'size',
    type: 'number',
    required: false,
    default: 20,
    displayOptions: {
      show: {
        resource: ['channels'],
        operation: ['getDeviceChannels'],
      },
    },
    description: 'Number of results per page',
  },
  {
    displayName: 'Page Number',
    name: 'page',
    type: 'number',
    required: false,
    default: 0,
    displayOptions: {
      show: {
        resource: ['channels'],
        operation: ['getDeviceChannels'],
      },
    },
    description: 'Page number (starting from 0)',
  },

  // CREATE/UPDATE CHANNEL OPTIONS
  {
    displayName: 'Channel Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['channels'],
        operation: ['createChannel', 'updateChannel'],
      },
    },
    description: 'Name of the channel',
  },
  {
    displayName: 'Description',
    name: 'description',
    type: 'string',
    required: false,
    default: '',
    displayOptions: {
      show: {
        resource: ['channels'],
        operation: ['createChannel', 'updateChannel'],
      },
    },
    description: 'Channel description (up to 2048 characters)',
  },

  // IMAGE OPTION FOR UPDATE CHANNEL
  {
    displayName: 'Image URL',
    name: 'imageUrl',
    type: 'string',
    required: false,
    default: '',
    displayOptions: {
      show: {
        resource: ['channels'],
        operation: ['updateChannel'],
      },
    },
    description: 'URL of image to use as channel profile picture (JPG or PNG, max 1MB)',
  },

  // CREATE CHANNEL IMAGE OPTIONS
  {
    displayName: 'Upload Image',
    name: 'uploadImage',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['channels'],
        operation: ['createChannel'],
      },
    },
    description: 'Whether to upload an image for the channel',
  },
  {
    displayName: 'Image Source',
    name: 'imageSource',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['channels'],
        operation: ['createChannel'],
        uploadImage: [true],
      },
    },
    options: [
      {
        name: 'URL',
        value: 'url',
      },
      {
        name: 'Base64',
        value: 'base64',
      },
    ],
    default: 'url',
    description: 'Source of the image',
  },
  {
    displayName: 'Image URL',
    name: 'imageUrl',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['channels'],
        operation: ['createChannel'],
        uploadImage: [true],
        imageSource: ['url'],
      },
    },
    description: 'URL of image to use as channel profile picture (JPG or PNG, max 1MB)',
  },
  {
    displayName: 'Image Data (Base64)',
    name: 'imageData',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['channels'],
        operation: ['createChannel'],
        uploadImage: [true],
        imageSource: ['base64'],
      },
    },
    description: 'Base64-encoded image data (JPG or PNG, max 1MB)',
  },

  // UPDATE CHANNEL IMAGE OPTIONS
  {
    displayName: 'Image Source',
    name: 'imageSource',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['channels'],
        operation: ['channelUpdateImage'],
      },
    },
    options: [
      {
        name: 'URL',
        value: 'url',
      },
      {
        name: 'Base64',
        value: 'base64',
      },
    ],
    default: 'url',
    description: 'Source of the image',
  },
  {
    displayName: 'Image URL',
    name: 'url',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['channels'],
        operation: ['channelUpdateImage'],
        imageSource: ['url'],
      },
    },
    description: 'URL of image to use as channel profile picture (JPG or PNG, max 1MB)',
  },
  {
    displayName: 'Image Data (Base64)',
    name: 'image',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['channels'],
        operation: ['channelUpdateImage'],
        imageSource: ['base64'],
      },
    },
    description: 'Base64-encoded image data (JPG or PNG, max 1MB)',
  },

  // JOIN CHANNEL OPTIONS
  {
    displayName: 'Join Method',
    name: 'joinMethod',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['channels'],
        operation: ['joinChannel'],
      },
    },
    options: [
      {
        name: 'Invite Code',
        value: 'code',
      },
      {
        name: 'Invite URL',
        value: 'url',
      },
    ],
    default: 'url',
    description: 'Method to join the channel',
  },
  {
    displayName: 'Invite Code',
    name: 'code',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['channels'],
        operation: ['joinChannel'],
        joinMethod: ['code'],
      },
    },
    description: 'Channel invitation code',
  },
  {
    displayName: 'Invite URL',
    name: 'url',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['channels'],
        operation: ['joinChannel'],
        joinMethod: ['url'],
      },
    },
    description: 'Channel invitation URL (e.g., https://whatsapp.com/channels/XXXXXXX)',
  },

  // SEARCH CHANNELS OPTIONS
  {
    displayName: 'Search Query',
    name: 'search',
    type: 'string',
    required: false,
    default: '',
    displayOptions: {
      show: {
        resource: ['channels'],
        operation: ['searchChannels'],
      },
    },
    description: 'Text to search for channels',
  },
  {
    displayName: 'Results Limit',
    name: 'limit',
    type: 'number',
    required: false,
    default: 50,
    displayOptions: {
      show: {
        resource: ['channels'],
        operation: ['searchChannels'],
      },
    },
    description: 'Maximum number of results to return (1-50)',
  },
  {
    displayName: 'Category',
    name: 'category',
    type: 'options',
    required: false,
    default: 'recommended',
    displayOptions: {
      show: {
        resource: ['channels'],
        operation: ['searchChannels'],
      },
    },
    options: [
      { name: 'Recommended', value: 'recommended' },
      { name: 'Trending', value: 'trending' },
      { name: 'Popular', value: 'popular' },
      { name: 'New', value: 'new' },
      { name: 'Featured', value: 'featured' },
    ],
    description: 'Category of channels to search for',
  },
  {
    displayName: 'Sort Order',
    name: 'sort',
    type: 'options',
    required: false,
    default: 'desc',
    displayOptions: {
      show: {
        resource: ['channels'],
        operation: ['searchChannels'],
      },
    },
    options: [
      { name: 'Descending', value: 'desc' },
      { name: 'Ascending', value: 'asc' },
    ],
    description: 'Sort order for results',
  },
  {
    displayName: 'Sort Field',
    name: 'sortField',
    type: 'options',
    required: false,
    default: 'subscribers',
    displayOptions: {
      show: {
        resource: ['channels'],
        operation: ['searchChannels'],
      },
    },
    options: [
      { name: 'Creation Time', value: 'creation_time' },
      { name: 'Subscribers', value: 'subscribers' },
    ],
    description: 'Field to sort by',
  },
  {
    displayName: 'Countries',
    name: 'countries',
    type: 'multiOptions',
    required: false,
    default: [],
    displayOptions: {
      show: {
        resource: ['channels'],
        operation: ['searchChannels'],
      },
    },
    options: countries.map(({ name, flag, code }) => {
      return {
        name: `${name} ${flag}`,
        value: code,
      };
    }),
    description: 'Countries to filter channels by (max 10)',
  },
];

export async function executeChannelOperations(
  this: IExecuteFunctions | any,
  index: number,
) {
  const operation = this.getNodeParameter('operation', index) as string;
  const device = this.getNodeParameter('device', index) as string;

  // GET CHANNELS
  if (operation === 'getDeviceChannels') {
    const queryParameters: Record<string, string> = {};

    const permission = this.getNodeParameter('permission', index, '') as string;
    const size = this.getNodeParameter('size', index, '') as string;
    const page = this.getNodeParameter('page', index, '') as string;

    if (permission) queryParameters.permission = permission;
    if (size) queryParameters.size = size.toString();
    if (page) queryParameters.page = page.toString();

    return request(
      this,
      'GET',
      `/devices/${device}/channels`,
      undefined,
      queryParameters,
    );
  }

  // GET CHANNEL BY ID
  if (operation === 'getChannelById') {
    const channelId = this.getNodeParameter('channelId', index) as string;

    return request(
      this,
      'GET',
      `/devices/${device}/channels/${channelId}`,
    );
  }

  // CREATE CHANNEL
  if (operation === 'createChannel') {
    const name = this.getNodeParameter('name', index) as string;
    const description = this.getNodeParameter('description', index, '') as string;
    const uploadImage = this.getNodeParameter('uploadImage', index, false) as boolean;

    const body: {
      name: string;
      description?: string;
      image?: {
        url?: string;
        data?: string;
      };
    } = {
      name,
    };

    if (description) {
      body.description = description;
    }

    if (uploadImage) {
      const imageSource = this.getNodeParameter('imageSource', index) as string;
      body.image = {};

      if (imageSource === 'url') {
        const imageUrl = this.getNodeParameter('imageUrl', index) as string;
        body.image.url = imageUrl;
      } else if (imageSource === 'base64') {
        const imageData = this.getNodeParameter('imageData', index) as string;
        body.image.data = imageData;
      }
    }

    return request(
      this,
      'POST',
      `/devices/${device}/channels`,
      body,
    );
  }

  // UPDATE CHANNEL
  if (operation === 'updateChannel') {
    const channelId = this.getNodeParameter('channelId', index) as string;
    const name = this.getNodeParameter('name', index) as string;
    const description = this.getNodeParameter('description', index, '') as string;
    const imageUrl = this.getNodeParameter('imageUrl', index, '') as string;

    const body: {
      name: string;
      description?: string;
      image?: string;
    } = {
      name,
    };

    if (description) {
      body.description = description;
    }

    if (imageUrl) {
      body.image = imageUrl;
    }

    return request(
      this,
      'PATCH',
      `/devices/${device}/channels/${channelId}`,
      body,
    );
  }

  // UPDATE CHANNEL IMAGE
  if (operation === 'channelUpdateImage') {
    const channelId = this.getNodeParameter('channelId', index) as string;
    const imageSource = this.getNodeParameter('imageSource', index) as string;

    const body: {
      url?: string;
      image?: string;
    } = {};

    if (imageSource === 'url') {
      const url = this.getNodeParameter('url', index) as string;
      body.url = url;
    } else if (imageSource === 'base64') {
      const image = this.getNodeParameter('image', index) as string;
      body.image = image;
    }

    return request(
      this,
      'PUT',
      `/devices/${device}/channels/${channelId}/image`,
      body,
    );
  }

  // DELETE CHANNEL
  if (operation === 'deleteChannel') {
    const channelId = this.getNodeParameter('channelId', index) as string;

    return request(
      this,
      'DELETE',
      `/devices/${device}/channels/${channelId}`,
    );
  }

  // JOIN CHANNEL
  if (operation === 'joinChannel') {
    const joinMethod = this.getNodeParameter('joinMethod', index) as string;

    const body: {
      code?: string;
      url?: string;
    } = {};

    if (joinMethod === 'code') {
      const code = this.getNodeParameter('code', index) as string;
      body.code = code;
    } else if (joinMethod === 'url') {
      const url = this.getNodeParameter('url', index) as string;
      body.url = url;
    }

    return request(
      this,
      'PUT',
      `/devices/${device}/channels`,
      body,
    );
  }

  // SEARCH CHANNELS
  if (operation === 'searchChannels') {
    const search = this.getNodeParameter('search', index, '') as string;
    const limit = this.getNodeParameter('limit', index, 50) as number;
    const category = this.getNodeParameter('category', index, 'recommended') as string;
    const sort = this.getNodeParameter('sort', index, 'desc') as string;
    const sortField = this.getNodeParameter('sortField', index, 'subscribers') as string;
    const countries = this.getNodeParameter('countries', index, []) as string[];

    const body: {
      search?: string;
      limit?: number;
      category?: string;
      sort?: string;
      sortField?: string;
      countries?: string[];
    } = {};

    if (search) body.search = search;
    if (limit) body.limit = limit;
    if (category) body.category = category;
    if (sort) body.sort = sort;
    if (sortField) body.sortField = sortField;
    if (countries && countries.length > 0) body.countries = countries;

    return request(
      this,
      'PATCH',
      `/devices/${device}/channels`,
      body,
    );
  }

  throw new Error(`The operation "${operation}" is not supported for channels!`);
}
