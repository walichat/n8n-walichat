import { IExecuteFunctions, INodeProperties, NodePropertyTypes } from 'n8n-workflow';
import { request } from '../request';

export const profileProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['profile'],
      },
    },
    options: [
      {
        name: 'Get Profile',
        value: 'deviceProfile',
        description: 'Get WhatsApp profile information',
      },
      {
        name: 'Update Profile',
        value: 'deviceProfileUpdate',
        description: 'Update WhatsApp profile information',
      },
      {
        name: 'Get Profile Image',
        value: 'deviceProfileImage',
        description: 'Get WhatsApp account profile image',
      },
      {
        name: 'Update Profile Image',
        value: 'updateProfileImage',
        description: 'Update WhatsApp account profile image',
      },
    ],
    default: 'deviceProfile',
  },
  {
    displayName: 'WhatsApp Number',
    name: 'deviceId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['profile'],
      },
    },
    description: 'The ID of the WhatsApp number',
  },

  // ADDITIONAL PARAMETERS FOR GET PROFILE
  {
    displayName: 'Include Options',
    name: 'include',
    type: 'string',
    required: false,
    default: '',
    displayOptions: {
      show: {
        resource: ['profile'],
        operation: ['deviceProfile'],
      },
    },
    description: 'Additional data to include in the response',
  },

  // PARAMETERS FOR UPDATE PROFILE
  {
    displayName: 'Profile Name',
    name: 'name',
    type: 'string',
    required: false,
    default: '',
    displayOptions: {
      show: {
        resource: ['profile'],
        operation: ['deviceProfileUpdate'],
      },
    },
    description: 'WhatsApp profile public name (max 25 characters)',
  },
  {
    displayName: 'Profile Status',
    name: 'status',
    type: 'string',
    required: false,
    default: '',
    displayOptions: {
      show: {
        resource: ['profile'],
        operation: ['deviceProfileUpdate'],
      },
    },
    description: 'WhatsApp profile public status description (max 130 characters)',
  },
  {
    displayName: 'Update Business Profile',
    name: 'updateBusinessProfile',
    type: 'boolean',
    required: false,
    default: false,
    displayOptions: {
      show: {
        resource: ['profile'],
        operation: ['deviceProfileUpdate'],
      },
    },
    description: 'Whether to update business profile information (only supported for WhatsApp Business numbers)',
  },
  {
    displayName: 'Business Profile',
    name: 'businessProfile',
    type: 'collection',
    placeholder: 'Add Business Profile Detail',
    default: {},
    displayOptions: {
      show: {
        resource: ['profile'],
        operation: ['deviceProfileUpdate'],
        updateBusinessProfile: [true],
      },
    },
    options: [
      {
        displayName: 'Business Address',
        name: 'address',
        type: 'string',
        default: '',
        description: 'Business physical address (max 256 characters)',
      },
      {
        displayName: 'Business Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Business activity description (max 256 characters)',
      },
      {
        displayName: 'Business Email',
        name: 'email',
        type: 'string',
        default: '',
        description: 'Business contact email (max 128 characters)',
      },
      {
        displayName: 'Business Websites',
        name: 'websites',
        type: 'string',
        typeOptions: {
          multipleValues: true,
          maxValues: 2,
        },
        default: [],
        description: 'Business website URLs (max 2 websites)',
      },
      {
        displayName: 'Business Categories',
        name: 'categories',
        type: 'multiOptions',
        options: [
          { name: 'Other', value: 'other_category' },
          { name: 'Automotive Service', value: 'automotive_service' },
          { name: 'Clothing & Accessories', value: 'clothing_and_accessories' },
          { name: 'Art & Entertainment', value: 'art_and_entertainment' },
          { name: 'Beauty, Cosmetics & Personal Care', value: 'beauty_cosmetics_and_personal_care' },
          { name: 'Education', value: 'education' },
          { name: 'Event Organizer', value: 'event_organizer' },
          { name: 'Finance', value: 'finance' },
          { name: 'Grocery', value: 'grocery' },
          { name: 'Hotel', value: 'hotel' },
          { name: 'Medicine & Health', value: 'medicine_and_health' },
          { name: 'Non-Profit', value: 'non_profit' },
          { name: 'Restaurant', value: 'restaurant' },
          { name: 'Retail Purchases & Sales', value: 'retail_purchases_and_sales' },
          { name: 'Travel & Transportation', value: 'travel_and_transportation' },
        ],
        default: [],
        description: 'Business categories (max 3)',
      },
    ],
  },
  {
    displayName: 'Set Business Hours',
    name: 'setBusinessHours',
    type: 'boolean',
    required: false,
    default: false,
    displayOptions: {
      show: {
        resource: ['profile'],
        operation: ['deviceProfileUpdate'],
        updateBusinessProfile: [true],
      },
    },
    description: 'Whether to set business hours',
  },
  {
    displayName: 'Business Hours Timezone',
    name: 'timezone',
    type: 'string',
    required: true,
    default: 'UTC',
    displayOptions: {
      show: {
        resource: ['profile'],
        operation: ['deviceProfileUpdate'],
        updateBusinessProfile: [true],
        setBusinessHours: [true],
      },
    },
    description: 'Timezone for business hours (e.g., America/New_York, Europe/London)',
  },
  // PARAMETERS FOR UPDATE PROFILE IMAGE
  {
    displayName: 'Image Source',
    name: 'imageSource',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['profile'],
        operation: ['updateProfileImage'],
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
        resource: ['profile'],
        operation: ['updateProfileImage'],
        imageSource: ['url'],
      },
    },
    description: 'URL of the image to use as profile picture (JPG or PNG, max 1MB)',
  },
  {
    displayName: 'Base64 Image',
    name: 'image',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['profile'],
        operation: ['updateProfileImage'],
        imageSource: ['base64'],
      },
    },
    description: 'Base64 encoded image data (JPG or PNG, max 1MB)',
  },
];

export async function executeProfileOperations(
  this: IExecuteFunctions | any,
  index: number,
) {
  const operation = this.getNodeParameter('operation', index) as string;
  const deviceId = this.getNodeParameter('deviceId', index) as string;

  // GET PROFILE
  if (operation === 'deviceProfile') {
    const include = this.getNodeParameter('include', index, '') as string;

    const queryParameters: Record<string, string> = {};
    if (include) {
      queryParameters.include = include;
    }

    return request(
      this,
      'GET',
      `/devices/${deviceId}/profile`,
      undefined,
      queryParameters,
    );
  }

  // UPDATE PROFILE
  if (operation === 'deviceProfileUpdate') {
    const name = this.getNodeParameter('name', index, '') as string;
    const status = this.getNodeParameter('status', index, '') as string;
    const updateBusinessProfile = this.getNodeParameter('updateBusinessProfile', index, false) as boolean;

    const body: {
      name?: string;
      status?: string;
      businessProfile?: {
        address?: string;
        description?: string;
        email?: string;
        websites?: string[];
        categories?: string[];
        businessHours?: {
          timezone: string;
          monday?: any;
          tuesday?: any;
          wednesday?: any;
          thursday?: any;
          friday?: any;
          saturday?: any;
          sunday?: any;
        };
      };
    } = {};

    if (name) body.name = name;
    if (status) body.status = status;

    if (updateBusinessProfile) {
      const businessProfileData = this.getNodeParameter('businessProfile', index, {}) as {
        address?: string;
        description?: string;
        email?: string;
        websites?: string[];
        categories?: string[];
      };

      body.businessProfile = {};

      if (businessProfileData.address) body.businessProfile.address = businessProfileData.address;
      if (businessProfileData.description) body.businessProfile.description = businessProfileData.description;
      if (businessProfileData.email) body.businessProfile.email = businessProfileData.email;
      if (businessProfileData.websites && businessProfileData.websites.length > 0) {
        body.businessProfile.websites = businessProfileData.websites;
      }
      if (businessProfileData.categories && businessProfileData.categories.length > 0) {
        body.businessProfile.categories = businessProfileData.categories;
      }

      const setBusinessHours = this.getNodeParameter('setBusinessHours', index, false) as boolean;

      if (setBusinessHours) {
        const timezone = this.getNodeParameter('timezone', index) as string;

        body.businessProfile.businessHours = {
          timezone,
        };
        // TODO: support week days hours
      }
    }

    return request(
      this,
      'PATCH',
      `/devices/${deviceId}/profile`,
      body,
    );
  }

  // GET PROFILE IMAGE
  if (operation === 'deviceProfileImage') {
    // Set the Accept header to image/jpeg to get the actual image
    const customHeaders = {
      'Accept': 'image/jpeg',
    };

    return request(
      this,
      'GET',
      `/devices/${deviceId}/profile/image`,
      undefined,
      undefined,
      customHeaders,
    );
  }

  // UPDATE PROFILE IMAGE
  if (operation === 'updateProfileImage') {
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
      `/devices/${deviceId}/profile/image`,
      body,
    );
  }

  throw new Error(`The operation "${operation}" is not supported for profile!`);
}
