import { INodeProperties } from 'n8n-workflow';
import { globalProperties } from '../globalProperties';

export const commonProperties: INodeProperties[] = [
  ...globalProperties,
  {
    displayName: 'Device ID',
    name: 'device',
    type: 'options',
    default: '',
    placeholder: 'Select the WaliChat Device ID...',
    description: 'The target WaliChat Device ID to be used for message delivery.',
    required: true,
    typeOptions: {
      loadOptionsMethod: 'getDevices',
    },
  },
  {
    displayName: 'Target',
    name: 'target',
    type: 'options',
    options: [
      {
        name: 'Phone',
        value: 'phone',
      },
      {
        name: 'Group',
        value: 'group',
      },
      {
        name: 'Channel',
        value: 'channel',
      },
    ],
    default: 'phone',
    description: 'Select type of target chat',
  },
  {
    displayName: 'Phone Number',
    name: 'phone',
    type: 'string',
    default: '',
    placeholder: 'Enter the phone number...',
    description: 'The phone number to send the message to with international country prefix, e.g: +1234567890',
    required: true,
    displayOptions: {
      show: {
        target: ['phone'],
      },
    },
    // validate: (value: string) => {
    //   const e164Regex = /^\+?[1-9]\d{1,14}$/;
    //   if (!e164Regex.test(value)) {
    //     return 'Invalid phone number format. Please enter a valid phone number in E164 format with international prefix.';
    //   }
    //   return true;
    // },
  },
  {
    displayName: 'Group ID',
    name: 'groupId',
    type: 'options',
    default: '',
    placeholder: 'Enter the group ID...',
    description: 'The ID of the target group chat, e.g: 12345678902401234@g.us',
    required: true,
    displayOptions: {
      show: {
        target: ['group'],
      },
    },
    typeOptions: {
      loadOptionsMethod: 'getGroups',
    },
  },
  {
    displayName: 'Channel ID',
    name: 'channel',
    type: 'options',
    default: '',
    placeholder: 'Enter the channel ID...',
    description: 'The channel ID to send the message to, e.g: 12345678902402200@newsletter',
    required: true,
    displayOptions: {
      show: {
        target: ['channel'],
      },
    },
    typeOptions: {
      loadOptionsMethod: 'getGroups',
    },
  },
  {
    displayName: 'File URL',
    name: 'fileUrl',
    type: 'string',
    default: '',
    placeholder: 'Enter the file URL...',
    description: 'The URL of the file to send.',
    required: false,
  },
  {
    displayName: 'File',
    name: 'file',
    type: 'options',
    default: '',
    placeholder: 'Enter the file ID to send...',
    description: 'The path of the file to send.',
    required: false,
    typeOptions: {
      loadOptionsMethod: 'getFiles',
    },
  },
];
