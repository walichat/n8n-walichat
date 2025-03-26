import { INodeType, INodeTypeDescription, IExecuteFunctions, NodeConnectionType } from 'n8n-workflow';
import * as options from './methods';
import { teamProperties, executeTeamOperations } from '../actions/team';
import { messageProperties, executeMessageOperations } from '../actions/send-messages';
import { otherProperties, executeOtherOperations } from '../actions/other';
import { labelProperties, executeLabelOperations } from '../actions/labels';
import { channelProperties, executeChannelOperations } from '../actions/channels';
import { groupProperties, executeGroupOperations } from '../actions/groups';
import { catalogProperties, executeCatalogOperations } from '../actions/catalog';
import { meetingLinkProperties, executeMeetingLinkOperations } from '../actions/meeting-links';
import { userStatusProperties, executeUserStatusOperations } from '../actions/userStatus';
import { sessionProperties, executeSessionOperations } from '../actions/session';
import { quickReplyProperties, executeQuickReplyOperations } from '../actions/quick-replies';
import { queueProperties, executeQueueOperations } from '../actions/queue';
import { profileProperties, executeProfileOperations } from '../actions/profile';
import { departmentProperties, executeDepartmentOperations } from '../actions/departments';
import { campaignProperties, executeCampaignOperations } from '../actions/campaigns';
import { chatProperties, executeChatOperations } from '../actions/chats';
import { chatContactProperties, executeChatContactOperations } from '../actions/chatContacts';
import { chatMessageProperties, executeChatMessageOperations } from '../actions/chatMessages';
import { chatFileProperties, executeChatFileOperations } from '../actions/chatFiles';
import { outboundMessageProperties, executeOutboundMessageOperations } from '../actions/outboundMessages';
import { outboundFileProperties, executeOutboundFileOperations } from '../actions/outboundFiles';
import { webhookProperties, executeWebhookOperations } from '../actions/webhooks';
import { numberProperties, executeNumberOperations } from '../actions/numbers';

export class WaliChat implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'WaliChat',
    name: 'walichat',
    icon: 'file:icon.png',
    group: ['output'],
    version: 1,
    subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
    description: 'Interact with WaliChat WhatsApp API',
    defaults: {
      name: 'WaliChat',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'apiKey',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Send messages',
            value: 'send-messages',
          },
          {
            name: 'Outbound Messages',
            value: 'outbound-messages',
          },
          {
            name: 'WhatsApp Numbers',
            value: 'numbers',
          },
          {
            name: 'Groups',
            value: 'groups',
          },
          {
            name: 'Channels',
            value: 'channels',
          },
          {
            name: 'Chats',
            value: 'chats',
          },
          {
            name: 'Chat Contacts',
            value: 'chat-contacts',
          },
          {
            name: 'Chat Messages',
            value: 'chat-messages',
          },
          {
            name: 'Chat Files',
            value: 'chat-files',
          },
          {
            name: 'Contacts',
            value: 'contacts',
          },
          {
            name: 'Team',
            value: 'team',
          },
          {
            name: 'Labels',
            value: 'labels',
          },
          {
            name: 'Departments',
            value: 'departments'
          },
          {
            name: 'Files',
            value: 'outbound-files',
          },
          {
            name: 'Quick replies',
            value: 'quick-replies',
          },
          {
            name: 'Queue',
            value: 'queue',
          },
          {
            name: 'WhatsApp session',
            value: 'session',
          },
          {
            name: 'WhatsApp profile',
            value: 'profile'
          },
          {
            name: 'Business catalog',
            value: 'catalog',
          },
          {
            name: 'Campaigns',
            value: 'campaigns',
          },
          {
            name: 'Meeting Links',
            value: 'meeting-links',
          },
          {
            name: 'User Status',
            value: 'user-status',
          },
          {
            name: 'Webhooks',
            value: 'webhooks',
          },
          {
            name: 'Other',
            value: 'other',
          }
        ],
        default: 'send-messages',
      },
      ...messageProperties,
      ...teamProperties,
      ...labelProperties,
      ...channelProperties,
      ...groupProperties,
      ...catalogProperties,
      ...meetingLinkProperties,
      ...userStatusProperties,
      ...sessionProperties,
      ...quickReplyProperties,
      ...queueProperties,
      ...profileProperties,
      ...departmentProperties,
      ...campaignProperties,
      ...chatProperties,
      ...chatContactProperties,
      ...chatMessageProperties,
      ...chatFileProperties,
      ...outboundMessageProperties,
      ...outboundFileProperties,
      ...webhookProperties,
      ...numberProperties,
      ...otherProperties,
    ],
  };

  methods = {
    loadOptions: { ...options }
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const returnData = [];

    for (let i = 0; i < items.length; i += 1) {
      try {
        const resource = this.getNodeParameter('resource', i) as string;

        let result;
        if (resource === 'send-message') {
          result = await executeMessageOperations.call(this, i);
        } else if (resource === 'team') {
          result = await executeTeamOperations.call(this, i);
        } else if (resource === 'labels') {
          result = await executeLabelOperations.call(this, i);
        } else if (resource === 'channels') {
          result = await executeChannelOperations.call(this, i);
        } else if (resource === 'groups') {
          result = await executeGroupOperations.call(this, i);
        } else if (resource === 'catalog') {
          result = await executeCatalogOperations.call(this, i);
        } else if (resource === 'meeting-links') {
          result = await executeMeetingLinkOperations.call(this, i);
        } else if (resource === 'user-status') {
          result = await executeUserStatusOperations.call(this, i);
        } else if (resource === 'session') {
          result = await executeSessionOperations.call(this, i);
        } else if (resource === 'quick-replies') {
          result = await executeQuickReplyOperations.call(this, i);
        } else if (resource === 'queue') {
          result = await executeQueueOperations.call(this, i);
        } else if (resource === 'profile') {
          result = await executeProfileOperations.call(this, i);
        } else if (resource === 'departments') {
          result = await executeDepartmentOperations.call(this, i);
        } else if (resource === 'campaigns') {
          result = await executeCampaignOperations.call(this, i);
        } else if (resource === 'chats') {
          result = await executeChatOperations.call(this, i);
        } else if (resource === 'chat-contacts') {
          result = await executeChatContactOperations.call(this, i);
        } else if (resource === 'chat-messages') {
          result = await executeChatMessageOperations.call(this, i);
        } else if (resource === 'chat-files') {
          result = await executeChatFileOperations.call(this, i);
        } else if (resource === 'outbound-messages') {
          result = await executeOutboundMessageOperations.call(this, i);
        } else if (resource === 'outbound-files') {
          result = await executeOutboundFileOperations.call(this, i);
        } else if (resource === 'webhooks') {
          result = await executeWebhookOperations.call(this, i);
        } else if (resource === 'numbers') {
          result = await executeNumberOperations.call(this, i);
        } else if (resource === 'other') {
          result = await executeOtherOperations.call(this, i);
        }

        returnData.push({ json: result });
      } catch (error: any) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: error.message } });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
