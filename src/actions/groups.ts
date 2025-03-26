import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { request } from '../request';

export const groupProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['groups'],
      },
    },
    options: [
      {
        name: 'Get Groups',
        value: 'getDeviceGroupChats',
        description: 'Get all group chats for a WhatsApp number',
      },
      {
        name: 'Get Group',
        value: 'getGroupById',
        description: 'Get details of a specific group',
      },
      {
        name: 'Create Group',
        value: 'createGroup',
        description: 'Create a new WhatsApp group',
      },
      {
        name: 'Update Group',
        value: 'updateGroup',
        description: 'Update group details',
      },
      {
        name: 'Update Group Image',
        value: 'groupUpdateImage',
        description: 'Update group profile image',
      },
      {
        name: 'Add Participants',
        value: 'addGroupParticipants',
        description: 'Add new participants to a group',
      },
      {
        name: 'Update Participants',
        value: 'updateParticipantsPermissions',
        description: 'Promote or demote participants as admin',
      },
      {
        name: 'Remove Participants',
        value: 'removeGroupParticipants',
        description: 'Remove participants from a group',
      },
      {
        name: 'Get Pending Members',
        value: 'getGroupPendingMembers',
        description: 'Get pending members for approval',
      },
      {
        name: 'Approve Members',
        value: 'approveGroupMembers',
        description: 'Approve members to join the group',
      },
      {
        name: 'Reject Members',
        value: 'rejectGroupMembers',
        description: 'Reject members from joining the group',
      },
      {
        name: 'Get Invite Code',
        value: 'getGroupInviteCode',
        description: 'Get group invite code and URL',
      },
      {
        name: 'Revoke Invite Code',
        value: 'revokeGroupInvite',
        description: 'Revoke the group invite code',
      },
      {
        name: 'Join Group',
        value: 'joinGroup',
        description: 'Join a group by invite code or URL',
      },
      {
        name: 'Leave Group',
        value: 'leaveGroup',
        description: 'Leave a group chat',
      },
    ],
    default: 'getDeviceGroupChats',
  },
  {
    displayName: 'WhatsApp Number',
    name: 'deviceId',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getDevices',
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['groups'],
      },
    },
    description: 'The ID of the WhatsApp number',
  },
  // Group ID field - used by multiple operations
  {
    displayName: 'Group ID',
    name: 'groupId',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getGroups',
      loadOptionsDependsOn: ['deviceId'],
      loadOptionsParameters: {
        target: 'group',
      },
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['groups'],
        operation: [
          'getGroupById',
          'updateGroup',
          'groupUpdateImage',
          'addGroupParticipants',
          'updateParticipantsPermissions',
          'removeGroupParticipants',
          'getGroupPendingMembers',
          'approveGroupMembers',
          'rejectGroupMembers',
          'getGroupInviteCode',
          'revokeGroupInvite'
        ],
      },
    },
    description: 'The ID of the group (e.g: 447362053576-1500000000, 447362053576-1500000000@g.us)',
  },

  // GET GROUPS OPTIONS
  {
    displayName: 'Filter by Kind',
    name: 'kind',
    type: 'multiOptions',
    required: false,
    default: [],
    displayOptions: {
      show: {
        resource: ['groups'],
        operation: ['getDeviceGroupChats'],
      },
    },
    options: [
      { name: 'Group', value: 'group' },
      { name: 'Broadcast', value: 'broadcast' },
    ],
    description: 'Filter groups by kind',
  },
  {
    displayName: 'Results Page Size',
    name: 'size',
    type: 'number',
    required: false,
    default: 20,
    displayOptions: {
      show: {
        resource: ['groups'],
        operation: ['getDeviceGroupChats'],
      },
    },
    description: 'Number of results per page',
  },
  {
    displayName: 'Page Number',
    name: 'page',
    type: 'number',
    required: false,
    default: 0,
    displayOptions: {
      show: {
        resource: ['groups'],
        operation: ['getDeviceGroupChats'],
      },
    },
    description: 'Page number (starting from 0)',
  },

  // CREATE/UPDATE GROUP OPTIONS
  {
    displayName: 'Group Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['groups'],
        operation: ['createGroup', 'updateGroup'],
      },
    },
    description: 'Name of the group',
  },
  {
    displayName: 'Description',
    name: 'description',
    type: 'string',
    required: false,
    default: '',
    displayOptions: {
      show: {
        resource: ['groups'],
        operation: ['createGroup', 'updateGroup'],
      },
    },
    description: 'Group description (up to 500 characters)',
  },
  {
    displayName: 'Group Permissions',
    name: 'permissions',
    type: 'collection',
    default: {},
    placeholder: 'Add Permission',
    displayOptions: {
      show: {
        resource: ['groups'],
        operation: ['createGroup', 'updateGroup'],
      },
    },
    options: [
      {
        displayName: 'Edit Settings Permission',
        name: 'edit',
        type: 'options',
        options: [
          { name: 'All Participants', value: 'all' },
          { name: 'Admins Only', value: 'admins' },
        ],
        default: 'all',
        description: 'Who can edit group settings',
      },
      {
        displayName: 'Send Messages Permission',
        name: 'send',
        type: 'options',
        options: [
          { name: 'All Participants', value: 'all' },
          { name: 'Admins Only', value: 'admins' },
        ],
        default: 'all',
        description: 'Who can send messages in the group',
      },
      {
        displayName: 'Invite Permission',
        name: 'invite',
        type: 'options',
        options: [
          { name: 'All Participants', value: 'all' },
          { name: 'Admins Only', value: 'admins' },
        ],
        default: 'all',
        description: 'Who can invite new participants',
      },
      {
        displayName: 'Require Approval',
        name: 'approval',
        type: 'boolean',
        default: false,
        description: 'Whether new participants require admin approval',
      },
    ],
    description: 'Group permissions settings',
  },
  {
    displayName: 'Ephemeral Messages',
    name: 'ephemeral',
    type: 'options',
    required: false,
    displayOptions: {
      show: {
        resource: ['groups'],
        operation: ['createGroup', 'updateGroup'],
      },
    },
    options: [
      { name: 'Off', value: 'off' },
      { name: '24 Hours', value: '24h' },
      { name: '7 Days', value: '7d' },
      { name: '90 Days', value: '90d' },
    ],
    default: 'off',
    description: 'Automatically deleted messages setting',
  },

  // PARTICIPANTS FOR CREATE GROUP
  {
    displayName: 'Participants',
    name: 'participants',
    placeholder: 'Add Participant',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
      sortable: false,
    },
    default: {},
    displayOptions: {
      show: {
        resource: ['groups'],
        operation: ['createGroup'],
      },
    },
    options: [
      {
        name: 'participantValues',
        displayName: 'Participant',
        values: [
          {
            displayName: 'Phone Number',
            name: 'phone',
            type: 'string',
            default: '',
            description: 'Phone number with international format (e.g. +1234567890)',
            required: true,
          },
          {
            displayName: 'Make Admin',
            name: 'admin',
            type: 'boolean',
            default: false,
            description: 'Whether this participant should be an admin',
          },
        ],
      },
    ],
    description: 'The participants to add to the group',
  },

  // PARTICIPANTS FOR ADD/UPDATE OPERATIONS
  {
    displayName: 'Participants',
    name: 'participants',
    placeholder: 'Add Participant',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
      sortable: false,
    },
    default: {},
    displayOptions: {
      show: {
        resource: ['groups'],
        operation: ['addGroupParticipants', 'updateParticipantsPermissions'],
      },
    },
    options: [
      {
        name: 'participantValues',
        displayName: 'Participant',
        values: [
          {
            displayName: 'Phone Number',
            name: 'phone',
            type: 'string',
            default: '',
            description: 'Phone number with international format (e.g. +1234567890)',
            required: true,
          },
          {
            displayName: 'Make Admin',
            name: 'admin',
            type: 'boolean',
            default: false,
            description: 'Whether this participant should be an admin',
          },
        ],
      },
    ],
    description: 'The participants to add or update in the group',
  },

  // REMOVE PARTICIPANTS
  {
    displayName: 'Phone Numbers',
    name: 'phones',
    type: 'string',
    typeOptions: {
      multipleValues: true,
    },
    required: true,
    default: [],
    displayOptions: {
      show: {
        resource: ['groups'],
        operation: ['removeGroupParticipants'],
      },
    },
    description: 'The phone numbers to remove from the group (e.g. +1234567890)',
  },

  // APPROVE/REJECT MEMBERS
  {
    displayName: 'Approve All',
    name: 'all',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['groups'],
        operation: ['approveGroupMembers', 'rejectGroupMembers'],
      },
    },
    description: 'Whether to approve/reject all pending members',
  },
  {
    displayName: 'Phone Numbers',
    name: 'phones',
    type: 'string',
    typeOptions: {
      multipleValues: true,
    },
    required: true,
    default: [],
    displayOptions: {
      show: {
        resource: ['groups'],
        operation: ['approveGroupMembers', 'rejectGroupMembers'],
        all: [false],
      },
    },
    description: 'The phone numbers to approve/reject (e.g. +1234567890)',
  },

  // UPDATE GROUP IMAGE
  {
    displayName: 'Image Source',
    name: 'imageSource',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['groups'],
        operation: ['groupUpdateImage'],
      },
    },
    options: [
      {
        name: 'URL',
        value: 'url',
      },
      {
        name: 'Base64',
        value: 'base64',
      },
    ],
    default: 'url',
    description: 'Source of the image',
  },
  {
    displayName: 'Image URL',
    name: 'url',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['groups'],
        operation: ['groupUpdateImage'],
        imageSource: ['url'],
      },
    },
    description: 'URL of image to use as group profile picture (JPG or PNG, max 1MB)',
  },
  {
    displayName: 'Image Data (Base64)',
    name: 'image',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['groups'],
        operation: ['groupUpdateImage'],
        imageSource: ['base64'],
      },
    },
    description: 'Base64-encoded image data (JPG or PNG, max 1MB)',
  },

  // JOIN GROUP
  {
    displayName: 'Join Method',
    name: 'joinMethod',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['groups'],
        operation: ['joinGroup'],
      },
    },
    options: [
      {
        name: 'Invite Code',
        value: 'code',
      },
      {
        name: 'Invite URL',
        value: 'url',
      },
    ],
    default: 'url',
    description: 'Method to join the group',
  },
  {
    displayName: 'Invite Code',
    name: 'code',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['groups'],
        operation: ['joinGroup'],
        joinMethod: ['code'],
      },
    },
    description: 'Group invitation code',
  },
  {
    displayName: 'Invite URL',
    name: 'url',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['groups'],
        operation: ['joinGroup'],
        joinMethod: ['url'],
      },
    },
    description: 'Group invitation URL (e.g., https://chat.whatsapp.com/XXXXXXX)',
  },

  // LEAVE GROUP
  {
    displayName: 'Group ID to Leave',
    name: 'id',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getGroups',
      loadOptionsDependsOn: ['deviceId'],
      loadOptionsParameters: {
        target: 'group',
      },
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['groups'],
        operation: ['leaveGroup'],
      },
    },
    description: 'The ID of the group to leave',
  },
  {
    displayName: 'Remove from Chat List',
    name: 'remove',
    type: 'boolean',
    default: true,
    displayOptions: {
      show: {
        resource: ['groups'],
        operation: ['leaveGroup'],
      },
    },
    description: 'Whether to remove the group from the chat list after leaving',
  },
];

export async function executeGroupOperations(
  this: IExecuteFunctions | any,
  index: number,
) {
  const operation = this.getNodeParameter('operation', index) as string;
  const deviceId = this.getNodeParameter('deviceId', index) as string;

  // GET GROUPS
  if (operation === 'getDeviceGroupChats') {
    const queryParameters: Record<string, string | string[]> = {};

    const kind = this.getNodeParameter('kind', index, []) as string[];
    const size = this.getNodeParameter('size', index, '') as string;
    const page = this.getNodeParameter('page', index, '') as string;

    if (kind && kind.length > 0) queryParameters.kind = kind.join(',');
    if (size) queryParameters.size = size.toString();
    if (page) queryParameters.page = page.toString();

    return request(
      this,
      'GET',
      `/devices/${deviceId}/groups`,
      undefined,
      queryParameters as Record<string, string>,
    );
  }

  // GET GROUP BY ID
  if (operation === 'getGroupById') {
    const groupId = this.getNodeParameter('groupId', index) as string;

    return request(
      this,
      'GET',
      `/devices/${deviceId}/groups/${groupId}`,
    );
  }

  // CREATE GROUP
  if (operation === 'createGroup') {
    const name = this.getNodeParameter('name', index) as string;
    const description = this.getNodeParameter('description', index, '') as string;
    const ephemeral = this.getNodeParameter('ephemeral', index, 'off') as string;

    const permissionsCollection = this.getNodeParameter('permissions', index, {}) as {
      edit?: string;
      send?: string;
      invite?: string;
      approval?: boolean;
    };

    const participantsCollection = this.getNodeParameter('participants', index, {}) as {
      participantValues: Array<{
        phone: string;
        admin: boolean;
      }>;
    };

    const body: {
      name: string;
      description?: string;
      ephemeral?: string;
      permissions?: {
        edit?: string;
        send?: string;
        invite?: string;
        approval?: boolean;
      };
      participants: Array<{
        phone: string;
        admin: boolean;
      }>;
    } = {
      name,
      participants: [],
    };

    if (description) {
      body.description = description;
    }

    if (ephemeral && ephemeral !== 'off') {
      body.ephemeral = ephemeral;
    }

    // Add permissions if any of them are set
    if (Object.keys(permissionsCollection).length > 0) {
      body.permissions = {};
      if (permissionsCollection.edit) body.permissions.edit = permissionsCollection.edit;
      if (permissionsCollection.send) body.permissions.send = permissionsCollection.send;
      if (permissionsCollection.invite) body.permissions.invite = permissionsCollection.invite;
      if (permissionsCollection.approval !== undefined) body.permissions.approval = permissionsCollection.approval;
    }

    // Add participants
    if (participantsCollection.participantValues && participantsCollection.participantValues.length > 0) {
      body.participants = participantsCollection.participantValues;
    } else {
      throw new Error('At least one participant is required to create a group.');
    }

    return request(
      this,
      'POST',
      `/devices/${deviceId}/groups`,
      body,
    );
  }

  // UPDATE GROUP
  if (operation === 'updateGroup') {
    const groupId = this.getNodeParameter('groupId', index) as string;
    const name = this.getNodeParameter('name', index, '') as string;
    const description = this.getNodeParameter('description', index, '') as string;
    const ephemeral = this.getNodeParameter('ephemeral', index, '') as string;

    const permissionsCollection = this.getNodeParameter('permissions', index, {}) as {
      edit?: string;
      send?: string;
      invite?: string;
      approval?: boolean;
    };

    const body: {
      name?: string;
      description?: string;
      ephemeral?: string;
      permissions?: {
        edit?: string;
        send?: string;
        invite?: string;
        approval?: boolean;
      };
    } = {};

    if (name) {
      body.name = name;
    }

    if (description) {
      body.description = description;
    }

    if (ephemeral) {
      body.ephemeral = ephemeral;
    }

    // Add permissions if any of them are set
    if (Object.keys(permissionsCollection).length > 0) {
      body.permissions = {};
      if (permissionsCollection.edit) body.permissions.edit = permissionsCollection.edit;
      if (permissionsCollection.send) body.permissions.send = permissionsCollection.send;
      if (permissionsCollection.invite) body.permissions.invite = permissionsCollection.invite;
      if (permissionsCollection.approval !== undefined) body.permissions.approval = permissionsCollection.approval;
    }

    return request(
      this,
      'PATCH',
      `/devices/${deviceId}/groups/${groupId}`,
      body,
    );
  }

  // UPDATE GROUP IMAGE
  if (operation === 'groupUpdateImage') {
    const groupId = this.getNodeParameter('groupId', index) as string;
    const imageSource = this.getNodeParameter('imageSource', index) as string;

    const body: {
      url?: string;
      image?: string;
    } = {};

    if (imageSource === 'url') {
      const url = this.getNodeParameter('url', index) as string;
      body.url = url;
    } else if (imageSource === 'base64') {
      const image = this.getNodeParameter('image', index) as string;
      body.image = image;
    }

    return request(
      this,
      'PUT',
      `/devices/${deviceId}/groups/${groupId}/image`,
      body,
    );
  }

  // ADD GROUP PARTICIPANTS
  if (operation === 'addGroupParticipants') {
    const groupId = this.getNodeParameter('groupId', index) as string;

    const participantsCollection = this.getNodeParameter('participants', index, {}) as {
      participantValues: Array<{
        phone: string;
        admin: boolean;
      }>;
    };

    // Map the UI structure to the API expected format
    const participants = participantsCollection.participantValues.map(item => ({
      phone: item.phone,
      admin: item.admin,
    }));

    return request(
      this,
      'POST',
      `/devices/${deviceId}/groups/${groupId}/participants`,
      { participants },
    );
  }

  // UPDATE PARTICIPANTS PERMISSIONS
  if (operation === 'updateParticipantsPermissions') {
    const groupId = this.getNodeParameter('groupId', index) as string;

    const participantsCollection = this.getNodeParameter('participants', index, {}) as {
      participantValues: Array<{
        phone: string;
        admin: boolean;
      }>;
    };

    // Map the UI structure to the API expected format
    const participants = participantsCollection.participantValues.map(item => ({
      phone: item.phone,
      admin: item.admin,
    }));

    return request(
      this,
      'PATCH',
      `/devices/${deviceId}/groups/${groupId}/participants`,
      { participants },
    );
  }

  // REMOVE GROUP PARTICIPANTS
  if (operation === 'removeGroupParticipants') {
    const groupId = this.getNodeParameter('groupId', index) as string;
    const phones = this.getNodeParameter('phones', index, []) as string[];

    return request(
      this,
      'DELETE',
      `/devices/${deviceId}/groups/${groupId}/participants`,
      phones,
    );
  }

  // GET GROUP PENDING MEMBERS
  if (operation === 'getGroupPendingMembers') {
    const groupId = this.getNodeParameter('groupId', index) as string;

    return request(
      this,
      'GET',
      `/devices/${deviceId}/groups/${groupId}/members`,
    );
  }

  // APPROVE GROUP MEMBERS
  if (operation === 'approveGroupMembers') {
    const groupId = this.getNodeParameter('groupId', index) as string;
    const all = this.getNodeParameter('all', index, false) as boolean;
    const phones = !all ? this.getNodeParameter('phones', index, []) as string[] : [];

    const body: {
      all?: boolean;
      phones?: string[];
    } = {};

    if (all) {
      body.all = true;
    } else {
      body.phones = phones;
    }

    return request(
      this,
      'POST',
      `/devices/${deviceId}/groups/${groupId}/members`,
      body,
    );
  }

  // REJECT GROUP MEMBERS
  if (operation === 'rejectGroupMembers') {
    const groupId = this.getNodeParameter('groupId', index) as string;
    const all = this.getNodeParameter('all', index, false) as boolean;
    const phones = !all ? this.getNodeParameter('phones', index, []) as string[] : [];

    const body: {
      all?: boolean;
      phones?: string[];
    } = {};

    if (all) {
      body.all = true;
    } else {
      body.phones = phones;
    }

    return request(
      this,
      'DELETE',
      `/devices/${deviceId}/groups/${groupId}/members`,
      body,
    );
  }

  // GET GROUP INVITE CODE
  if (operation === 'getGroupInviteCode') {
    const groupId = this.getNodeParameter('groupId', index) as string;

    return request(
      this,
      'GET',
      `/devices/${deviceId}/groups/${groupId}/invite`,
    );
  }

  // REVOKE GROUP INVITE
  if (operation === 'revokeGroupInvite') {
    const groupId = this.getNodeParameter('groupId', index) as string;

    return request(
      this,
      'DELETE',
      `/devices/${deviceId}/groups/${groupId}/invite`,
    );
  }

  // JOIN GROUP
  if (operation === 'joinGroup') {
    const joinMethod = this.getNodeParameter('joinMethod', index) as string;

    const body: {
      code?: string;
      url?: string;
    } = {};

    if (joinMethod === 'code') {
      const code = this.getNodeParameter('code', index) as string;
      body.code = code;
    } else if (joinMethod === 'url') {
      const url = this.getNodeParameter('url', index) as string;
      body.url = url;
    }

    return request(
      this,
      'PUT',
      `/devices/${deviceId}/groups`,
      body,
    );
  }

  // LEAVE GROUP
  if (operation === 'leaveGroup') {
    const id = this.getNodeParameter('id', index) as string;
    const remove = this.getNodeParameter('remove', index, true) as boolean;

    return request(
      this,
      'DELETE',
      `/devices/${deviceId}/groups`,
      {
        id,
        remove,
      },
    );
  }

  throw new Error(`The operation "${operation}" is not supported for groups!`);
}
