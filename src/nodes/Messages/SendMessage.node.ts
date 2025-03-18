import { INodeType, INodeTypeDescription, INodeExecutionData, IExecuteFunctions, NodeConnectionType } from 'n8n-workflow';
import { BaseNode } from '../Base/BaseNode';
import { commonProperties } from './commonProperties';
import { getFiles, getDevices } from '../methods';

export class SendMessage extends BaseNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Send WhatsApp message',
    name: 'walichatSendMessage',
    group: ['Messages'],
    version: 1,
    icon: 'file:../../../icon.png',
    description: 'Send a text message using the WaliChat API',
    defaults: {
      name: 'Send Message',
      color: '#1A82e2',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'WaliChatApiKey',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        default: '',
        placeholder: 'Enter the message text...',
        description: 'The text message to send.',
        required: true,
      },
      {
        displayName: 'Delivery Date',
        name: 'deliverAt',
        type: 'string',
        validateType: 'dateTime',
        default: '',
        placeholder: 'Enter the delivery date: 2025-06-01T12:30:00Z',
        description: 'The date and time to deliver the message (ISO 8601 format). E.g: 2025-06-01T12:30:00Z',
        required: false,
      },
      ...commonProperties,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const apiKey = this.getNodeParameter('apiKey', i) as string;
      const device = this.getNodeParameter('device', i) as string;
      const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
      const message = this.getNodeParameter('message', i) as string;
      const deliverAt = this.getNodeParameter('deliverAt', i) as string;

      const requestBody: any = {
        device,
        phone: phoneNumber,
        message,
      };

      if (deliverAt) {
        requestBody.deliverAt = deliverAt;
      }

      try {
        const response = await super.request({
          path: '/messages',
          method: 'POST',
          body: requestBody,
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });

        returnData.push({
          json: response,
        });
      } catch (error: any) {
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
