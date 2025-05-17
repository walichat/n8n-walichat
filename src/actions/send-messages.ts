import { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { request } from '../request';

export const messageProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['send-messages'],
      },
    },
    options: [
      {
        name: 'Send text message',
        value: 'sendText',
        description: 'Send a simple text message',
        action: 'Send a text message',
      },
      {
        name: 'Send multimedia message',
        value: 'sendMedia',
        description: 'Send a message with media attachment',
        action: 'Send a multimedia message',
      },
      {
        name: 'Send scheduled message',
        value: 'sendScheduled',
        description: 'Schedule a message to be sent later',
        action: 'Send a scheduled message',
      },
      {
        name: 'Send poll message',
        value: 'sendPoll',
        description: 'Send a poll message with multiple options',
        action: 'Send a poll message',
      },
      {
        name: 'Send votes in a poll',
        value: 'sendPollVote',
        description: 'Vote in an existing poll message',
        action: 'Send votes in a poll',
      },
      {
        name: 'Delete votes in a poll',
        value: 'deletePollVote',
        description: 'Remove all votes from an existing poll',
        action: 'Delete votes in a poll',
      },
      {
        name: 'Send meeting event',
        value: 'sendEvent',
        description: 'Send an event invitation message',
        action: 'Send a meeting event',
      },
      {
        name: 'Send meeting confirmation',
        value: 'confirmEvent',
        description: 'Respond to an event invitation (accept or decline)',
        action: 'Send a meeting confirmation',
      },
      {
        name: 'Send location',
        value: 'sendLocation',
        description: 'Send a location message',
        action: 'Send a location message',
      },
      {
        name: 'Send contacts',
        value: 'sendContacts',
        description: 'Send one or more contact cards',
        action: 'Send contact cards',
      },
      {
        name: 'Send reaction',
        value: 'sendReaction',
        description: 'React to an existing message with an emoji',
        action: 'Send a reaction',
      },
      {
        name: 'Send catalog product',
        value: 'sendProduct',
        description: 'Send a product from a WhatsApp Business catalog',
        action: 'Send a catalog product',
      },
      {
        name: 'Forward message',
        value: 'forwardMessage',
        description: 'Forward an existing message to a chat',
        action: 'Forward a message',
      }
    ],
    default: 'sendText',
  },

  // Common fields for all operations
  {
    displayName: 'WhatsApp number',
    name: 'device',
    type: 'options',
    default: '',
    placeholder: 'Select the WaliChat Number ID...',
    description: 'The target WaliChat Number ID to be used for message delivery.',
    required: true,
    typeOptions: {
      loadOptionsMethod: 'getDevices',
    },
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['sendText', 'sendMedia', 'sendScheduled', 'sendPoll', 'sendPollVote', 'deletePollVote', 'sendEvent', 'confirmEvent', 'sendLocation', 'sendContacts', 'sendReaction', 'sendProduct', 'forwardMessage'],
      },
    },
  },
  {
    displayName: 'Target',
    name: 'target',
    description: 'Select type of target chat',
    type: 'options',
    default: 'phone',
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
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['sendText', 'sendMedia', 'sendScheduled', 'sendPoll', 'sendPollVote', 'deletePollVote', 'sendEvent', 'confirmEvent', 'sendLocation', 'sendContacts', 'sendReaction', 'sendProduct', 'forwardMessage'],
      },
    },
  },
  {
    displayName: 'Phone Number',
    name: 'phone',
    type: 'string',
    default: '',
    required: true,
    description: 'Target phone number in international format (e.g: +1234567890)',
    placeholder: '+1234567890',
    typeOptions: {
      validationRule: 'regex',
      regex: /^\+[1-9]\d{1,14}$/,
      errorMessage: 'Please enter a valid phone number in E.164 format (e.g., +1234567890)',
    },
    displayOptions: {
      show: {
        resource: ['send-messages'],
        target: ['phone'],
        operation: ['sendText', 'sendMedia', 'sendScheduled', 'sendPoll', 'sendPollVote', 'deletePollVote', 'sendEvent', 'confirmEvent', 'sendLocation', 'sendContacts', 'sendReaction', 'sendProduct', 'forwardMessage'],
      },
    },
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
        resource: ['send-messages'],
        target: ['group'],
      },
    },
    typeOptions: {
      maxLength: 50,
      loadOptionsMethod: 'getGroups',
      loadOptionsDependsOn: ['device'],
      loadOptionsParameters: {
        target: 'group',
      },
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
        resource: ['send-messages'],
        target: ['channel'],
      },
    },
    typeOptions: {
      maxLength: 50,
      loadOptionsMethod: 'getChannels',
    },
  },
  {
    displayName: 'Message',
    name: 'message',
    type: 'string',
    typeOptions: {
      rows: 4,
      maxLength: 6000,
    },
    default: '',
    description: 'Message text to be sent',
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['sendText', 'sendMedia', 'sendScheduled'],
      },
    },
  },

  // Fields specific to Media operation
  {
    displayName: 'File URL',
    name: 'mediaUrl',
    type: 'string',
    default: '',
    required: true,
    typeOptions: {
      validationRule: 'url',
      maxLength: 1000,
      minLength: 5,
    },
    description: 'URL of the media to be sent (image, document, video, audio)',
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['sendMedia'],
      },
    },
  },

  // Fields specific to Scheduled operation
  {
    displayName: 'Delivery date',
    name: 'deliverAt',
    type: 'dateTime',
    default: '',
    required: true,
    description: 'Date and time when the message should be delivered',
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['sendScheduled'],
      },
    },
  },

  // Fields specific to Poll operation
  {
    displayName: 'Poll Question',
    name: 'pollQuestion',
    type: 'string',
    default: '',
    required: true,
    typeOptions: {
      maxLength: 250,
    },
    description: 'The question or title for the poll',
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['sendPoll'],
      },
    },
  },
  {
    displayName: 'Poll Options',
    name: 'pollOptions',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
      sortable: true,
      minValue: 2,
      maxValue: 10,
    },
    default: { options: [{ option: '' }, { option: '' }] },
    description: 'The options for the poll (minimum 2, maximum 10)',
    placeholder: 'Add Option',
    options: [
      {
        name: 'options',
        displayName: 'Options',
        values: [
          {
            displayName: 'Option',
            name: 'option',
            type: 'string',
            default: '',
            description: 'Poll option text',
            required: true,
            typeOptions: {
              maxLength: 100,
            }
          },
        ],
      },
    ],
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['sendPoll'],
      }
    }
  },

  // Fields specific to Poll Vote operation
  {
    displayName: 'Poll Message ID',
    name: 'pollMessageId',
    type: 'string',
    default: '',
    required: true,
    typeOptions: {
      validationRule: 'regex',
      regex: /^[a-fA-F0-9]{18,32}$/,
      minLength: 18,
      maxLength: 32,
      errorMessage: 'Enter a valid poll message ID (18, 20, 24 or 32 hexadecimal characters)',
    },
    description: 'The ID of the poll message to vote on',
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['sendPollVote'],
      },
    },
  },
  {
    displayName: 'Vote Options',
    name: 'voteOptions',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
      sortable: true,
      maxValue: 12,
    },
    default: {},
    description: 'The options to vote for (leave empty to remove all votes)',
    placeholder: 'Add Vote Option',
    options: [
      {
        name: 'options',
        displayName: 'Options',
        values: [
          {
            displayName: 'Option Type',
            name: 'optionType',
            type: 'options',
            options: [
              {
                name: 'By Option ID',
                value: 'id',
              },
              {
                name: 'By Option Text',
                value: 'value',
              },
            ],
            default: 'value',
            description: 'How to identify the option to vote for',
          },
          {
            displayName: 'Option ID',
            name: 'id',
            type: 'number',
            default: 0,
            typeOptions: {
              minValue: 0,
              maxValue: 11,
            },
            description: 'The ID of the poll option (0-11)',
            displayOptions: {
              show: {
                optionType: ['id'],
              },
            },
          },
          {
            displayName: 'Option Text',
            name: 'value',
            type: 'string',
            default: '',
            typeOptions: {
              maxLength: 100,
            },
            description: 'The exact text of the poll option to vote for',
            displayOptions: {
              show: {
                optionType: ['value'],
              },
            },
          },
        ],
      },
    ],
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['sendPollVote'],
      }
    }
  },

  // Fields specific to Poll Vote Deletion
  {
    displayName: 'Poll Message ID',
    name: 'pollMessageId',
    type: 'string',
    default: '',
    required: true,
    typeOptions: {
      validationRule: 'regex',
      regex: /^[a-fA-F0-9]{18,32}$/,
      minLength: 18,
      maxLength: 32,
      errorMessage: 'Enter a valid poll message ID (18, 20, 24 or 32 hexadecimal characters)',
    },
    description: 'The ID of the poll message to remove votes from',
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['deletePollVote'],
      },
    },
  },

  // Fields specific to Event operation
  {
    displayName: 'Event Name',
    name: 'eventName',
    type: 'string',
    default: '',
    required: true,
    typeOptions: {
      maxLength: 100,
    },
    description: 'Name or title of the event (up to 100 characters)',
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['sendEvent'],
      },
    },
  },
  {
    displayName: 'Event Description',
    name: 'eventDescription',
    type: 'string',
    default: '',
    required: false,
    typeOptions: {
      rows: 3,
      maxLength: 2048,
    },
    description: 'Optional description of the event (up to 2048 characters)',
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['sendEvent'],
      },
    },
  },
  {
    displayName: 'Event Date and Time',
    name: 'eventDate',
    type: 'dateTime',
    default: '',
    required: true,
    description: 'Date and time of the event in ISO 8601 format',
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['sendEvent'],
      },
    },
  },
  {
    displayName: 'Event Location',
    name: 'eventLocation',
    type: 'string',
    default: '',
    required: false,
    typeOptions: {
      maxLength: 255,
    },
    description: 'Optional location name for the event (up to 255 characters)',
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['sendEvent'],
      },
    },
  },
  {
    displayName: 'Location Coordinates',
    name: 'eventCoordinates',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: false,
    },
    default: {},
    description: 'Optional geographical coordinates for the event location',
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['sendEvent'],
      },
    },
    options: [
      {
        name: 'coordinates',
        displayName: 'Coordinates',
        values: [
          {
            displayName: 'Latitude',
            name: 'latitude',
            type: 'number',
            default: 0,
            typeOptions: {
              minValue: -90,
              maxValue: 90,
            },
            description: 'Latitude of the event location (between -90 and 90)',
          },
          {
            displayName: 'Longitude',
            name: 'longitude',
            type: 'number',
            default: 0,
            typeOptions: {
              minValue: -180,
              maxValue: 180,
            },
            description: 'Longitude of the event location (between -180 and 180)',
          },
        ],
      },
    ],
  },
  {
    displayName: 'Meeting Call Type',
    name: 'eventCallType',
    type: 'options',
    default: 'none',
    options: [
      {
        name: 'No Call',
        value: 'none',
      },
      {
        name: 'Voice Call',
        value: 'voice',
      },
      {
        name: 'Video Call',
        value: 'video',
      },
    ],
    description: 'Type of WhatsApp call for the event meeting',
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['sendEvent'],
      },
    },
  },

  // Fields specific to Event Confirmation
  {
    displayName: 'Event Message ID',
    name: 'eventMessageId',
    type: 'string',
    default: '',
    required: true,
    typeOptions: {
      validationRule: 'regex',
      regex: /^[a-fA-F0-9]{18,32}$/,
      minLength: 18,
      maxLength: 32,
      errorMessage: 'Enter a valid event message ID (18, 20, 24 or 32 hexadecimal characters)',
    },
    description: 'The ID of the event message to respond to',
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['confirmEvent'],
      },
    },
  },
  {
    displayName: 'Response',
    name: 'eventResponse',
    type: 'options',
    default: 'accept',
    options: [
      {
        name: 'Accept Invitation',
        value: 'accept',
      },
      {
        name: 'Decline Invitation',
        value: 'decline',
      },
    ],
    description: 'Respond to the event invitation',
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['confirmEvent'],
      },
    },
  },

  // Fields specific to Location operation
  {
    displayName: 'Location Type',
    name: 'locationType',
    type: 'options',
    options: [
      {
        name: 'Address',
        value: 'address',
        description: 'Specify location by address',
      },
      {
        name: 'Coordinates',
        value: 'coordinates',
        description: 'Specify location by coordinates',
      },
    ],
    default: 'address',
    description: 'How to specify the location',
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['sendLocation'],
      },
    },
  },
  {
    displayName: 'Address',
    name: 'locationAddress',
    type: 'string',
    default: '',
    required: true,
    typeOptions: {
      minLength: 3,
      maxLength: 100,
    },
    placeholder: 'e.g., 1600 Amphitheatre Parkway, Mountain View, CA',
    description: 'The address of the location to send (3-100 characters)',
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['sendLocation'],
        locationType: ['address'],
      },
    },
  },
  {
    displayName: 'Latitude',
    name: 'locationLatitude',
    type: 'number',
    default: 0,
    required: true,
    typeOptions: {
      minValue: -90,
      maxValue: 90,
      numberPrecision: 8,
    },
    description: 'Latitude of the location (-90 to 90)',
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['sendLocation'],
        locationType: ['coordinates'],
      },
    },
  },
  {
    displayName: 'Longitude',
    name: 'locationLongitude',
    type: 'number',
    default: 0,
    required: true,
    typeOptions: {
      minValue: -180,
      maxValue: 180,
      numberPrecision: 8,
    },
    description: 'Longitude of the location (-180 to 180)',
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['sendLocation'],
        locationType: ['coordinates'],
      },
    },
  },
  {
    displayName: 'Location Name',
    name: 'locationName',
    type: 'string',
    default: '',
    required: false,
    typeOptions: {
      maxLength: 100,
    },
    description: 'Optional name or description for the location (up to 100 characters)',
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['sendLocation'],
      },
    },
  },

  // Fields specific to Contacts operation
  {
    displayName: 'Contacts',
    name: 'contactsList',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
      sortable: true,
      minValue: 1,
      maxValue: 10,
    },
    default: { contacts: [{ phone: '', name: '' }] },
    description: 'The contacts to send (minimum 1, maximum 10)',
    placeholder: 'Add Contact',
    options: [
      {
        name: 'contacts',
        displayName: 'Contacts',
        values: [
          {
            displayName: 'Phone Number',
            name: 'phone',
            type: 'string',
            default: '',
            required: true,
            description: 'Phone number in E.164 format (e.g., +1234567890)',
            placeholder: '+1234567890',
            typeOptions: {
              validationRule: 'regex',
              regex: /^\+[1-9]\d{1,14}$/,
              errorMessage: 'Please enter a valid phone number in E.164 format',
              minLength: 6,
              maxLength: 16,
            }
          },
          {
            displayName: 'Name',
            name: 'name',
            type: 'string',
            default: '',
            required: true,
            description: 'Contact name or full name',
            placeholder: 'e.g., John Smith',
            typeOptions: {
              minLength: 1,
              maxLength: 40,
            }
          },
        ],
      },
    ],
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['sendContacts'],
      }
    }
  },

  // Fields specific to Reaction operation
  {
    displayName: 'Message ID to React to',
    name: 'reactionMessageId',
    type: 'string',
    default: '',
    required: true,
    typeOptions: {
      validationRule: 'regex',
      regex: /^[a-fA-F0-9]{18,32}$/,
      minLength: 18,
      maxLength: 32,
      errorMessage: 'Enter a valid message ID (18, 20, 24 or 32 hexadecimal characters)',
    },
    description: 'The ID of the message to react to',
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['sendReaction'],
      },
    },
  },
  {
    displayName: 'Emoji Reaction',
    name: 'reactionEmoji',
    type: 'string',
    default: '',
    required: true,
    placeholder: 'e.g., 👍 or - (to remove reaction)',
    description: 'Emoji to send as reaction, or "-" to remove a reaction. See getemojis.com for available emojis.',
    typeOptions: {
      maxLength: 10,
    },
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['sendReaction'],
      },
    },
  },

  // Fields specific to Catalog Product operation
  {
    displayName: 'Product ID',
    name: 'productId',
    type: 'string',
    default: '',
    required: true,
    typeOptions: {
      validationRule: 'regex',
      regex: /^[0-9]{14,18}$/,
      minLength: 16,
      maxLength: 18,
      errorMessage: 'Enter a valid product ID (16-18 numeric characters)',
    },
    description: 'The ID of the product from a WhatsApp Business catalog',
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['sendProduct'],
      },
    },
  },

  // Fields specific to Forward operation
  {
    displayName: 'Message ID to Forward',
    name: 'forwardMessageId',
    type: 'string',
    default: '',
    required: true,
    typeOptions: {
      validationRule: 'regex',
      regex: /^[a-fA-F0-9]{18,32}$/,
      minLength: 18,
      maxLength: 32,
      errorMessage: 'Enter a valid message ID (18, 20, 24 or 32 hexadecimal characters)',
    },
    description: 'The ID of the message to forward',
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['forwardMessage'],
      },
    },
  },
  {
    displayName: 'Source Chat ID',
    name: 'forwardChatId',
    type: 'string',
    default: '',
    required: false,
    typeOptions: {
      minLength: 8,
      maxLength: 32,
    },
    placeholder: 'e.g., +1234567890 or 123456789012345@g.us',
    description: 'Source chat ID where the message to forward belongs to (optional, the system will try to discover it if not provided)',
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: ['forwardMessage'],
      },
    },
  },

  // Advanced options for all operations
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['send-messages'],
        operation: [
          'sendText',
          'sendMedia',
          'sendScheduled',
          'sendPoll',
          'sendPollVote',
          'deletePollVote',
          'sendEvent',
          'confirmEvent',
          'sendLocation',
          'sendContacts',
          'sendReaction',
          'sendProduct',
          'forwardMessage'
        ],
      },
    },
    options: [
      {
        displayName: 'Priority',
        name: 'priority',
        type: 'options',
        options: [
          { name: 'Normal', value: 'normal' },
          { name: 'High', value: 'high' },
          { name: 'Low', value: 'low' },
        ],
        default: 'normal',
        description: 'Message delivery priority',
      },
      {
        displayName: 'Label',
        name: 'label',
        type: 'string',
        typeOptions: {
          loadOptionsMethod: 'getLabels',
          loadOptionsDependsOn: ['device'],
        },
        default: '',
        description: 'Custom label to categorize the message',
      },
      {
        displayName: 'Reference ID',
        name: 'reference',
        type: 'string',
        default: '',
        description: 'Custom reference ID for the message',
      },
      {
        displayName: 'Team Agent',
        name: 'agent',
        description: 'Optionally send the message in behalf of an agent',
        type: 'options',
        default: '',
        typeOptions: {
          validationRule: 'regex',
          regex: /^[a-f0-9]{24}$/,
          errorMessage: 'Please enter a valid team agent ID (24 characters hexadecimal)',
          maxLength: 24,
          minLength: 24,
          loadOptionsMethod: 'getTeamAgents',
          loadOptionsDependsOn: ['device'],
        },
      },
      // Advanced delivery options
      {
        displayName: 'Send in real-time (riskier, no queue)',
        name: 'live',
        type: 'boolean',
        default: false,
        description: 'Send message in real-time mode without enqueuing it (live mode). Important: do not use this option if you plan to send dozens of messages per minute at a constant rate since this can increase risk of ban by WhatsApp.',
      },
      {
        displayName: 'Delivery Queue Mode',
        name: 'enqueue',
        type: 'options',
        options: [
          { name: 'Default (Based on plan)', value: '' },
          { name: 'Always Queue', value: 'always' },
          { name: 'Never Queue (Real-time delivery)', value: 'never' },
          { name: 'Opportunistic (Try real-time, fallback to queue)', value: 'opportunistic' },
        ],
        default: '',
        description: 'Defines how the message should be queued and delivered. Not all modes are available in all plans. Imporaant: do not use the "never" option if you plan to send dozens of messages per minute at a constant rate since this can increase risk of ban by WhatsApp.',
      },
      {
        displayName: 'Maximum Retries',
        name: 'retries',
        type: 'number',
        default: 25,
        typeOptions: {
          minValue: 0,
          maxValue: 100,
        },
        description: 'Maximum message delivery retries',
      },
      {
        displayName: 'Chat Actions (Assign, Resolve, Metadata...)',
        name: 'actions',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: {},
        description: 'Optional actions to perform after the message is delivered',
        options: [
          {
            name: 'actions',
            displayName: 'Actions',
            values: [
              {
                displayName: 'Action Type',
                name: 'action',
                type: 'options',
                options: [
                  { name: 'Assign Chat to an Agent', value: 'chat:assign' },
                  { name: 'Assign Chat to a Department', value: 'chat:assign:department' },
                  { name: 'Unassign Chat', value: 'chat:unassign' },
                  { name: 'Resolve Chat', value: 'chat:resolve' },
                  { name: 'Unresolve Chat', value: 'chat:unresolve' },
                  { name: 'Mark Chat as Read', value: 'chat:read' },
                  { name: 'Mark Chat as Unread', value: 'chat:unread' },
                  { name: 'Add Labels', value: 'labels:add' },
                  { name: 'Remove Labels', value: 'labels:remove' },
                  { name: 'Set Labels', value: 'labels:set' },
                  { name: 'Set Metadata', value: 'metadata:set' },
                  { name: 'Add Metadata', value: 'metadata:add' },
                  { name: 'Remove Metadata', value: 'metadata:remove' },
                ],
                default: 'chat:assign',
                description: 'The type of action to perform after message delivery',
              },
              // Fields for chat:assign
              {
                displayName: 'Agent ID',
                name: 'agent',
                description: 'User agent ID to assign the chat to after message delivery. Required if Department ID is not provided.',
                type: 'options',
                default: '',
                typeOptions: {
                  validationRule: 'regex',
                  regex: /^[a-f0-9]{24}$/,
                  errorMessage: 'Please enter a valid team agent ID (24 characters hexadecimal)',
                  maxLength: 24,
                  minLength: 24,
                  loadOptionsMethod: 'getTeamAgents',
                  loadOptionsDependsOn: ['device'],
                },
                displayOptions: {
                  show: {
                    action: ['chat:assign'],
                  },
                },
              },
              {
                displayName: 'Department ID',
                name: 'department',
                type: 'options',
                default: '',
                description: 'Department ID to assign the chat to. Required if Agent ID is not provided.',
                typeOptions: {
                  validationRule: 'regex',
                  regex: /^[a-f0-9]{24}$/,
                  errorMessage: 'Please enter a valid Department ID (24 characters hexadecimal)',
                  maxLength: 24,
                  minLength: 24,
                  loadOptionsMethod: 'getDepartments',
                  loadOptionsDependsOn: ['device'],
                },
                displayOptions: {
                  show: {
                    action: ['chat:assign:department'],
                  },
                },
              },
              // Fields for labels actions
              {
                displayName: 'Labels',
                name: 'labels',
                type: 'options',
                typeOptions: {
                  multipleValues: true,
                  minValue: 1,
                  maxValue: 50,
                  loadOptionsMethod: 'getLabels',
                  loadOptionsDependsOn: ['device'],
                },
                default: '',
                placeholder: 'Select labels',
                description: 'Label tags to add, remove or set in the chat.',
                displayOptions: {
                  show: {
                    action: ['labels:add', 'labels:remove', 'labels:set'],
                  },
                },
              },
              // Fields for metadata actions
              {
                displayName: 'Metadata Entries',
                name: 'metadata',
                type: 'fixedCollection',
                typeOptions: {
                  multipleValues: true,
                  minValue: 1,
                  maxValue: 10,
                },
                default: { metadataValues: [{ key: '', value: '' }] },
                description: 'Metadata key-value pairs to set or add.',
                displayOptions: {
                  show: {
                    action: ['metadata:set', 'metadata:add'],
                  },
                },
                options: [
                  {
                    name: 'metadataValues',
                    displayName: 'Metadata',
                    values: [
                      {
                        displayName: 'Key',
                        name: 'key',
                        type: 'string',
                        default: '',
                        description: 'Metadata entry key that can only contain alphanumeric (a-z, A-Z, 0-9), or underscore (_) characters.',
                        typeOptions: {
                          minLength: 1,
                          maxLength: 30,
                        },
                        required: true,
                      },
                      {
                        displayName: 'Value',
                        name: 'value',
                        type: 'string',
                        default: '',
                        description: 'Metadata entry value can contain any text up to 300 characters.',
                        typeOptions: {
                          maxLength: 300,
                        },
                        required: true,
                      },
                    ],
                  },
                ],
              },
              // Fields for metadata:remove
              {
                displayName: 'Delete metadata',
                name: 'keys',
                type: 'string',
                typeOptions: {
                  multipleValues: true,
                  multipleValueButtonText: 'Add Key',
                  minValue: 1,
                  maxValue: 30,
                },
                default: '',
                placeholder: 'e.g., customer_id, status',
                description: 'Metadata entries to remove by keys.',
                displayOptions: {
                  show: {
                    action: ['metadata:remove'],
                  },
                },
              },
            ],
          },
        ],
      },
      {
        displayName: 'Message Expiration',
        name: 'expiration',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: false,
        },
        default: {},
        description: 'Define a message time-to-live (TTL) expiration time',
        options: [
          {
            name: 'values',
            displayName: 'Expiration Values',
            values: [
              {
                displayName: 'Expiration Type',
                name: 'type',
                type: 'options',
                options: [
                  { name: 'Seconds', value: 'seconds' },
                  { name: 'Duration', value: 'duration' },
                  { name: 'Date', value: 'date' },
                ],
                default: 'seconds',
                description: 'How to specify the expiration time',
              },
              {
                displayName: 'Seconds',
                name: 'seconds',
                type: 'number',
                default: 300,
                typeOptions: {
                  minValue: 5,
                  maxValue: 2592000, // 30 days in seconds
                },
                description: 'Expire after this many seconds',
                displayOptions: {
                  show: {
                    type: ['seconds'],
                  },
                },
              },
              {
                displayName: 'Duration',
                name: 'duration',
                type: 'string',
                default: '1h',
                placeholder: 'e.g., 1h, 30m, 1d',
                description: 'Expire after this duration (e.g., 1h, 15m, 12h, 1d)',
                displayOptions: {
                  show: {
                    type: ['duration'],
                  },
                },
              },
              {
                displayName: 'Date',
                name: 'date',
                type: 'dateTime',
                default: '',
                description: 'Expire at this specific date and time',
                displayOptions: {
                  show: {
                    type: ['date'],
                  },
                },
              },
            ],
          },
        ],
      },
      {
        displayName: 'Mark Chat as Read',
        name: 'sendReadAck',
        type: 'boolean',
        default: false,
        description: 'Notifies WhatsAPp that the previous unread chat messages will be read after message delivery (blue double-check). Will not work if read confirmation is disabled in WhatsApp Privacy settings.',
      },
      {
        displayName: 'Typing simulation',
        name: 'typing',
        type: 'number',
        default: 0,
        typeOptions: {
          minValue: 0,
          maxValue: 30,
        },
        description: 'Seconds to simulate typing or recording status before delivery (2-30 seconds, 0 to disable)',
      },
      {
        displayName: 'Quote Message',
        name: 'quote',
        type: 'string',
        default: '',
        typeOptions: {
          validationRule: 'regex',
          regex: /^[a-fA-F0-9]{18,32}$/,
          minLength: 18,
          maxLength: 32,
        },
        description: 'Message ID to quote when sending the message (18-32 hex characters). Can only quote messages in the same conversation.',
      },
      {
        displayName: 'Strict Message Order',
        name: 'order',
        type: 'boolean',
        default: false,
        description: 'Ensure messages are sent to the target chat in strict order. Useful for chatbots and message sequences. Not compatible with Live Mode or Never Queue delivery options.',
      },
    ],
  },
];

export async function executeMessageOperations(this: IExecuteFunctions, itemIndex: number) {
  const operation = this.getNodeParameter('operation', itemIndex) as string;
  const requestBody: IDataObject = {};

  // Common parameters
  if (operation === 'sendText' || operation === 'sendMedia' || operation === 'sendScheduled' ||
      operation === 'sendPoll' || operation === 'sendPollVote' || operation === 'deletePollVote' ||
      operation === 'sendEvent' || operation === 'confirmEvent' || operation === 'sendLocation' ||
      operation === 'sendContacts' || operation === 'sendReaction' || operation === 'sendProduct' ||
      operation === 'forwardMessage') {

    const device = this.getNodeParameter('device', itemIndex) as string;
    const target = this.getNodeParameter('target', itemIndex) as string;
    const options = this.getNodeParameter('options', itemIndex, {}) as IDataObject;

    requestBody.device = device;

    if (!device) {
      throw new Error('WhatsApp Device ID is required');
    }

    // Handle target-specific parameters
    if (target === 'phone') {
      const phone = this.getNodeParameter('phone', itemIndex) as string;
      requestBody.phone = phone;
    } else if (target === 'group') {
      const group = this.getNodeParameter('groupId', itemIndex) as string;
      requestBody.group = group;
    } else if (target === 'channel') {
      const channel = this.getNodeParameter('channel', itemIndex) as string;
      requestBody.channel = channel;
    }

    // Handle operation-specific parameters
    if (operation === 'sendText' || operation === 'sendMedia' || operation === 'sendScheduled') {
      const message = this.getNodeParameter('message', itemIndex) as string;
      if (message) {
        requestBody.message = message;
      }
    }

    // Process options
    if (options) {
      // Process chat actions if present
      if ((options as any).actions && typeof (options as any).actions === 'object' && (options as any).actions.actions as IDataObject[]) {
        const actionsCollection = (options as any).actions.actions as IDataObject[];
        if (actionsCollection && actionsCollection.length > 0) {
          const actions: IDataObject[] = [];

          for (const actionItem of actionsCollection) {
            const action = actionItem.action as string;
            if (!action) continue;

            const actionObject: IDataObject = { action };

            // Handle different action types and their parameters
            switch (action) {
              case 'chat:assign':
              case 'chat:assign:department':
                actionObject.action = 'chat:assign';
                // Add agent and/or department parameters
                if (actionItem.agent || actionItem.department) {
                  const params: IDataObject = {};
                  if (actionItem.agent) {
                    params.agent = actionItem.agent;
                  } else if (actionItem.department) {
                    params.department = actionItem.department;
                  }
                  actionObject.params = params;
                } else {
                  actionObject.action = null; // Skip entry if no agent or department
                }
                break;

              case 'chat:unassign':
                break;

              case 'labels:add':
              case 'labels:remove':
              case 'labels:set':
                // Process labels
                if (actionItem.labels) {
                  let labels: string[] = [];
                  if (typeof actionItem.labels === 'string') {
                    labels = [actionItem.labels as string];
                  } else if (Array.isArray(actionItem.labels)) {
                    labels = actionItem.labels as string[];
                  }

                  if (labels.length > 0) {
                    actionObject.params = { labels };
                  }
                }
                break;

              case 'metadata:set':
              case 'metadata:add':
                // Process metadata key-value pairs
                if (actionItem.metadata && typeof actionItem.metadata === 'object' && (actionItem.metadata as IDataObject).metadataValues) {
                  const metadataEntries = ((actionItem.metadata as IDataObject).metadataValues as IDataObject[]);
                  if (metadataEntries && metadataEntries.length > 0) {
                    const metadata = metadataEntries.map(entry => ({
                      key: entry.key as string,
                      value: entry.value as string
                    })).filter(entry => entry.key && entry.value);

                    if (metadata.length > 0) {
                      actionObject.params = { metadata };
                    } else {
                      actionObject.action = null; // Skip entry
                    }
                  }
                }
                break;

              case 'metadata:remove':
                // Process metadata keys to remove
                if (actionItem.keys) {
                  let keys: string[] = [];
                  if (typeof actionItem.keys === 'string') {
                    keys = [actionItem.keys as string];
                  } else if (Array.isArray(actionItem.keys)) {
                    keys = actionItem.keys as string[];
                  }
                  if (keys.length > 0) {
                    actionObject.params = { keys };
                  } else {
                    actionObject.action = null; // Skip entry
                  }
                }
                break;

              case 'chat:resolve':
              case 'chat:unresolve':
              case 'chat:read':
              case 'chat:unread':
                // These actions don't need params
                break;

              default:
                // Unknown action type
                continue;
            }

            if (actionObject.action) {
              actions.push(actionObject);
            }
          }

          if (actions.length > 0) {
            requestBody.actions = actions;
          }
        }

        // Remove the actions from options to avoid duplication
        delete options.actions;
      }

      // Process expiration object if present
      if (options.expiration && typeof options.expiration === 'object') {
        const expiration = options.expiration as { values?: { type: string, seconds?: number, duration?: string, date?: string } };

        if (expiration.values) {
          const expirationValues = expiration.values;
          const expirationType = expirationValues.type;

          if (expirationType === 'seconds' && expirationValues.seconds) {
            options.expiration = { seconds: expirationValues.seconds };
          } else if (expirationType === 'duration' && expirationValues.duration) {
            options.expiration = { duration: expirationValues.duration };
          } else if (expirationType === 'date' && expirationValues.date) {
            options.expiration = { date: expirationValues.date };
          } else {
            delete options.expiration;
          }
        } else {
          delete options.expiration;
        }
      }

      // Ensure critical options are included when they have values
      const criticalOptions = ['priority', 'agent', 'reference', 'label', 'live', 'enqueue',
                              'retries', 'sendReadAck', 'typing', 'quote', 'order'];

      // Remove truly empty options
      Object.keys(options).forEach(key => {
        // Keep critical options even if they have non-null/non-undefined falsy values
        if (criticalOptions.includes(key)) {
          if (options[key] === undefined || options[key] === null) {
            delete options[key];
          }
        } else {
          // For non-critical options, remove if empty
          if (options[key] === '' || options[key] === null || options[key] === undefined ||
              (typeof options[key] === 'object' && Object.keys(options[key] as object).length === 0)) {
            delete options[key];
          }
        }
      });

      // Merge options with requestBody - ensures priority, agent, reference, etc.
      // are included when they have valid values
      Object.assign(requestBody, options);
    }

    // Operation-specific parameters
    if (operation === 'sendMedia') {
      const mediaUrl = this.getNodeParameter('mediaUrl', itemIndex) as string;
      requestBody.media = { url: mediaUrl };
    }
    else if (operation === 'sendScheduled') {
      const deliverAt = this.getNodeParameter('deliverAt', itemIndex) as string;
      requestBody.deliverAt = deliverAt;
    }
    else if (operation === 'sendPoll') {
      const pollQuestion = this.getNodeParameter('pollQuestion', itemIndex) as string;
      const pollOptionsCollection = this.getNodeParameter('pollOptions.options', itemIndex, []) as { option: string }[];

      if (!pollQuestion) {
        throw new Error('Poll question is required');
      }

      if (!pollOptionsCollection || pollOptionsCollection.length < 2) {
        throw new Error('At least 2 poll options are required');
      }

      const pollOptions = pollOptionsCollection.map(item => item.option).filter(option => option.trim() !== '');
      if (pollOptions.length < 2) {
        throw new Error('At least 2 valid poll options are required');
      }

      requestBody.poll = {
        name: pollQuestion,
        options: pollOptions
      };
    }
    else if (operation === 'sendPollVote') {
      const pollMessageId = this.getNodeParameter('pollMessageId', itemIndex) as string;
      const voteOptionsCollection = this.getNodeParameter('voteOptions.options', itemIndex, []) as Array<{
        optionType: 'id' | 'value',
        id?: number,
        value?: string
      }>;

      if (!pollMessageId) {
        throw new Error('Poll message ID is required');
      }

      // Format the vote options
      const voteOptions = voteOptionsCollection.map(item => {
        if (item.optionType === 'id' && item.id !== undefined) {
          return { id: item.id };
        } else if (item.optionType === 'value' && item.value) {
          return { value: item.value };
        }
        return null;
      }).filter(Boolean);

      requestBody.vote = {
        poll: pollMessageId,
        options: voteOptions
      };
    }
    else if (operation === 'deletePollVote') {
      const pollMessageId = this.getNodeParameter('pollMessageId', itemIndex) as string;

      if (!pollMessageId) {
        throw new Error('Poll message ID is required');
      }

      // Set empty options array to remove all votes
      requestBody.vote = {
        poll: pollMessageId,
        options: []
      };
    }
    else if (operation === 'sendEvent') {
      const eventName = this.getNodeParameter('eventName', itemIndex) as string;
      const eventDescription = this.getNodeParameter('eventDescription', itemIndex, '') as string;
      const eventDate = this.getNodeParameter('eventDate', itemIndex) as string;
      const eventLocation = this.getNodeParameter('eventLocation', itemIndex, '') as string;
      const eventCallType = this.getNodeParameter('eventCallType', itemIndex, 'none') as 'none' | 'voice' | 'video';

      let coordinates;
      try {
        const eventCoordinates = this.getNodeParameter('eventCoordinates.coordinates', itemIndex, {}) as {
          latitude?: number;
          longitude?: number;
        };

        if (eventCoordinates.latitude !== undefined && eventCoordinates.longitude !== undefined) {
          coordinates = {
            latitude: eventCoordinates.latitude,
            longitude: eventCoordinates.longitude,
          };
        }
      } catch (error) {
        // Coordinates not provided, ignore
      }

      if (!eventName) {
        throw new Error('Event name is required');
      }

      if (!eventDate) {
        throw new Error('Event date and time is required');
      }

      const eventData: Record<string, any> = {
        name: eventName,
        date: eventDate,
      };

      if (eventDescription) {
        eventData.description = eventDescription;
      }

      if (eventLocation) {
        eventData.location = eventLocation;
      }

      if (coordinates) {
        eventData.latitude = coordinates.latitude;
        eventData.longitude = coordinates.longitude;
      }

      if (eventCallType && eventCallType !== 'none') {
        eventData.call = eventCallType;
      }

      requestBody.event = eventData;
    }
    else if (operation === 'confirmEvent') {
      const eventMessageId = this.getNodeParameter('eventMessageId', itemIndex) as string;
      const eventResponse = this.getNodeParameter('eventResponse', itemIndex) as string;

      if (!eventMessageId) {
        throw new Error('Event message ID is required');
      }

      const confirm = eventResponse === 'accept';

      requestBody.confirm = {
        event: eventMessageId,
        confirm
      };
    }
    else if (operation === 'sendLocation') {
      const locationType = this.getNodeParameter('locationType', itemIndex) as string;
      const locationName = this.getNodeParameter('locationName', itemIndex, '') as string;

      let locationData: Record<string, any> = {};

      if (locationType === 'address') {
        const locationAddress = this.getNodeParameter('locationAddress', itemIndex) as string;

        if (!locationAddress) {
          throw new Error('Location address is required');
        }

        locationData.address = locationAddress;
      } else if (locationType === 'coordinates') {
        const latitude = this.getNodeParameter('locationLatitude', itemIndex) as number;
        const longitude = this.getNodeParameter('locationLongitude', itemIndex) as number;

        locationData.coordinates = [latitude, longitude];
      }

      if (locationName) {
        locationData.name = locationName;
      }

      requestBody.location = locationData;
    }
    else if (operation === 'sendContacts') {
      const contactsCollection = this.getNodeParameter('contactsList.contacts', itemIndex, []) as Array<{
        phone: string;
        name: string;
      }>;

      if (!contactsCollection || contactsCollection.length === 0) {
        throw new Error('At least one contact is required');
      }

      // Validate each contact
      contactsCollection.forEach((contact, index) => {
        if (!contact.phone || !contact.name) {
          throw new Error(`Contact at position ${index + 1} is missing required fields`);
        }
      });

      requestBody.contacts = contactsCollection;
    }
    else if (operation === 'sendReaction') {
      const reactionMessageId = this.getNodeParameter('reactionMessageId', itemIndex) as string;
      const reactionEmoji = this.getNodeParameter('reactionEmoji', itemIndex) as string;

      if (!reactionMessageId) {
        throw new Error('Message ID to react to is required');
      }

      if (!reactionEmoji) {
        throw new Error('Emoji reaction is required');
      }

      requestBody.reaction = reactionEmoji;
      requestBody.reactionMessage = reactionMessageId;
    }
    else if (operation === 'sendProduct') {
      const productId = this.getNodeParameter('productId', itemIndex) as string;

      if (!productId) {
        throw new Error('Product ID is required');
      }

      requestBody.product = productId;
    }
    else if (operation === 'forwardMessage') {
      const forwardMessageId = this.getNodeParameter('forwardMessageId', itemIndex) as string;
      const forwardChatId = this.getNodeParameter('forwardChatId', itemIndex, '') as string;

      if (!forwardMessageId) {
        throw new Error('Message ID to forward is required');
      }

      const forwardData: Record<string, any> = {
        message: forwardMessageId,
      };

      if (forwardChatId) {
        forwardData.chat = forwardChatId;
      }

      requestBody.forward = forwardData;
    }
  }

  // Make the API request
  return await request(this, 'POST', '/messages', requestBody);
}
