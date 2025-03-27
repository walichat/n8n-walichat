import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { request } from '../request';

export const teamProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['team'],
      },
    },
    options: [
      {
        name: 'Get Team Members',
        value: 'getTeamUsers',
        description: 'Get a list of all team members in your account',
      },
      {
        name: 'Update Team Member',
        value: 'updateTeamUser',
        description: 'Update team member information',
      },
      {
        name: 'Delete Team Members',
        value: 'deleteUsers',
        description: 'Remove one or more team members',
      },
      {
        name: 'Get Device Team Members',
        value: 'getDeviceTeamMembers',
        description: 'Get team members with access to a specific WhatsApp number',
      },
      {
        name: 'Create Team Member',
        value: 'createDeviceUser',
        description: 'Create a new team member with access to a WhatsApp number',
      },
      {
        name: 'Grant Device Access',
        value: 'grantDeviceUserAccess',
        description: 'Grant existing user access to a WhatsApp number',
      },
      {
        name: 'Revoke Device Access',
        value: 'revokeDeviceUserAccess',
        description: 'Revoke user access from a WhatsApp number',
      },
    ],
    default: 'getTeamUsers',
  },

  // GET TEAM USERS FILTERS
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['getTeamUsers'],
      },
    },
    options: [
      {
        displayName: 'User IDs',
        name: 'ids',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Filter users by specific IDs',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'multiOptions',
        options: [
          { name: 'Active', value: 'active' },
          { name: 'Pending', value: 'pending' },
          { name: 'Suspended', value: 'suspended' },
        ],
        default: [],
        description: 'Filter users by status',
      },
      {
        displayName: 'Role',
        name: 'role',
        type: 'multiOptions',
        options: [
          { name: 'Admin', value: 'admin' },
          { name: 'Supervisor', value: 'supervisor' },
          { name: 'Agent', value: 'agent' },
        ],
        default: [],
        description: 'Filter users by role',
      },
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Search users by name or email',
      },
      {
        displayName: 'Device ID',
        name: 'device',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getDevices',
        },
        default: '',
        displayOptions: {
          show: {
            resource: ['team'],
            operation: ['getTeamUsers'],
          },
        },
        description: 'Filter users with access to a specific WhatsApp number',
      },
      {
        displayName: 'Exclude User IDs',
        name: 'exceptIds',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Exclude specific user IDs from results',
      },
      {
        displayName: 'Last Online Before',
        name: 'onlineBefore',
        type: 'dateTime',
        default: '',
        description: 'Filter users last seen online before this date',
      },
      {
        displayName: 'Last Online After',
        name: 'onlineAfter',
        type: 'dateTime',
        default: '',
        description: 'Filter users last seen online after this date',
      },
      {
        displayName: 'Last Login Before',
        name: 'loginBefore',
        type: 'dateTime',
        default: '',
        description: 'Filter users who logged in before this date',
      },
      {
        displayName: 'Last Login After',
        name: 'loginAfter',
        type: 'dateTime',
        default: '',
        description: 'Filter users who logged in after this date',
      },
      {
        displayName: 'Results Page Size',
        name: 'size',
        type: 'number',
        default: 20,
        description: 'Number of results per page',
      },
      {
        displayName: 'Page Number',
        name: 'page',
        type: 'number',
        default: 0,
        description: 'Page number (starting from 0)',
      },
    ],
  },

  // UPDATE TEAM USER PARAMETERS
  {
    displayName: 'User ID',
    name: 'id',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['updateTeamUser'],
      },
    },
    description: 'ID of the user to update (24 characters hexadecimal)',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['updateTeamUser'],
      },
    },
    options: [
      {
        displayName: 'Display Name',
        name: 'displayName',
        type: 'string',
        default: '',
        description: 'New display name for the user (2-30 characters)',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        description: 'New email address for the user',
      },
      {
        displayName: 'Password',
        name: 'password',
        type: 'string',
        typeOptions: {
          password: true,
        },
        default: '',
        description: 'New password for the user (5-50 characters)',
      },
      {
        displayName: 'Role',
        name: 'role',
        type: 'options',
        options: [
          { name: 'Admin', value: 'admin' },
          { name: 'Supervisor', value: 'supervisor' },
          { name: 'Agent', value: 'agent' },
        ],
        default: '',
        description: 'New role for the user',
      },
      {
        displayName: 'Color',
        name: 'color',
        type: 'options',
        options: [
          { name: 'Blue', value: 'blue' },
          { name: 'Azure', value: 'azure' },
          { name: 'Indigo', value: 'indigo' },
          { name: 'Purple', value: 'purple' },
          { name: 'Pink', value: 'pink' },
          { name: 'Red', value: 'red' },
          { name: 'Orange', value: 'orange' },
          { name: 'Yellow', value: 'yellow' },
          { name: 'Lime', value: 'lime' },
          { name: 'Green', value: 'green' },
          { name: 'Teal', value: 'teal' },
          { name: 'Cyan', value: 'cyan' },
          { name: 'Gray', value: 'gray' },
          { name: 'Gray Dark', value: 'gray-dark' },
        ],
        default: '',
        description: 'New color for the user',
      },
    ],
  },

  // DELETE USERS PARAMETERS
  {
    displayName: 'Force Delete',
    name: 'force',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['deleteUsers'],
      },
    },
    description: 'Whether to force delete users even if they have access to one or more WhatsApp numbers',
  },
  {
    displayName: 'Users to Delete',
    name: 'users',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
      maxValues: 10,
    },
    default: { userItems: [{}] },
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['deleteUsers'],
      },
    },
    options: [
      {
        name: 'userItems',
        displayName: 'User',
        values: [
          {
            displayName: 'Identifier Type',
            name: 'identifierType',
            type: 'options',
            options: [
              { name: 'User ID', value: 'id' },
              { name: 'Email', value: 'email' },
            ],
            default: 'id',
            description: 'Type of identifier to use',
          },
          {
            displayName: 'User ID',
            name: 'id',
            type: 'string',
            default: '',
            displayOptions: {
              show: {
                identifierType: ['id'],
              },
            },
            description: 'ID of the user to delete (24 characters hexadecimal)',
          },
          {
            displayName: 'Email',
            name: 'email',
            type: 'string',
            default: '',
            displayOptions: {
              show: {
                identifierType: ['email'],
              },
            },
            description: 'Email of the user to delete',
          },
          {
            displayName: 'Action',
            name: 'action',
            type: 'options',
            options: [
              { name: 'Unassign Chats', value: 'unassign' },
              { name: 'Reassign Chats', value: 'reassign' },
              { name: 'Resolve Chats', value: 'resolve' },
            ],
            default: 'unassign',
            description: 'Action to perform on the chats assigned to this user',
          },
          {
            displayName: 'Reassign To User ID',
            name: 'assign',
            type: 'options',
            typeOptions: {
              loadOptionsMethod: 'getTeamAgents',
              loadOptionsDependsOn: ['device'],
            },
            displayOptions: {
              show: {
                action: ['reassign'],
              },
            },
            default: '',
            description: 'User ID to reassign the chats to',
          },
          {
            displayName: 'Remove Completely',
            name: 'remove',
            type: 'boolean',
            default: false,
            description: 'Whether to remove the user completely from the system even if they have access to other WhatsApp numbers',
          },
        ],
      },
    ],
    description: 'List of users to delete',
  },

  // DEVICE TEAM OPERATIONS - COMMON PARAMETER
  {
    displayName: 'WhatsApp Number',
    name: 'device',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getDevices',
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['getDeviceTeamMembers', 'createDeviceUser', 'grantDeviceUserAccess', 'revokeDeviceUserAccess'],
      },
    },
    description: 'The ID of the WhatsApp number',
  },

  // CREATE DEVICE USER PARAMETERS
  {
    displayName: 'Display Name',
    name: 'displayName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['createDeviceUser'],
      },
    },
    description: 'Display name for the new user (2-30 characters)',
  },
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['createDeviceUser'],
      },
    },
    description: 'Email address for the new user',
  },
  {
    displayName: 'Password',
    name: 'password',
    type: 'string',
    required: true,
    typeOptions: {
      password: true,
    },
    default: '',
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['createDeviceUser'],
      },
    },
    description: 'Password for the new user (5-50 characters)',
  },
  {
    displayName: 'Role',
    name: 'role',
    type: 'options',
    required: true,
    options: [
      { name: 'Admin', value: 'admin' },
      { name: 'Supervisor', value: 'supervisor' },
      { name: 'Agent', value: 'agent' },
    ],
    default: 'agent',
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['createDeviceUser'],
      },
    },
    description: 'Role for the new user',
  },
  {
    displayName: 'Color',
    name: 'color',
    type: 'options',
    required: true,
    options: [
      { name: 'Blue', value: 'blue' },
      { name: 'Azure', value: 'azure' },
      { name: 'Indigo', value: 'indigo' },
      { name: 'Purple', value: 'purple' },
      { name: 'Pink', value: 'pink' },
      { name: 'Red', value: 'red' },
      { name: 'Orange', value: 'orange' },
      { name: 'Yellow', value: 'yellow' },
      { name: 'Lime', value: 'lime' },
      { name: 'Green', value: 'green' },
      { name: 'Teal', value: 'teal' },
      { name: 'Cyan', value: 'cyan' },
      { name: 'Gray', value: 'gray' },
      { name: 'Gray Dark', value: 'gray-dark' },
    ],
    default: 'blue',
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['createDeviceUser'],
      },
    },
    description: 'Color for the new user',
  },
  {
    displayName: 'Send Invitation Email',
    name: 'invite',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['createDeviceUser'],
      },
    },
    description: 'Whether to send an invitation email to the new user',
  },

  // GRANT DEVICE USER ACCESS PARAMETERS
  {
    displayName: 'User ID',
    name: 'id',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getTeamAgents',
      loadOptionsDependsOn: ['device'],
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['grantDeviceUserAccess'],
      },
    },
    description: 'ID of the user to grant access to (24 characters hexadecimal)',
  },

  // REVOKE DEVICE USER ACCESS PARAMETERS
  {
    displayName: 'User Identifier Type',
    name: 'identifierType',
    type: 'options',
    required: true,
    options: [
      { name: 'User ID', value: 'id' },
      { name: 'Email', value: 'email' },
    ],
    default: 'id',
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['revokeDeviceUserAccess'],
      },
    },
    description: 'Type of identifier to use',
  },
  {
    displayName: 'User ID',
    name: 'id',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['revokeDeviceUserAccess'],
        identifierType: ['id'],
      },
    },
    description: 'ID of the user to revoke access from (24 characters hexadecimal)',
  },
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['revokeDeviceUserAccess'],
        identifierType: ['email'],
      },
    },
    description: 'Email of the user to revoke access from',
  },
  {
    displayName: 'Action',
    name: 'action',
    type: 'options',
    options: [
      { name: 'Unassign Chats', value: 'unassign' },
      { name: 'Reassign Chats', value: 'reassign' },
      { name: 'Resolve Chats', value: 'resolve' },
    ],
    default: 'unassign',
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['revokeDeviceUserAccess'],
      },
    },
    description: 'Action to perform on the chats assigned to this user',
  },
  {
    displayName: 'Reassign To User ID',
    name: 'assign',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getTeamAgents',
      loadOptionsDependsOn: ['device'],
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['revokeDeviceUserAccess'],
        action: ['reassign'],
      },
    },
    description: 'User ID to reassign the chats to',
  },
  {
    displayName: 'Remove Completely',
    name: 'remove',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['revokeDeviceUserAccess'],
      },
    },
    description: 'Whether to remove the user completely from the system',
  },
];

export async function executeTeamOperations(
  this: IExecuteFunctions | any,
  index: number,
) {
  const operation = this.getNodeParameter('operation', index) as string;

  // GET TEAM USERS
  if (operation === 'getTeamUsers') {
    const filters = this.getNodeParameter('filters', index, {}) as {
      ids?: string[];
      status?: string[];
      role?: string[];
      search?: string;
      device?: string;
      exceptIds?: string[];
      onlineBefore?: string;
      onlineAfter?: string;
      loginBefore?: string;
      loginAfter?: string;
      size?: number;
      page?: number;
    };

    const queryParameters: Record<string, string | string[] | number> = {};

    // Add all filters to query parameters
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== '' &&
          (typeof value !== 'object' || (Array.isArray(value) && value.length > 0))) {
        queryParameters[key] = value;
      }
    }

    return request(
      this,
      'GET',
      '/team',
      undefined,
      queryParameters as Record<string, string>,
    );
  }

  // UPDATE TEAM USER
  if (operation === 'updateTeamUser') {
    const userId = this.getNodeParameter('id', index) as string;
    const updateFields = this.getNodeParameter('updateFields', index, {}) as {
      displayName?: string;
      email?: string;
      password?: string;
      role?: string;
      color?: string;
    };

    const body: {
      id: string;
      displayName?: string;
      email?: string;
      password?: string;
      role?: string;
      color?: string;
    } = {
      id: userId,
    };

    // Add update fields to request body
    for (const [key, value] of Object.entries(updateFields)) {
      if (value !== undefined && value !== '') {
        body[key as keyof typeof body] = value;
      }
    }

    return request(
      this,
      'PATCH',
      '/team',
      body,
    );
  }

  // DELETE USERS
  if (operation === 'deleteUsers') {
    const force = this.getNodeParameter('force', index, false) as boolean;
    const usersCollection = this.getNodeParameter('users', index) as {
      userItems: Array<{
        identifierType: string;
        id?: string;
        email?: string;
        action: string;
        assign?: string;
        remove: boolean;
      }>;
    };

    const users = usersCollection.userItems.map(item => {
      const user: {
        id?: string;
        email?: string;
        action: string;
        assign?: string;
        remove: boolean;
      } = {
        action: item.action,
        remove: item.remove,
      };

      if (item.identifierType === 'id' && item.id) {
        user.id = item.id;
      } else if (item.identifierType === 'email' && item.email) {
        user.email = item.email;
      }

      if (item.action === 'reassign' && item.assign) {
        user.assign = item.assign;
      }

      return user;
    });

    const body = {
      force,
      users,
    };

    return request(
      this,
      'DELETE',
      '/team',
      body,
    );
  }

  // GET DEVICE TEAM MEMBERS
  if (operation === 'getDeviceTeamMembers') {
    const device = this.getNodeParameter('device', index) as string;

    return request(
      this,
      'GET',
      `/devices/${device}/team`,
    );
  }

  // CREATE DEVICE USER
  if (operation === 'createDeviceUser') {
    const device = this.getNodeParameter('device', index) as string;
    const displayName = this.getNodeParameter('displayName', index) as string;
    const email = this.getNodeParameter('email', index) as string;
    const password = this.getNodeParameter('password', index) as string;
    const role = this.getNodeParameter('role', index) as string;
    const color = this.getNodeParameter('color', index) as string;
    const invite = this.getNodeParameter('invite', index, false) as boolean;

    const body = {
      displayName,
      email,
      password,
      role,
      color,
      invite,
    };

    return request(
      this,
      'POST',
      `/devices/${device}/team`,
      body,
    );
  }

  // GRANT DEVICE USER ACCESS
  if (operation === 'grantDeviceUserAccess') {
    const device = this.getNodeParameter('device', index) as string;
    const id = this.getNodeParameter('id', index) as string;

    return request(
      this,
      'PATCH',
      `/devices/${device}/team`,
      { id },
    );
  }

  // REVOKE DEVICE USER ACCESS
  if (operation === 'revokeDeviceUserAccess') {
    const device = this.getNodeParameter('device', index) as string;
    const identifierType = this.getNodeParameter('identifierType', index) as string;
    const action = this.getNodeParameter('action', index) as string;
    const remove = this.getNodeParameter('remove', index, false) as boolean;

    const body: {
      id?: string;
      email?: string;
      action: string;
      assign?: string;
      remove: boolean;
    } = {
      action,
      remove,
    };

    if (identifierType === 'id') {
      const id = this.getNodeParameter('id', index) as string;
      body.id = id;
    } else {
      const email = this.getNodeParameter('email', index) as string;
      body.email = email;
    }

    if (action === 'reassign') {
      const assign = this.getNodeParameter('assign', index) as string;
      body.assign = assign;
    }

    return request(
      this,
      'DELETE',
      `/devices/${device}/team`,
      body,
    );
  }

  throw new Error(`The operation "${operation}" is not supported for team!`);
}
