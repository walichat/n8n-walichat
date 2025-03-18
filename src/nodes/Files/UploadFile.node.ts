import { INodeType, INodeTypeDescription, INodeExecutionData, IExecuteFunctions, NodeConnectionType } from 'n8n-workflow';
import { BaseNode } from '../Base/BaseNode';
import { globalProperties } from '../globalProperties';

export class UploadFile extends BaseNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Upload file',
    name: 'walichatUploadFile',
    group: ['Files'],
    version: 1,
    description: 'Upload a file from a remote URL using the WaliChat API',
    icon: 'file:../../../icon.png',
    defaults: {
      name: 'Upload File',
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
        displayName: 'File URL',
        name: 'fileUrl',
        type: 'string',
        default: '',
        placeholder: 'Enter the file URL...',
        description: 'The URL of the file to upload.',
        required: true,
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const apiKey = this.getNodeParameter('apiKey', i) as string;
      const fileUrl = this.getNodeParameter('fileUrl', i) as string;

      try {
        const response = await super.request({
          path: '/files',
          method: 'POST',
          body: { url: fileUrl },
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
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
