import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { request } from '../request';

export const departmentProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['departments'],
      },
    },
    options: [
      {
        name: 'Get Departments',
        value: 'getDepartments',
        description: 'Get a list of departments on the WhatsApp number',
      },
      {
        name: 'Create Department',
        value: 'createDepartment',
        description: 'Create a new department',
      },
      {
        name: 'Update Department',
        value: 'updateDepartment',
        description: 'Update an existing department',
      },
      {
        name: 'Delete Department',
        value: 'deleteDepartment',
        description: 'Delete a department by ID',
      },
    ],
    default: 'getDepartments',
  },
  {
    displayName: 'WhatsApp Number',
    name: 'deviceId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['departments'],
      },
    },
    description: 'The ID of the WhatsApp number',
  },

  // CREATE DEPARTMENT PARAMETERS
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['departments'],
        operation: ['createDepartment'],
      },
    },
    description: 'Department name (2-25 characters)',
  },
  {
    displayName: 'Color',
    name: 'color',
    type: 'options',
    required: true,
    default: 'blue',
    displayOptions: {
      show: {
        resource: ['departments'],
        operation: ['createDepartment'],
      },
    },
    options: [
      { name: 'Ruby', value: 'ruby' },
      { name: 'Tomato', value: 'tomato' },
      { name: 'Orange', value: 'orange' },
      { name: 'Sunflower', value: 'sunflower' },
      { name: 'Bubble', value: 'bubble' },
      { name: 'Rose', value: 'rose' },
      { name: 'Poppy', value: 'poppy' },
      { name: 'Rouge', value: 'rouge' },
      { name: 'Raspberry', value: 'raspberry' },
      { name: 'Purple', value: 'purple' },
      { name: 'Lavender', value: 'lavender' },
      { name: 'Violet', value: 'violet' },
      { name: 'Pool', value: 'pool' },
      { name: 'Emerald', value: 'emerald' },
      { name: 'Kelly', value: 'kelly' },
      { name: 'Apple', value: 'apple' },
      { name: 'Turquoise', value: 'turquoise' },
      { name: 'Aqua', value: 'aqua' },
      { name: 'Gold', value: 'gold' },
      { name: 'Latte', value: 'latte' },
      { name: 'Cocoa', value: 'cocoa' },
      { name: 'Iron', value: 'iron' },
    ],
    description: 'Department color for quick identification',
  },
  {
    displayName: 'Icon',
    name: 'icon',
    type: 'options',
    required: true,
    default: 'briefcase',
    displayOptions: {
      show: {
        resource: ['departments'],
        operation: ['createDepartment'],
      },
    },
    options: [
      { name: 'Briefcase', value: 'briefcase' },
      { name: 'Users', value: 'users' },
      { name: 'User Tie', value: 'user-tie' },
      { name: 'Chart Bar', value: 'chart-bar' },
      { name: 'Clipboard List', value: 'clipboard-list' },
      { name: 'Comments', value: 'comments' },
      { name: 'Headset', value: 'headset' },
      { name: 'User Cog', value: 'user-cog' },
      { name: 'User Edit', value: 'user-edit' },
      { name: 'User Friends', value: 'user-friends' },
      { name: 'Laptop Code', value: 'laptop-code' },
      { name: 'Network Wired', value: 'network-wired' },
      { name: 'Building', value: 'building' },
      { name: 'Handshake', value: 'handshake' },
      { name: 'Address Book', value: 'address-book' },
      { name: 'Layer Group', value: 'layer-group' },
      { name: 'Project Diagram', value: 'project-diagram' },
      { name: 'Calendar Check', value: 'calendar-check' },
      { name: 'Clipboard Check', value: 'clipboard-check' },
      { name: 'Tasks', value: 'tasks' },
      { name: 'Chart Pie', value: 'chart-pie' },
      { name: 'Hands Helping', value: 'hands-helping' },
      { name: 'Shield Alt', value: 'shield-alt' },
      { name: 'User Lock', value: 'user-lock' },
      { name: 'User Shield', value: 'user-shield' },
      { name: 'Bullhorn', value: 'bullhorn' },
      { name: 'Comments Dollar', value: 'comments-dollar' },
      { name: 'Comment Dots', value: 'comment-dots' },
      { name: 'Fingerprint', value: 'fingerprint' },
      { name: 'Check Circle', value: 'check-circle' },
      { name: 'Chalkboard Teacher', value: 'chalkboard-teacher' },
      { name: 'Cogs', value: 'cogs' },
      { name: 'Rocket', value: 'rocket' },
      { name: 'Drafting Compass', value: 'drafting-compass' },
      { name: 'Lightbulb', value: 'lightbulb' },
      { name: 'Envelope', value: 'envelope' },
      { name: 'Inbox', value: 'inbox' },
      { name: 'People Carry', value: 'people-carry' },
      { name: 'Code Branch', value: 'code-branch' },
      { name: 'Globe', value: 'globe' },
      { name: 'Hand Holding USD', value: 'hand-holding-usd' },
      { name: 'Money Bill Wave', value: 'money-bill-wave' },
      { name: 'Phone', value: 'phone' },
      { name: 'Wrench', value: 'wrench' },
      { name: 'Balance Scale', value: 'balance-scale' },
      { name: 'Thumbs Up', value: 'thumbs-up' },
      { name: 'User Secret', value: 'user-secret' },
      { name: 'User Graduate', value: 'user-graduate' },
      { name: 'Landmark', value: 'landmark' },
      { name: 'Archive', value: 'archive' },
    ],
    description: 'Department icon identifier',
  },
  {
    displayName: 'Description',
    name: 'description',
    type: 'string',
    required: false,
    default: '',
    displayOptions: {
      show: {
        resource: ['departments'],
        operation: ['createDepartment'],
      },
    },
    description: 'Department description (max 300 characters)',
  },
  {
    displayName: 'Agents',
    name: 'agents',
    type: 'string',
    required: true,
    typeOptions: {
      multipleValues: true,
    },
    default: [],
    displayOptions: {
      show: {
        resource: ['departments'],
        operation: ['createDepartment'],
      },
    },
    description: 'List of agent IDs to include in the department (1-30 agents required)',
  },

  // UPDATE DEPARTMENT PARAMETERS
  {
    displayName: 'Department ID',
    name: 'department',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['departments'],
        operation: ['updateDepartment', 'deleteDepartment'],
      },
    },
    description: 'ID of the department to update or delete',
  },
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: false,
    default: '',
    displayOptions: {
      show: {
        resource: ['departments'],
        operation: ['updateDepartment'],
      },
    },
    description: 'New department name (2-25 characters)',
  },
  {
    displayName: 'Color',
    name: 'color',
    type: 'options',
    required: false,
    default: '',
    displayOptions: {
      show: {
        resource: ['departments'],
        operation: ['updateDepartment'],
      },
    },
    options: [
      { name: 'Ruby', value: 'ruby' },
      { name: 'Tomato', value: 'tomato' },
      { name: 'Orange', value: 'orange' },
      { name: 'Sunflower', value: 'sunflower' },
      { name: 'Bubble', value: 'bubble' },
      { name: 'Rose', value: 'rose' },
      { name: 'Poppy', value: 'poppy' },
      { name: 'Rouge', value: 'rouge' },
      { name: 'Raspberry', value: 'raspberry' },
      { name: 'Purple', value: 'purple' },
      { name: 'Lavender', value: 'lavender' },
      { name: 'Violet', value: 'violet' },
      { name: 'Pool', value: 'pool' },
      { name: 'Emerald', value: 'emerald' },
      { name: 'Kelly', value: 'kelly' },
      { name: 'Apple', value: 'apple' },
      { name: 'Turquoise', value: 'turquoise' },
      { name: 'Aqua', value: 'aqua' },
      { name: 'Gold', value: 'gold' },
      { name: 'Latte', value: 'latte' },
      { name: 'Cocoa', value: 'cocoa' },
      { name: 'Iron', value: 'iron' },
    ],
    description: 'New department color for quick identification',
  },
  {
    displayName: 'Icon',
    name: 'icon',
    type: 'options',
    required: false,
    default: '',
    displayOptions: {
      show: {
        resource: ['departments'],
        operation: ['updateDepartment'],
      },
    },
    options: [
      { name: 'Briefcase', value: 'briefcase' },
      { name: 'Users', value: 'users' },
      { name: 'User Tie', value: 'user-tie' },
      { name: 'Chart Bar', value: 'chart-bar' },
      { name: 'Clipboard List', value: 'clipboard-list' },
      { name: 'Comments', value: 'comments' },
      { name: 'Headset', value: 'headset' },
      { name: 'User Cog', value: 'user-cog' },
      { name: 'User Edit', value: 'user-edit' },
      { name: 'User Friends', value: 'user-friends' },
      { name: 'Laptop Code', value: 'laptop-code' },
      { name: 'Network Wired', value: 'network-wired' },
      { name: 'Building', value: 'building' },
      { name: 'Handshake', value: 'handshake' },
      { name: 'Address Book', value: 'address-book' },
      { name: 'Layer Group', value: 'layer-group' },
      { name: 'Project Diagram', value: 'project-diagram' },
      { name: 'Calendar Check', value: 'calendar-check' },
      { name: 'Clipboard Check', value: 'clipboard-check' },
      { name: 'Tasks', value: 'tasks' },
      { name: 'Chart Pie', value: 'chart-pie' },
      { name: 'Hands Helping', value: 'hands-helping' },
      { name: 'Shield Alt', value: 'shield-alt' },
      { name: 'User Lock', value: 'user-lock' },
      { name: 'User Shield', value: 'user-shield' },
      { name: 'Bullhorn', value: 'bullhorn' },
      { name: 'Comments Dollar', value: 'comments-dollar' },
      { name: 'Comment Dots', value: 'comment-dots' },
      { name: 'Fingerprint', value: 'fingerprint' },
      { name: 'Check Circle', value: 'check-circle' },
      { name: 'Chalkboard Teacher', value: 'chalkboard-teacher' },
      { name: 'Cogs', value: 'cogs' },
      { name: 'Rocket', value: 'rocket' },
      { name: 'Drafting Compass', value: 'drafting-compass' },
      { name: 'Lightbulb', value: 'lightbulb' },
      { name: 'Envelope', value: 'envelope' },
      { name: 'Inbox', value: 'inbox' },
      { name: 'People Carry', value: 'people-carry' },
      { name: 'Code Branch', value: 'code-branch' },
      { name: 'Globe', value: 'globe' },
      { name: 'Hand Holding USD', value: 'hand-holding-usd' },
      { name: 'Money Bill Wave', value: 'money-bill-wave' },
      { name: 'Phone', value: 'phone' },
      { name: 'Wrench', value: 'wrench' },
      { name: 'Balance Scale', value: 'balance-scale' },
      { name: 'Thumbs Up', value: 'thumbs-up' },
      { name: 'User Secret', value: 'user-secret' },
      { name: 'User Graduate', value: 'user-graduate' },
      { name: 'Landmark', value: 'landmark' },
      { name: 'Archive', value: 'archive' },
    ],
    description: 'New department icon identifier',
  },
  {
    displayName: 'Description',
    name: 'description',
    type: 'string',
    required: false,
    default: '',
    displayOptions: {
      show: {
        resource: ['departments'],
        operation: ['updateDepartment'],
      },
    },
    description: 'New department description (max 300 characters)',
  },
  {
    displayName: 'Agents',
    name: 'agents',
    type: 'string',
    required: false,
    typeOptions: {
      multipleValues: true,
    },
    default: [],
    displayOptions: {
      show: {
        resource: ['departments'],
        operation: ['updateDepartment'],
      },
    },
    description: 'New list of agent IDs to include in the department (1-30 agents required)',
  },
];

export async function executeDepartmentOperations(
  this: IExecuteFunctions | any,
  index: number,
) {
  const operation = this.getNodeParameter('operation', index) as string;
  const deviceId = this.getNodeParameter('deviceId', index) as string;

  // GET DEPARTMENTS
  if (operation === 'getDepartments') {
    return request(
      this,
      'GET',
      `/devices/${deviceId}/departments`,
    );
  }

  // CREATE DEPARTMENT
  if (operation === 'createDepartment') {
    const name = this.getNodeParameter('name', index) as string;
    const color = this.getNodeParameter('color', index) as string;
    const icon = this.getNodeParameter('icon', index) as string;
    const description = this.getNodeParameter('description', index, '') as string;
    const agents = this.getNodeParameter('agents', index, []) as string[];

    if (!agents || agents.length === 0) {
      throw new Error('At least one agent is required to create a department');
    }

    if (agents.length > 30) {
      throw new Error('A maximum of 30 agents is allowed in a department');
    }

    const body: {
      name: string;
      color: string;
      icon: string;
      description?: string;
      agents: string[];
    } = {
      name,
      color,
      icon,
      agents,
    };

    if (description) {
      body.description = description;
    }

    return request(
      this,
      'POST',
      `/devices/${deviceId}/departments`,
      body,
    );
  }

  // UPDATE DEPARTMENT
  if (operation === 'updateDepartment') {
    const departmentId = this.getNodeParameter('department', index) as string;
    const name = this.getNodeParameter('name', index, '') as string;
    const color = this.getNodeParameter('color', index, '') as string;
    const icon = this.getNodeParameter('icon', index, '') as string;
    const description = this.getNodeParameter('description', index, '') as string;
    const agents = this.getNodeParameter('agents', index, []) as string[];

    const body: {
      department: string;
      name?: string;
      color?: string;
      icon?: string;
      description?: string;
      agents?: string[];
    } = {
      department: departmentId,
    };

    if (name) body.name = name;
    if (color) body.color = color;
    if (icon) body.icon = icon;
    if (description) body.description = description;

    if (agents && agents.length > 0) {
      if (agents.length > 30) {
        throw new Error('A maximum of 30 agents is allowed in a department');
      }
      body.agents = agents;
    }

    return request(
      this,
      'PATCH',
      `/devices/${deviceId}/departments`,
      body,
    );
  }

  // DELETE DEPARTMENT
  if (operation === 'deleteDepartment') {
    const departmentId = this.getNodeParameter('department', index) as string;

    return request(
      this,
      'DELETE',
      `/devices/${deviceId}/departments`,
      { department: departmentId },
    );
  }

  throw new Error(`The operation "${operation}" is not supported for departments!`);
}
