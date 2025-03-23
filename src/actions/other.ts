import { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { request } from '../request';
import { countries } from '../constants/countries';

export const otherProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['other'],
      },
    },
    options: [
      {
        name: 'Verify number exists',
        value: 'verifyNumberExists',
        description: 'Check if a phone number exists on WhatsApp',
        action: 'Verify if a phone number exists on WhatsApp',
      },
      {
        name: 'Validate phone numbers',
        value: 'validateNumbers',
        description: 'Validate format and return a normalized list of phone numbers. Does not validate if the number exists on WhatsApp. Use "Verify number exists" for that.',
        action: 'Validate phone numbers format',
      },
      {
        name: 'Send API request',
        value: 'sendRaw',
        description: 'Send a custom request to the WaliChat API',
        action: 'Send a custom API request',
      }
    ],
    default: 'verifyNumberExists',
  },
  // Verify number exists
  {
    displayName: 'Phone Number',
    name: 'phone',
    type: 'string',
    default: '',
    required: true,
    description: 'Phone number in international format (e.g: +1234567890)',
    placeholder: '+1234567890',
    typeOptions: {
      validationRule: 'regex',
      regex: /^\+[1-9]\d{1,14}$/,
      errorMessage: 'Please enter a valid phone number in E.164 format (e.g., +1234567890)',
    },
    displayOptions: {
      show: {
        resource: ['other'],
        operation: ['verifyNumberExists'],
      },
    },
  },
  // Validate numbers
  {
    displayName: 'Country',
    name: 'country',
    type: 'options',
    options: [{ name: 'Any country', value: '' }].concat(countries.map(country => ({ name: country.name + ' ' + country.flag, value: country.code }))),
    default: '',
    placeholder: 'Select the country code...',
    description: 'The country code for the phone numbers.',
    required: false,
    displayOptions: {
      show: {
        resource: ['other'],
        operation: ['validateNumbers'],
      }
    }
  },
  {
    displayName: 'Phone Numbers',
    name: 'phoneNumbers',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
      sortable: true,
    },
    default: {},
    description: 'List of phone numbers to validate and normalize',
    placeholder: 'Add Phone Number',
    options: [
      {
        name: 'numbers',
        displayName: 'Numbers',
        values: [
          {
            displayName: 'Phone number',
            name: 'phone',
            type: 'string',
            default: '',
            description: 'Phone number to validate',
            required: true,
            typeOptions: {
              maxLength: 50,
              errorMessage: 'Please enter a phone number value',
            }
          },
        ],
      },
    ],
    displayOptions: {
      show: {
        resource: ['other'],
        operation: ['validateNumbers'],
      }
    }
  },
  // Send raw request
  {
    displayName: 'API endpoint',
    name: 'urlPath',
    type: 'string',
    default: '',
    placeholder: 'Enter the API endpoint path...',
    description: 'The URL path to be appended to the base URL: https://api.wali.chat/v1',
    required: true,
    displayOptions: {
      show: {
        resource: ['other'],
        operation: ['sendRaw'],
      },
    },
  },
  {
    displayName: 'HTTP Method',
    name: 'httpMethod',
    type: 'options',
    options: [
      { name: 'GET', value: 'GET' },
      { name: 'POST', value: 'POST' },
      { name: 'PUT', value: 'PUT' },
      { name: 'PATCH', value: 'PATCH' },
      { name: 'DELETE', value: 'DELETE' },
    ],
    default: 'GET',
    description: 'The HTTP method to use for the request.',
    required: true,
    displayOptions: {
      show: {
        resource: ['other'],
        operation: ['sendRaw'],
      },
    },
  },
  {
    displayName: 'Headers',
    name: 'headers',
    type: 'fixedCollection',
    placeholder: 'Add Header',
    description: 'The headers to send with the request.',
    typeOptions: {
      multipleValues: true,
    },
    displayOptions: {
      show: {
        resource: ['other'],
        operation: ['sendRaw'],
      },
    },
    default: {},
    options: [
      {
        name: 'header',
        displayName: 'Header',
        values: [
          {
            displayName: 'Key',
            name: 'key',
            type: 'string',
            default: '',
            placeholder: 'Enter header key...',
            description: 'The header key.',
          },
          {
            displayName: 'Value',
            name: 'value',
            type: 'string',
            default: '',
            placeholder: 'Enter header value...',
            description: 'The header value.',
          },
        ],
      },
    ],
  },
  {
    displayName: 'URL Params',
    name: 'urlParams',
    type: 'fixedCollection',
    placeholder: 'Add URL Param',
    description: 'The URL parameters to send with the request.',
    typeOptions: {
      multipleValues: true,
    },
    displayOptions: {
      show: {
        resource: ['other'],
        operation: ['sendRaw'],
      },
    },
    default: {},
    options: [
      {
        name: 'param',
        displayName: 'Param',
        values: [
          {
            displayName: 'Key',
            name: 'key',
            type: 'string',
            default: '',
            placeholder: 'Enter param key...',
            description: 'The URL parameter key.',
          },
          {
            displayName: 'Value',
            name: 'value',
            type: 'string',
            default: '',
            placeholder: 'Enter param value...',
            description: 'The URL parameter value.',
          },
        ],
      },
    ],
  },
  {
    displayName: 'Body',
    name: 'body',
    type: 'json',
    default: '',
    placeholder: 'Enter request body...',
    description: 'The JSON body to send with the request',
    required: false,
    displayOptions: {
      show: {
        resource: ['other'],
        operation: ['sendRaw'],
        httpMethod: ['POST', 'PUT', 'PATCH', 'DELETE'],
      },
    }
  },
];

export async function executeOtherOperations(this: IExecuteFunctions, itemIndex: number) {
  const operation = this.getNodeParameter('operation', itemIndex) as string;

  if (operation === 'verifyNumberExists') {
    const phone = this.getNodeParameter('phone', itemIndex) as string;
    return await request(this, 'POST', '/numbers/exists', { phone });
  }
  else if (operation === 'validateNumbers') {
    const requestBody: IDataObject = {};
    const country = this.getNodeParameter('country', itemIndex) as string;
    const numbers = this.getNodeParameter('phoneNumbers.numbers', itemIndex, []) as {phone: string}[];

    if (country && country !== 'any') {
      requestBody.country = country.slice(0, 2).toUpperCase();
    }

    if (numbers?.length) {
      requestBody.numbers = numbers
        .filter(({ phone }) => phone && typeof phone === 'string')
        .map(({ phone }) => ({ phone: phone.trim() }));
    }

    return await request(this, 'POST', '/numbers/validate', requestBody);
  }
  else if (operation === 'sendRaw') {
    const urlPath = this.getNodeParameter('urlPath', itemIndex) as string;
    const httpMethod = this.getNodeParameter('httpMethod', itemIndex) as string;
    const rawHeaders = this.getNodeParameter('headers.header', itemIndex, []) as Array<{ key: string, value: string }>;
    const urlParams = this.getNodeParameter('urlParams.param', itemIndex, []) as Array<{ key: string, value: string }>;

    // Build query parameters
    const query: Record<string, string> = {};
    if (urlParams?.length) {
      urlParams.forEach(({ key, value }) => {
        query[key] = value;
      });
    }

    // Build custom headers
    const customHeaders: Record<string, string> = {};
    if (rawHeaders?.length) {
      rawHeaders.forEach(({ key, value }) => {
        customHeaders[key] = value;
      });
    }

    // Get request body for non-GET requests
    let body;
    if (httpMethod !== 'GET') {
      try {
        body = this.getNodeParameter('body', itemIndex, {});
        if (typeof body === 'string' && body.trim() !== '') {
          body = JSON.parse(body);
        }
      } catch (error: any) {
        throw new Error(`Invalid JSON in request body: ${error.message}`);
      }
    }

    return await request(
      this,
      httpMethod as any,
      urlPath,
      body,
      query,
      customHeaders
    );
  }

  throw new Error(`Unsupported operation: ${operation}`);
}
