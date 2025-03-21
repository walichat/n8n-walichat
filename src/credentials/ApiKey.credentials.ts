import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class ApiKey implements ICredentialType {
  name = 'apiKey';
  displayName = 'WaliChat API Key';
  documentationUrl = 'https://app.wali.chat/docs';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      default: '',
      required: true,
    },
  ];
}
