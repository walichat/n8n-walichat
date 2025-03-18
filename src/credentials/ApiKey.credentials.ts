import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ApiKey implements ICredentialType {
	name = 'WaliChatApiKey';
	displayName = 'WaliChat API Key';
	// Uses the link to this tutorial as an example
	// Replace with your own docs links when building your own nodes
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
	authenticate = {
		type: 'generic',
		properties: {
			qs: {
				'token': '={{$credentials.apiKey}}'
			}
		},
	} as IAuthenticateGeneric;
}
