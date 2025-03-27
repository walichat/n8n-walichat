import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { request } from '../request';

export const labelProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['labels'],
      },
    },
    options: [
      {
        name: 'Get Labels',
        value: 'getLabels',
        description: 'Get labels',
      },
      {
        name: 'Create Label',
        value: 'createLabel',
        description: 'Create a new label',
      },
      {
        name: 'Update Label',
        value: 'updateLabel',
        description: 'Update an existing label',
      },
      {
        name: 'Delete Label',
        value: 'deleteLabel',
        description: 'Delete a label by name',
      },
    ],
    default: 'getLabels',
  },
  {
    displayName: 'WhatsApp number',
    name: 'device',
    type: 'string',
    required: true,
    default: '',
    typeOptions: {
      loadOptionsMethod: 'getDevices',
    },
    displayOptions: {
      show: {
        resource: ['labels'],
      },
    },
    description: 'The ID of the WhatsApp number',
  },
  // CREATE LABEL
  {
    displayName: 'Label Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['labels'],
        operation: ['createLabel', 'updateLabel', 'deleteLabel'],
      },
    },
    description: 'The name of the label',
  },
  {
    displayName: 'Label Color',
    name: 'color',
    type: 'options',
    required: true,
    default: 'blue',
    displayOptions: {
      show: {
        resource: ['labels'],
        operation: ['createLabel', 'updateLabel'],
      },
    },
    options: [
      { name: 'Ruby', value: 'ruby' },
      { name: 'Tomato', value: 'tomato' },
      { name: 'Orange', value: 'orange' },
      { name: 'Sunflower', value: 'sunflower' },
      { name: 'Bubble', value: 'bubble' },
      { name: 'Rose', value: 'rose' },
      { name: 'Poppy', value: 'poppy' },
      { name: 'Rouge', value: 'rouge' },
      { name: 'Raspberry', value: 'raspberry' },
      { name: 'Purple', value: 'purple' },
      { name: 'Lavender', value: 'lavender' },
      { name: 'Violet', value: 'violet' },
      { name: 'Pool', value: 'pool' },
      { name: 'Emerald', value: 'emerald' },
      { name: 'Kelly', value: 'kelly' },
      { name: 'Apple', value: 'apple' },
      { name: 'Turquoise', value: 'turquoise' },
      { name: 'Aqua', value: 'aqua' },
      { name: 'Gold', value: 'gold' },
      { name: 'Latte', value: 'latte' },
      { name: 'Cocoa', value: 'cocoa' },
      { name: 'Iron', value: 'iron' },
    ],
    description: 'The color of the label',
  },
  {
    displayName: 'Description',
    name: 'description',
    type: 'string',
    required: false,
    default: '',
    displayOptions: {
      show: {
        resource: ['labels'],
        operation: ['createLabel', 'updateLabel'],
      },
    },
    description: 'A short description of the label',
  },
];

export async function executeLabelOperations(
  this: IExecuteFunctions | any,
  index: number,
) {
  const operation = this.getNodeParameter('operation', index) as string;
  const device = this.getNodeParameter('device', index) as string;

  if (operation === 'getLabels') {
    // GET /devices/{device}/labels
    return request(
      this,
      'GET',
      `/devices/${device}/labels`,
    );
  }

  if (operation === 'createLabel') {
    // POST /devices/{device}/labels
    const name = this.getNodeParameter('name', index) as string;
    const color = this.getNodeParameter('color', index) as string;
    const description = this.getNodeParameter('description', index) as string;

    const body: {
      name: string;
      color: string;
      description?: string;
    } = {
      name,
      color,
    };

    if (description) {
      body.description = description;
    }

    return request(
      this,
      'POST',
      `/devices/${device}/labels`,
      body,
    );
  }

  if (operation === 'updateLabel') {
    // PATCH /devices/{device}/labels
    const name = this.getNodeParameter('name', index) as string;
    const color = this.getNodeParameter('color', index) as string;
    const description = this.getNodeParameter('description', index) as string;

    const body: {
      name: string;
      color: string;
      description?: string;
    } = {
      name,
      color,
    };

    if (description) {
      body.description = description;
    }

    return request(
      this,
      'PATCH',
      `/devices/${device}/labels`,
      body,
    );
  }

  if (operation === 'deleteLabel') {
    // DELETE /devices/{device}/labels
    const name = this.getNodeParameter('name', index) as string;

    return request(
      this,
      'DELETE',
      `/devices/${device}/labels`,
      { name },
    );
  }

  throw new Error(`The operation "${operation}" is not supported for labels!`);
}
