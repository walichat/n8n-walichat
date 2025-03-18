import { INodeType, INodeTypeDescription, INodeExecutionData, IExecuteFunctions, NodeConnectionType } from 'n8n-workflow';
import { BaseNode } from '../Base/BaseNode';
import { globalProperties } from '../globalProperties';

export class RawRequest extends BaseNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'WaliChat Send API Request',
    name: 'rawRequest',
    group: ['transform'],
    version: 1,
    icon: 'file:../../../icon.png',
    description: 'Send arbitrary HTTP requests to the WaliChat API',
    defaults: {
      name: 'Send API Request',
      color: '#1A82e2',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    properties: [
      ...globalProperties,
      {
        displayName: 'URL Path',
        name: 'urlPath',
        type: 'string',
        default: '',
        placeholder: 'Enter the URL path...',
        description: 'The URL path to be appended to the base URL.',
        required: true,
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
        description: 'The body to send with the request (for POST, PUT, PATCH methods).',
        required: false,
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const apiKey = this.getNodeParameter('apiKey', i) as string;
      const urlPath = this.getNodeParameter('urlPath', i) as string;
      const httpMethod = this.getNodeParameter('httpMethod', i) as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';
      const headers = this.getNodeParameter('headers.header', i, []) as Array<{ key: string, value: string }>;
      const urlParams = this.getNodeParameter('urlParams.param', i, []) as Array<{ key: string, value: string }>;
      const body = this.getNodeParameter('body', i, {}) as object;

      const requestHeaders: { [key: string]: string } = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      };
      headers.forEach(header => {
        requestHeaders[header.key] = header.value;
      });

      const requestParams: { [key: string]: string } = {};
      urlParams.forEach(param => {
        requestParams[param.key] = param.value;
      });

      const payload = {
        path: urlPath,
        method: httpMethod,
        body: httpMethod !== 'GET' ? body : undefined,
        query: requestParams,
        headers: requestHeaders,
      }

      if (httpMethod !== 'GET' && body) {
        payload.headers['Content-Type'] = 'application/json';
        payload.body = body;
      }

      try {
        const response = await super.request(payload);
        returnData.push({
          json: response,
        });
      } catch (error) {
        returnData.push({
          json: {
            error: (error as Error).message,
          },
        });
      }
    }

    return [returnData];
  }
}
