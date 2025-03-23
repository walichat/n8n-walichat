import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { request } from '../request';

export const catalogProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['catalog'],
      },
    },
    options: [
      {
        name: 'Get My Catalog',
        value: 'getCatalog',
        description: 'Get your WhatsApp Business catalog information',
      },
      {
        name: 'Query Business Catalog',
        value: 'queryCatalog',
        description: 'Query catalog for any WhatsApp Business number',
      },
    ],
    default: 'getCatalog',
  },
  {
    displayName: 'WhatsApp Number',
    name: 'deviceId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['catalog'],
      },
    },
    description: 'The ID of your WhatsApp Business number',
  },

  // GET CATALOG OPTIONS
  {
    displayName: 'Pagination',
    name: 'pagination',
    type: 'collection',
    placeholder: 'Add Pagination Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['catalog'],
        operation: ['getCatalog'],
      },
    },
    options: [
      {
        displayName: 'Page Size',
        name: 'size',
        type: 'number',
        default: 100,
        description: 'Number of products to return per page',
        typeOptions: {
          minValue: 1,
          maxValue: 500,
        },
      },
      {
        displayName: 'Page Number',
        name: 'page',
        type: 'number',
        default: 0,
        description: 'Page number to return (starting from 0)',
        typeOptions: {
          minValue: 0,
        },
      },
    ],
  },

  // QUERY CATALOG OPTIONS
  {
    displayName: 'Business Phone Number',
    name: 'phone',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['catalog'],
        operation: ['queryCatalog'],
      },
    },
    description: 'The phone number of the WhatsApp Business account to query (e.g. +1234567890)',
  },
  {
    displayName: 'Products to Return',
    name: 'size',
    type: 'number',
    required: false,
    default: 100,
    displayOptions: {
      show: {
        resource: ['catalog'],
        operation: ['queryCatalog'],
      },
    },
    description: 'Number of catalog product items to retrieve (max 500)',
    typeOptions: {
      minValue: 1,
      maxValue: 500,
    },
  },
];

export async function executeCatalogOperations(
  this: IExecuteFunctions | any,
  index: number,
) {
  const operation = this.getNodeParameter('operation', index) as string;
  const deviceId = this.getNodeParameter('deviceId', index) as string;

  // GET MY CATALOG
  if (operation === 'getCatalog') {
    const pagination = this.getNodeParameter('pagination', index, {}) as {
      size?: number;
      page?: number;
    };

    const queryParameters: Record<string, string> = {};

    if (pagination.size) {
      queryParameters.size = pagination.size.toString();
    }

    if (pagination.page !== undefined) {
      queryParameters.page = pagination.page.toString();
    }

    return request(
      this,
      'GET',
      `/devices/${deviceId}/catalog`,
      undefined,
      queryParameters,
    );
  }

  // QUERY BUSINESS CATALOG
  if (operation === 'queryCatalog') {
    const phone = this.getNodeParameter('phone', index) as string;
    const size = this.getNodeParameter('size', index, 100) as number;

    const body: {
      phone: string;
      size?: number;
    } = {
      phone,
    };

    if (size !== 100) {
      body.size = size;
    }

    return request(
      this,
      'POST',
      `/devices/${deviceId}/catalog`,
      body,
    );
  }

  throw new Error(`The operation "${operation}" is not supported for catalog!`);
}
