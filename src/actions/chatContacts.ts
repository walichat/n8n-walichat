import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { request } from '../request';
import { countries } from '../constants/countries';

export const chatContactProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['chat-contacts'],
      },
    },
    options: [
      {
        name: 'Get Contacts',
        value: 'getDeviceContacts',
        description: 'Get a list of contacts',
      },
      {
        name: 'Get Contact Details',
        value: 'getDeviceContactDetails',
        description: 'Get details of a specific contact',
      },
      {
        name: 'Create Contact',
        value: 'createContact',
        description: 'Create a new contact',
      },
      {
        name: 'Update Contact',
        value: 'updateContact',
        description: 'Update an existing contact',
      },
      {
        name: 'Update Contact Metadata',
        value: 'updateContactMetadata',
        description: 'Update metadata for a contact',
      },
      {
        name: 'Upsert Contact Metadata',
        value: 'upsertContactMetadata',
        description: 'Partially update contact metadata',
      },
      {
        name: 'Delete Contact',
        value: 'deleteContact',
        description: 'Delete a contact',
      },
      {
        name: 'Bulk Create Contacts',
        value: 'bulkCreateContacts',
        description: 'Create multiple contacts at once',
      },
      {
        name: 'Block Contacts',
        value: 'blockContacts',
        description: 'Block multiple contacts',
      },
      {
        name: 'Unblock Contacts',
        value: 'unblockContacts',
        description: 'Unblock multiple contacts',
      },
    ],
    default: 'getDeviceContacts',
  },
  {
    displayName: 'WhatsApp Number',
    name: 'deviceId',
    type: 'string',
    required: true,
    default: '',
    typeOptions: {
      loadOptionsMethod: 'getDevices',
    },
    displayOptions: {
      show: {
        resource: ['chat-contacts'],
      },
    },
    description: 'The ID of the WhatsApp number',
  },

  // CONTACT ID PARAMETER FOR SINGLE CONTACT OPERATIONS
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['chat-contacts'],
        operation: [
          'getDeviceContactDetails',
          'updateContact',
          'updateContactMetadata',
          'upsertContactMetadata',
          'deleteContact',
        ],
      },
    },
    description: 'The ID of the contact (e.g., 447362053576@c.us)',
  },

  // GET CONTACTS FILTERS
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['chat-contacts'],
        operation: ['getDeviceContacts'],
      },
    },
    options: [
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Search contacts by name, phone, email, etc.',
      },
      {
        displayName: 'Contact Type',
        name: 'type',
        type: 'multiOptions',
        options: [
          { name: 'Personal', value: 'personal' },
          { name: 'Business', value: 'business' },
          { name: 'User (Both Personal and Business)', value: 'user' },
          { name: 'Group', value: 'group' },
          { name: 'Channel', value: 'channel' },
          { name: 'Private', value: 'private' },
        ],
        default: [],
        description: 'Filter contacts by type',
      },
      {
        displayName: 'Has',
        name: 'has',
        type: 'multiOptions',
        options: [
          { name: 'Email', value: 'email' },
          { name: 'Chat', value: 'chat' },
        ],
        default: [],
        description: 'Filter contacts that have email, chat, or both',
      },
      {
        displayName: 'Has Chat',
        name: 'hasChat',
        type: 'boolean',
        default: false,
        description: 'Filter contacts with or without a WhatsApp chat (deprecated, use has=chat instead)',
      },
      {
        displayName: 'Country',
        name: 'country',
        type: 'multiOptions',
        options: [{ name: 'Any country', value: '' }].concat(countries.map(country => ({ name: country.name + ' ' + country.flag, value: country.code }))),
        default: '',
        placeholder: 'Select countries',
        description: 'Filter contacts by country codes',
        required: false
      },
      {
        displayName: 'Labels',
        name: 'labels',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Filter contacts by chat labels. Use * to include any labeled chat.',
      },
      {
        displayName: 'Exclude Labels',
        name: 'labelsExclude',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Exclude contacts with specific labels. Use * to exclude any labeled chat.',
      },
      {
        displayName: 'Include Items',
        name: 'include',
        type: 'multiOptions',
        options: [
          { name: 'Chat', value: 'chat' },
        ],
        default: [],
        description: 'Include related entities in the response',
      },
      {
        displayName: 'Metadata Key',
        name: 'metadataKey',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Filter contacts with specific metadata keys',
      },
      {
        displayName: 'Metadata Value',
        name: 'metadataValue',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Filter contacts with specific metadata values',
      },
      {
        displayName: 'Created After',
        name: 'after',
        type: 'dateTime',
        default: '',
        description: 'Filter contacts created after this date',
      },
      {
        displayName: 'Created Before',
        name: 'before',
        type: 'dateTime',
        default: '',
        description: 'Filter contacts created before this date',
      },
      {
        displayName: 'Updated After',
        name: 'updatedAfter',
        type: 'dateTime',
        default: '',
        description: 'Filter contacts updated after this date',
      },
      {
        displayName: 'Updated Before',
        name: 'updatedBefore',
        type: 'dateTime',
        default: '',
        description: 'Filter contacts updated before this date',
      },
      {
        displayName: 'Last Message After',
        name: 'lastMessageAfter',
        type: 'dateTime',
        default: '',
        description: 'Filter contacts with last message after this date',
      },
      {
        displayName: 'Last Message Before',
        name: 'lastMessageBefore',
        type: 'dateTime',
        default: '',
        description: 'Filter contacts with last message before this date',
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
          { name: 'Name A-Z', value: 'name:asc' },
          { name: 'Name Z-A', value: 'name:desc' },
          { name: 'Recently Created', value: 'createdAt:desc' },
          { name: 'Oldest Created', value: 'createdAt:asc' },
          { name: 'Recently Updated', value: 'updatedAt:desc' },
          { name: 'Oldest Updated', value: 'updatedAt:asc' },
        ],
        default: 'name:asc',
        description: 'Sort order for results',
      },
    ],
  },

  // GET CONTACT DETAILS OPTIONS
  {
    displayName: 'Include Items',
    name: 'include',
    type: 'multiOptions',
    displayOptions: {
      show: {
        resource: ['chat-contacts'],
        operation: ['getDeviceContactDetails'],
      },
    },
    options: [
      { name: 'Chat', value: 'chat' },
    ],
    default: [],
    description: 'Include related entities in the response',
  },

  // CONTACT METADATA FIELDS
  {
    displayName: 'Metadata',
    name: 'metadata',
    placeholder: 'Add Metadata',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
    },
    default: {},
    displayOptions: {
      show: {
        resource: ['chat-contacts'],
        operation: ['updateContactMetadata', 'upsertContactMetadata'],
      },
    },
    options: [
      {
        name: 'metadataValues',
        displayName: 'Metadata',
        values: [
          {
            displayName: 'Key',
            name: 'key',
            type: 'string',
            default: '',
            description: 'Metadata key (alphanumeric and underscore characters only)',
          },
          {
            displayName: 'Value',
            name: 'value',
            type: 'string',
            default: '',
            description: 'Metadata value (up to 300 characters)',
          },
        ],
      },
    ],
    description: 'Metadata key-value pairs for the contact',
  },

  // CREATE/UPDATE CONTACT COMMON FIELDS
  {
    displayName: 'Phone Number',
    name: 'phone',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['chat-contacts'],
        operation: ['createContact'],
      },
    },
    description: 'Phone number in E.164 format (e.g., +447362053576)',
  },
  {
    displayName: 'Contact Fields',
    name: 'contactFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['chat-contacts'],
        operation: ['createContact', 'updateContact'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Contact\'s first name (max 30 characters)',
      },
      {
        displayName: 'Surname',
        name: 'surname',
        type: 'string',
        default: '',
        description: 'Contact\'s last name (max 50 characters)',
      },
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        description: 'Contact\'s title (max 15 characters)',
      },
      {
        displayName: 'Contact Type',
        name: 'kind',
        type: 'options',
        options: [
          { name: 'Personal', value: 'personal' },
          { name: 'Business', value: 'business' },
        ],
        default: 'personal',
        description: 'Type of contact',
      },
      {
        displayName: 'Gender',
        name: 'gender',
        type: 'options',
        options: [
          { name: 'Male', value: 'male' },
          { name: 'Female', value: 'female' },
          { name: 'Other', value: 'other' },
        ],
        default: '',
        description: 'Contact\'s gender',
      },
      {
        displayName: 'Alternative Phone',
        name: 'altPhone',
        type: 'string',
        default: '',
        description: 'Secondary phone number in E.164 format',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        description: 'Contact\'s email address',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Short description of the contact (max 100 characters)',
      },
      {
        displayName: 'Languages',
        name: 'languages',
        type: 'string',
        typeOptions: {
          multipleValues: true,
          maxValues: 3,
        },
        default: [],
        description: 'Language codes (e.g., en, fr, es)',
      },
      {
        displayName: 'Company Name',
        name: 'companyName',
        type: 'string',
        default: '',
        description: 'Name of the company (max 50 characters)',
      },
      {
        displayName: 'Company Code',
        name: 'companyCode',
        type: 'string',
        default: '',
        description: 'Company code (max 50 characters)',
      },
      {
        displayName: 'Company Tax ID',
        name: 'companyTaxId',
        type: 'string',
        default: '',
        description: 'Company tax ID (max 30 characters)',
      },
      {
        displayName: 'Company Role',
        name: 'companyRole',
        type: 'string',
        default: '',
        description: 'Role in the company (max 30 characters)',
      },
      {
        displayName: 'Company Website',
        name: 'companyWebsite',
        type: 'string',
        default: '',
        description: 'Company website URL',
      },
      {
        displayName: 'Company Email',
        name: 'companyEmail',
        type: 'string',
        default: '',
        description: 'Company email address',
      },
      {
        displayName: 'Company Phone',
        name: 'companyPhone',
        type: 'string',
        default: '',
        description: 'Company phone number in E.164 format',
      },
      {
        displayName: 'Company Country',
        name: 'companyCountry',
        type: 'string',
        default: '',
        description: 'Company country code (ISO 3166-2)',
      },
      {
        displayName: 'Currency',
        name: 'currency',
        type: 'string',
        default: '',
        description: 'Currency code (ISO 4217)',
      },
      {
        displayName: 'Address',
        name: 'address',
        type: 'string',
        default: '',
        description: 'Contact\'s address (max 100 characters)',
      },
      {
        displayName: 'City',
        name: 'city',
        type: 'string',
        default: '',
        description: 'Contact\'s city (max 30 characters)',
      },
      {
        displayName: 'Postal Code',
        name: 'postalCode',
        type: 'string',
        default: '',
        description: 'Contact\'s postal code (max 20 characters)',
      },
      {
        displayName: 'Country',
        name: 'country',
        type: 'string',
        default: '',
        description: 'Country code (ISO 3166-2)',
      },
      {
        displayName: 'Notes',
        name: 'notes',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        description: 'Internal notes about the contact (max 3000 characters)',
      },
      {
        displayName: 'Birthday',
        name: 'birthday',
        type: 'dateTime',
        default: '',
        description: 'Contact\'s birthday',
      },
      {
        displayName: 'Notifications',
        name: 'notifications',
        type: 'options',
        options: [
          { name: 'On', value: 'on' },
          { name: 'Mute', value: 'mute' },
          { name: 'Ignore', value: 'ignore' },
        ],
        default: 'on',
        description: 'Notification settings for this contact',
      },
      {
        displayName: 'Timezone',
        name: 'timezone',
        type: 'string',
        default: '',
        description: 'Contact\'s timezone (e.g., America/New_York)',
      },
      {
        displayName: 'CRM',
        name: 'crm',
        type: 'string',
        default: '',
        description: 'External CRM source name (e.g., hubspot, salesforce)',
      },
      {
        displayName: 'CRM Reference',
        name: 'crmRef',
        type: 'string',
        default: '',
        description: 'External CRM reference ID or URL',
      },
      {
        displayName: 'Sync Across All Numbers',
        name: 'sync',
        type: 'boolean',
        default: false,
        description: 'Whether to sync this contact across all WhatsApp numbers in your account',
      },
      {
        displayName: 'Assign to User',
        name: 'assign',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            resource: ['chat-contacts'],
            operation: ['createContact'],
          },
        },
        description: 'Assign the contact to a specific user by ID (24 hexadecimal characters)',
      },
      {
        displayName: 'Upsert',
        name: 'upsert',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: {
            resource: ['chat-contacts'],
            operation: ['createContact'],
          },
        },
        description: 'If the contact already exists, update it instead of returning an error',
      },
    ],
  },
  {
    displayName: 'Metadata',
    name: 'contactMetadata',
    placeholder: 'Add Metadata',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
    },
    default: {},
    displayOptions: {
      show: {
        resource: ['chat-contacts'],
        operation: ['createContact', 'updateContact'],
      },
    },
    options: [
      {
        name: 'metadataValues',
        displayName: 'Metadata',
        values: [
          {
            displayName: 'Key',
            name: 'key',
            type: 'string',
            default: '',
            description: 'Metadata key (alphanumeric and underscore characters only)',
          },
          {
            displayName: 'Value',
            name: 'value',
            type: 'string',
            default: '',
            description: 'Metadata value (up to 300 characters)',
          },
        ],
      },
    ],
    description: 'Metadata key-value pairs for the contact',
  },
  {
    displayName: 'Fields to Remove',
    name: 'fieldsToRemove',
    type: 'multiOptions',
    displayOptions: {
      show: {
        resource: ['chat-contacts'],
        operation: ['updateContact'],
      },
    },
    options: [
      { name: 'Name', value: 'name' },
      { name: 'Surname', value: 'surname' },
      { name: 'Alternative Phone', value: 'altPhone' },
      { name: 'Email', value: 'email' },
      { name: 'Company Name', value: 'companyName' },
      { name: 'Timezone', value: 'timezone' },
      { name: 'Company Code', value: 'companyCode' },
      { name: 'Company Tax ID', value: 'companyTaxId' },
      { name: 'Company Website', value: 'companyWebsite' },
      { name: 'Company Role', value: 'companyRole' },
      { name: 'Title', value: 'title' },
      { name: 'Company Email', value: 'companyEmail' },
      { name: 'Company Phone', value: 'companyPhone' },
      { name: 'Country', value: 'country' },
      { name: 'Company Country', value: 'companyCountry' },
      { name: 'Address', value: 'address' },
      { name: 'City', value: 'city' },
      { name: 'CRM', value: 'crm' },
      { name: 'CRM Reference', value: 'crmRef' },
      { name: 'Postal Code', value: 'postalCode' },
      { name: 'Notes', value: 'notes' },
      { name: 'Gender', value: 'gender' },
      { name: 'Currency', value: 'currency' },
      { name: 'Birthday', value: 'birthday' },
      { name: 'Description', value: 'description' },
      { name: 'Languages', value: 'languages' },
      { name: 'Links', value: 'links' },
      { name: 'Sync', value: 'sync' },
    ],
    default: [],
    description: 'Fields to remove from the contact',
  },

  // BULK CREATE CONTACTS
  {
    displayName: 'Contacts',
    name: 'contacts',
    placeholder: 'Add Contact',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
    },
    default: {},
    displayOptions: {
      show: {
        resource: ['chat-contacts'],
        operation: ['bulkCreateContacts'],
      },
    },
    options: [
      {
        name: 'contactValues',
        displayName: 'Contact',
        values: [
          {
            displayName: 'Phone Number',
            name: 'phone',
            type: 'string',
            required: true,
            default: '',
            description: 'Phone number in E.164 format (e.g., +447362053576)',
          },
          {
            displayName: 'Name',
            name: 'name',
            type: 'string',
            default: '',
            description: 'Contact\'s first name (max 30 characters)',
          },
          {
            displayName: 'Surname',
            name: 'surname',
            type: 'string',
            default: '',
            description: 'Contact\'s last name (max 50 characters)',
          },
          {
            displayName: 'Email',
            name: 'email',
            type: 'string',
            default: '',
            description: 'Contact\'s email address',
          },
          {
            displayName: 'Company',
            name: 'companyName',
            type: 'string',
            default: '',
            description: 'Contact\'s company name',
          },
        ],
      },
    ],
    description: 'List of contacts to create in bulk (up to 1000)',
  },
  {
    displayName: 'Upsert Existing Contacts',
    name: 'upsert',
    type: 'boolean',
    default: true,
    displayOptions: {
      show: {
        resource: ['chat-contacts'],
        operation: ['bulkCreateContacts'],
      },
    },
    description: 'Whether to update existing contacts if they already exist',
  },

  // BLOCK/UNBLOCK CONTACTS PARAMETERS
  {
    displayName: 'Contact Phone Numbers',
    name: 'contacts',
    type: 'string',
    required: true,
    typeOptions: {
      multipleValues: true,
      minValue: 1,
      maxValue: 50,
    },
    default: [],
    displayOptions: {
      show: {
        resource: ['chat-contacts'],
        operation: ['blockContacts', 'unblockContacts'],
      },
    },
    placeholder: '+12345767890',
    description: 'Phone numbers with international country code prefix in E164 format (1-50 contacts)',
  },
];

export async function executeChatContactOperations(
  this: IExecuteFunctions | any,
  index: number,
) {
  const operation = this.getNodeParameter('operation', index) as string;
  const deviceId = this.getNodeParameter('deviceId', index) as string;

  // GET CONTACTS
  if (operation === 'getDeviceContacts') {
    const filters = this.getNodeParameter('filters', index, {}) as {
      search?: string;
      type?: string[];
      has?: string[];
      hasChat?: boolean;
      country?: string[];
      labels?: string[];
      labelsExclude?: string[];
      include?: string[];
      metadataKey?: string[];
      metadataValue?: string[];
      after?: string;
      before?: string;
      updatedAfter?: string;
      updatedBefore?: string;
      lastMessageAfter?: string;
      lastMessageBefore?: string;
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
      `/chat/${deviceId}/contacts`,
      undefined,
      queryParameters as Record<string, string>,
    );
  }

  // GET CONTACT DETAILS
  if (operation === 'getDeviceContactDetails') {
    const contactId = this.getNodeParameter('contactId', index) as string;
    const include = this.getNodeParameter('include', index, []) as string[];

    const queryParameters: Record<string, string> = {};
    if (include && include.length > 0) {
      queryParameters.include = include.join(',');
    }

    return request(
      this,
      'GET',
      `/chat/${deviceId}/contacts/${contactId}`,
      undefined,
      queryParameters,
    );
  }

  // CREATE CONTACT
  if (operation === 'createContact') {
    const phone = this.getNodeParameter('phone', index) as string;
    const contactFields = this.getNodeParameter('contactFields', index, {}) as object;
    const contactMetadata = this.getNodeParameter('contactMetadata', index, { metadataValues: [] }) as {
      metadataValues: Array<{ key: string; value: string }>;
    };

    const body: Record<string, any> = {
      phone,
      ...contactFields,
    };

    // Add metadata if provided
    if (contactMetadata.metadataValues && contactMetadata.metadataValues.length > 0) {
      body.metadata = contactMetadata.metadataValues;
    }

    return request(
      this,
      'POST',
      `/chat/${deviceId}/contacts`,
      body,
    );
  }

  // UPDATE CONTACT
  if (operation === 'updateContact') {
    const contactId = this.getNodeParameter('contactId', index) as string;
    const contactFields = this.getNodeParameter('contactFields', index, {}) as object;
    const contactMetadata = this.getNodeParameter('contactMetadata', index, { metadataValues: [] }) as {
      metadataValues: Array<{ key: string; value: string }>;
    };
    const fieldsToRemove = this.getNodeParameter('fieldsToRemove', index, []) as string[];

    const body: Record<string, any> = {
      ...contactFields,
    };

    // Add metadata if provided
    if (contactMetadata.metadataValues && contactMetadata.metadataValues.length > 0) {
      body.metadata = contactMetadata.metadataValues;
    }

    // Add fields to remove if specified
    if (fieldsToRemove && fieldsToRemove.length > 0) {
      body.$remove = fieldsToRemove;
    }

    return request(
      this,
      'PATCH',
      `/chat/${deviceId}/contacts/${contactId}`,
      body,
    );
  }

  // UPDATE CONTACT METADATA
  if (operation === 'updateContactMetadata') {
    const contactId = this.getNodeParameter('contactId', index) as string;
    const metadata = this.getNodeParameter('metadata', index, { metadataValues: [] }) as {
      metadataValues: Array<{ key: string; value: string }>;
    };

    if (!metadata.metadataValues || metadata.metadataValues.length === 0) {
      throw new Error('At least one metadata key-value pair is required');
    }

    return request(
      this,
      'PUT',
      `/chat/${deviceId}/contacts/${contactId}/metadata`,
      metadata.metadataValues,
    );
  }

  // UPSERT CONTACT METADATA
  if (operation === 'upsertContactMetadata') {
    const contactId = this.getNodeParameter('contactId', index) as string;
    const metadata = this.getNodeParameter('metadata', index, { metadataValues: [] }) as {
      metadataValues: Array<{ key: string; value: string }>;
    };

    if (!metadata.metadataValues || metadata.metadataValues.length === 0) {
      throw new Error('At least one metadata key-value pair is required');
    }

    return request(
      this,
      'PATCH',
      `/chat/${deviceId}/contacts/${contactId}/metadata`,
      metadata.metadataValues,
    );
  }

  // DELETE CONTACT
  if (operation === 'deleteContact') {
    const contactId = this.getNodeParameter('contactId', index) as string;

    return request(
      this,
      'DELETE',
      `/chat/${deviceId}/contacts/${contactId}`,
    );
  }

  // BULK CREATE CONTACTS
  if (operation === 'bulkCreateContacts') {
    const contacts = this.getNodeParameter('contacts', index, { contactValues: [] }) as {
      contactValues: Array<{
        phone: string;
        name?: string;
        surname?: string;
        email?: string;
        companyName?: string;
      }>;
    };
    const upsert = this.getNodeParameter('upsert', index, true) as boolean;

    if (!contacts.contactValues || contacts.contactValues.length === 0) {
      throw new Error('At least one contact is required');
    }

    const queryParameters: Record<string, string> = {};
    if (upsert !== true) {
      queryParameters.upsert = upsert.toString();
    }

    return request(
      this,
      'PATCH',
      `/chat/${deviceId}/contacts`,
      contacts.contactValues,
      queryParameters,
    );
  }

  // BLOCK CONTACTS
  if (operation === 'blockContacts') {
    const contacts = this.getNodeParameter('contacts', index, []) as string[];

    if (!contacts || contacts.length === 0) {
      throw new Error('At least one contact phone number is required');
    }

    if (contacts.length > 50) {
      throw new Error('Maximum of 50 contacts can be blocked at once');
    }

    return request(
      this,
      'POST',
      `/devices/${deviceId}/block`,
      { contacts },
    );
  }

  // UNBLOCK CONTACTS
  if (operation === 'unblockContacts') {
    const contacts = this.getNodeParameter('contacts', index, []) as string[];

    if (!contacts || contacts.length === 0) {
      throw new Error('At least one contact phone number is required');
    }

    if (contacts.length > 50) {
      throw new Error('Maximum of 50 contacts can be unblocked at once');
    }

    return request(
      this,
      'DELETE',
      `/devices/${deviceId}/block`,
      { contacts },
    );
  }

  throw new Error(`The operation "${operation}" is not supported for chat contacts!`);
}
