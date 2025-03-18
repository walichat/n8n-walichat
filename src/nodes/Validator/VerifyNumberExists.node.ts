import { INodeType, IExecuteFunctions, INodeTypeDescription, INodeExecutionData, NodeConnectionType } from 'n8n-workflow';
import { BaseNode } from '../Base/BaseNode';
import { globalProperties } from '../globalProperties';

export class VerifyNumberExists extends BaseNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Verify number exists',
    name: 'walichatVerifyNumberExists',
    group: ['Validate'],
    version: 1,
    icon: 'file:../../../icon.png',
    description: 'Check if a phone number exists in WhatsApp and can receive messages using the WaliChat API',
    defaults: {
      name: 'Check Number Exists',
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
      ...globalProperties,
      {
        displayName: 'Phone Number',
        name: 'phoneNumber',
        type: 'string',
        default: '',
        placeholder: 'Enter the phone number...',
        description: 'The phone number to check.',
        required: true,
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const apiKey = this.getNodeParameter('apiKey', i) as string;
      const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;

      const requestBody: any = {
        phone: phoneNumber,
      };

      try {
        const response = await super.request({
          path: '/numbers/exists',
          method: 'POST',
          body: requestBody,
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });

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
