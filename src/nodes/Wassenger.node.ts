import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  NodeConnectionType,
  INodeTypeDescription,
  IDataObject,
  INodeTypeBaseDescription,
} from 'n8n-workflow';
import axios from 'axios';
import * as options from './methods'
import { countries } from '../constants/countries'

export class WaliChat implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'WaliChat',
    name: 'walichat',
    icon: 'file:../../icon.png',
    group: ['output'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Automate WhatsApp with WaliChat',
    defaults: {
      name: 'WaliChat',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'apiKey',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Send messages',
            value: 'send-messages',
          },
          {
            name: 'Messages',
            value: 'messages',
          },
          {
            name: 'WhatsApp Numbers',
            value: 'numbers',
          },
          {
            name: 'WhatsApp Numbers',
            value: 'numbers',
          },
          {
            name: 'WhatsApp Groups',
            value: 'groups',
          },
          {
            name: 'WhatsApp Channels',
            value: 'channels',
          },
          {
            name: 'Manage Chats',
            value: 'chats',
          },
          {
            name: 'Manage contacts',
            value: 'contacts',
          },
          {
            name: 'Manage files',
            value: 'files',
          },
          {
            name: 'Other',
            value: 'other',
          }
        ],
        default: 'message',
        description: 'Resource to use',
      },
      // Message operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['send-messages'],
          },
        },
        options: [
          {
            name: 'Send text message',
            value: 'sendText',
            description: 'Send a simple text message',
          },
          {
            name: 'Send multimedia message',
            value: 'sendMedia',
            description: 'Send a message with media attachment',
          },
          {
            name: 'Send scheduled message',
            value: 'sendScheduled',
            description: 'Schedule a message to be sent later',
          }
        ].map(action => ({
          ...action,
          action: action.name
        })),
        default: 'sendText',
      },
      // Other actions
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
          },
          {
            name: 'Validate phone numbers',
            value: 'validateNumbers',
            description: 'Validate format and return a normalized list of phone numbers. Does not validate if the number exists on WhatsApp. Use "Verify number exists" for that.',
          },
          {
            name: 'Send API request',
            value: 'sendRaw',
            description: 'Send a custom request to the WaliChat API',
          }
        ].map(action => ({
          ...action,
          action: action.name
        })),
        default: 'sendText',
      },
      // Common fields for all operations
      {
        displayName: 'Device ID',
        name: 'device',
        type: 'options',
        default: '',
        placeholder: 'Select the WaliChat Number ID...',
        description: 'The target WaliChat Number ID to be used for message delivery.',
        required: true,
        typeOptions: {
          loadOptionsMethod: 'getDevices',
        },
        displayOptions: {
          show: {
            operation: ['sendText', 'sendMedia', 'sendScheduled'],
          },
        },
      },
      {
        displayName: 'Target',
        name: 'target',
        description: 'Select type of target chat',
        type: 'options',
        default: 'phone',
        options: [
          {
            name: 'Phone',
            value: 'phone',
          },
          {
            name: 'Group',
            value: 'group',
          },
          {
            name: 'Channel',
            value: 'channel',
          },
        ],
        displayOptions: {
          show: {
            operation: ['sendText', 'sendMedia', 'sendScheduled'],
          },
        },
      },
      {
        displayName: 'Phone Number',
        name: 'phone',
        type: 'string',
        default: '',
        required: true,
        description: 'Target phone number in international format (e.g: +1234567890)',
        placeholder: '+1234567890',
        typeOptions: {
          validationRule: 'regex',
          regex: /^\+[1-9]\d{1,14}$/,
          errorMessage: 'Please enter a valid phone number in E.164 format (e.g., +1234567890)',
        },
        displayOptions: {
          show: {
            target: ['phone'],
            operation: ['sendText', 'sendMedia', 'sendScheduled'],
          },
        },
      },
      {
        displayName: 'Group ID',
        name: 'groupId',
        type: 'options',
        default: '',
        placeholder: 'Enter the group ID...',
        description: 'The ID of the target group chat, e.g: 12345678902401234@g.us',
        required: true,
        displayOptions: {
          show: {
            target: ['group'],
          },
        },
        typeOptions: {
          maxLength: 50,
          loadOptionsMethod: 'getGroups',
        },
      },
      {
        displayName: 'Channel ID',
        name: 'channel',
        type: 'options',
        default: '',
        placeholder: 'Enter the channel ID...',
        description: 'The channel ID to send the message to, e.g: 12345678902402200@newsletter',
        required: true,
        displayOptions: {
          show: {
            target: ['channel'],
          },
        },
        typeOptions: {
          maxLength: 50,
          loadOptionsMethod: 'getChannels',
        },
      },
      {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        typeOptions: {
          rows: 4,
          maxLength: 6000,
        },
        default: '',
        description: 'Message text to be sent',
        displayOptions: {
          show: {
            operation: ['sendText', 'sendMedia', 'sendScheduled'],
          },
        },
      },
      // Fields specific to Media operation
      {
        displayName: 'File URL',
        name: 'mediaUrl',
        type: 'string',
        default: '',
        required: true,
        typeOptions: {
          validationRule: 'url',
          maxLength: 1000,
          minLength: 5,
        },
        description: 'URL of the media to be sent (image, document, video, audio)',
        displayOptions: {
          show: {
            operation: ['sendMedia'],
          },
        },
      },
      // {
      //   displayName: 'File Name',
      //   name: 'fileName',
      //   type: 'string',
      //   default: '',
      //   description: 'Optional file name for the media (will be auto-detected if not provided)',
      //   displayOptions: {
      //     show: {
      //       operation: ['sendMedia'],
      //     },
      //   },
      // },
      // Fields specific to Scheduled operation
      {
        displayName: 'Delivery date',
        name: 'deliverAt',
        type: 'dateTime',
        default: '',
        required: true,
        description: 'Date and time when the message should be delivered',
        displayOptions: {
          show: {
            operation: ['sendScheduled'],
          },
        },
      },
      // Advanced options for all operations
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
          show: {
            operation: ['sendText', 'sendMedia', 'sendScheduled'],
          },
        },
        options: [
          {
            displayName: 'Priority',
            name: 'priority',
            type: 'options',
            options: [
              { name: 'Normal', value: 'normal' },
              { name: 'High', value: 'high' },
              { name: 'Low', value: 'low' },
            ],
            default: 'normal',
            description: 'Message delivery priority',
          },
          {
            displayName: 'Label',
            name: 'label',
            type: 'string',
            default: '',
            description: 'Custom label to categorize the message',
          },
          {
            displayName: 'Reference ID',
            name: 'referenceId',
            type: 'string',
            default: '',
            description: 'Custom reference ID for the message',
          },
          {
            displayName: 'Team Agent',
            name: 'agent',
            description: 'Optionally send the message in behalf of an agent',
            type: 'options',
            default: '',
            typeOptions: {
              validationRule: 'regex',
              regex: /^\+[1-9]\d{1,14}$/,
              errorMessage: 'Please enter a valid team agent ID (24 characters hexadecimal)',
              maxLength: 24,
              minLength: 24,
              loadOptionsMethod: 'getTeamAgents',
            },
          },
        ],
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
            operation: ['sendRaw'],
            httpMethod: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
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
            operation: ['sendRaw'],
            httpMethod: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
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
            operation: ['sendRaw'],
            httpMethod: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
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
            operation: ['sendRaw'],
            httpMethod: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
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
            operation: ['sendRaw'],
            httpMethod: ['POST', 'PUT', 'PATCH', 'DELETE'],
          },
        }
      },
      // Reference field only visible if the options field is reference
      // {
      //   displayName: 'Reference ID',
      //   name: 'reference',
      //   type: 'string',
      //   default: '',
      //   description: 'Optional reference ID for the message',
      //   displayOptions: {
      //     show: {
      //       options: ['reference'],
      //     },
      //   },
      // },
    ],
  };

  methods = {
    loadOptions: { ...options }
  };

  constructor(baseDescription: INodeTypeBaseDescription) {
    this.description = {
      ...baseDescription,
      ...this.description,
    };
  }

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials('apiKey');
    const apiKey = credentials.apiKey as string;
    const baseUrl = 'https://api.wali.chat/v1';

    for (let i = 0; i < items.length; i += 1) {
      try {
        const operation = this.getNodeParameter('operation', i) as string;
        let requestBody: any = {};
        let method = 'POST' as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';
        let headers: { [key: string]: string } = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        }
        let query: { [key: string]: string } = {}
        let path = '';

        // Handle operation-specific parameters
        if (operation === 'sendMedia' || operation === 'sendScheduled' || operation === 'sendText') {
          path = '/messages';
          const device = this.getNodeParameter('device', i) as string;
          const target = this.getNodeParameter('target', i) as string;
          const message = this.getNodeParameter('message', i) as string;
          const options = this.getNodeParameter('options', i, {}) as IDataObject;

          requestBody.device = device
          if (!device) {
            throw new Error('WhatsApp Device ID is required');
          }
          if (message) {
            requestBody.message = message;
          }
          if (target === 'phone') {
            const phone = this.getNodeParameter('phone', i) as string;
            requestBody.phone = phone;
          } else if (target === 'group') {
            const group = this.getNodeParameter('group', i) as string;
            requestBody.group = group
          } else if (target === 'channel') {
            const channel = this.getNodeParameter('channel', i) as string;
            requestBody.channel = channel
          }
          if (options) {
            requestBody = {
              ...requestBody,
              ...options,
            }
          }

          if (operation === 'sendMedia') {
            const mediaUrl = this.getNodeParameter('mediaUrl', i) as string;
            const format = this.getNodeParameter('mediaFormay', i) as string;
            requestBody.media = {
              url: mediaUrl,
            }
            if (format) {
              requestBody.media.format = format;
            }
          } else if (operation === 'sendScheduled') {
            const deliverAt = this.getNodeParameter('deliverAt', i) as string;
            requestBody.deliverAt = deliverAt;
          }
        }

        // Verify number exists operation
        if (operation === 'verifyNumberExists') {
          path = '/numbers/exists';
          const phone = this.getNodeParameter('phone', i) as string;
          requestBody.phone = phone;
        }
        // Validate phone numbers
        if (operation === 'validateNumbers') {
          path = '/numbers/validate';
          const country = this.getNodeParameter('country', i) as string;
          const numbers = this.getNodeParameter('phoneNumbers.numbers', i) as {phone: string}[];

          if (country) {
            if (country !== 'any') {
              requestBody.country = country.slice(0, 2).toUpperCase()
            }
          }
          if (numbers?.length) {
            requestBody.numbers = numbers
              .filter(({ phone }) => phone && typeof phone === 'string')
              .map(({ phone }) => ({ phone: phone.trim() }))
          }
        }

        // Send raw request operation
        if (operation === 'sendRaw') {
          const urlPath = this.getNodeParameter('urlPath', i) as string;
          const httpMethod = this.getNodeParameter('httpMethod', i) as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';
          const rawHeaders = this.getNodeParameter('headers.header', i, []) as Array<{ key: string, value: string }>;
          const urlParams = this.getNodeParameter('urlParams.param', i, []) as Array<{ key: string, value: string }>;
          const body = this.getNodeParameter('body', i, {}) as object;

          if (!urlPath) {
            throw new Error('URL path is required');
          }
          path = urlPath
          method = httpMethod

          // Request body
          if (body) {
            requestBody = Array.isArray(body) ? body : { ...body }
          }

          // Add headers
          if (rawHeaders?.length) {
            rawHeaders.forEach(({ key, value }) => {
              headers[key] = value
            })
          }

          // Add URL params
          if (urlParams?.length) {
            urlParams.forEach(({ key, value }) => {
              query[key] = value;
            });
          }

          if (httpMethod !== 'GET' && requestBody) {
            headers['Content-Type'] = 'application/json'
          }
        }

        // Make the API request
        const response = await axios.request({
          method,
          url: baseUrl + path,
          data: method === 'GET' ? undefined : requestBody,
          params: query,
          headers,
        });

        returnData.push({
          json: response.data,
          pairedItem: { item: i },
        });
      } catch (error: any) {
        console.error('WaliChat rrror:', error.status, error.message)
        console.error('WaliChat response:', error.response?.data)
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: error.message,
            },
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
