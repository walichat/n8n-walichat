import { INodeType, IExecuteFunctions, INodeTypeDescription, INodeExecutionData, NodeConnectionType } from 'n8n-workflow';
import { BaseNode } from '../Base/BaseNode';
import { globalProperties } from '../globalProperties';
import { countries } from '../../constants';

export class ValidateNumbers extends BaseNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Validate phone numbers',
    name: 'walichatValidateNumbers',
    group: ['Validate'],
    version: 1,
    icon: 'file:../../../icon.png',
    description: 'Validate and normalize a list of phone numbers using the WaliChat API',
    defaults: {
      name: 'Validate Numbers',
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
        displayName: 'Country',
        name: 'country',
        type: 'options',
        options: countries.map(country => ({ name: country.name, value: country.code })),
        default: '',
        placeholder: 'Select the country code...',
        description: 'The country code for the phone numbers.',
        required: false,
      },
      {
        displayName: 'Phone Numbers',
        name: 'phoneNumbers',
        type: 'string',
        default: '',
        placeholder: 'Enter the phone numbers separated by commas...',
        description: 'The phone numbers to validate and normalize.',
        required: true,
      },
      {
        displayName: 'Poll Options',
        name: 'pollOptions',
        type: 'string',
        default: '',
        placeholder: 'Enter the poll options separated by commas...',
        description: 'The poll options to include in the poll.',
        required: false,
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const apiKey = this.getNodeParameter('apiKey', i) as string;
      const country = this.getNodeParameter('country', i) as string;
      const phoneNumbers = this.getNodeParameter('phoneNumbers', i) as string;
      const pollOptions = this.getNodeParameter('pollOptions', i) as string;

      const requestBody: any = {
        country,
        numbers: phoneNumbers.split(',').map(phone => ({ phone: phone.trim() })),
        poll: {
          name: 'Vote for your favorite color',
          options: pollOptions.split(',').map(option => option.trim()),
        },
      };

      try {
        const response = await super.request({
          path: '/numbers/validate',
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
