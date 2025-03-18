import { NodeConnectionType, IExecuteFunctions, INodeType, INodeTypeDescription, INodeExecutionData } from 'n8n-workflow';

import { SendMessage } from './nodes/Messages/SendMessage.node';
import { RawRequest } from './nodes/RawRequest/RawRequest.node';
import { UploadFile } from './nodes/Files/UploadFile.node';
import { Webhook } from './nodes/Webhooks/Webhook.node';

import { ValidateNumbers } from './nodes/Validator/ValidateNumbers.node';
import { VerifyNumberExists } from './nodes/Validator/VerifyNumberExists.node';

export class WaliChat implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'WaliChat',
    name: 'WaliChat',
    group: ['WaliChat'],
    version: 1,
    description: 'Integration for WaliChat WhatsApp API',
    icon: 'file:../icon.png',
    defaults: {
      name: 'WaliChat',
      color: '#3276ed',
    },
    credentials: [
      {
        name: 'ApiKey',
        required: true,
      },
    ],
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    properties: [],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // This method is not used in the main module
    return [];
  }
}

export const nodes = [
  SendMessage,
  UploadFile,
  RawRequest,
  VerifyNumberExists,
  ValidateNumbers,
  Webhook,
];
