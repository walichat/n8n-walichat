import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { request } from '../request';

export const sessionProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['session'],
      },
    },
    options: [
      {
        name: 'Sync Session',
        value: 'syncSession',
        description: 'Force WhatsApp session status synchronization',
      },
      {
        name: 'Start Device',
        value: 'startDevice',
        description: 'Force to start device session during non-operative hours',
      },
      {
        name: 'Scan QR',
        value: 'scanQR',
        description: 'Get the QR image to scan for linking the WhatsApp session',
      },
      {
        name: 'Reset Device',
        value: 'resetDevice',
        description: 'Recreate device session, optionally deleting queued messages and stored data',
      },
      {
        name: 'Reboot Device',
        value: 'rebootDevice',
        description: 'Reboot the WhatsApp session without deleting data',
      },
      {
        name: 'Get Device Health',
        value: 'deviceHealth',
        description: 'Get device session health status and information',
      },
      {
        name: 'Request Authentication Code',
        value: 'requestNumberAuthCode',
        description: 'Request authentication code for WhatsApp number pairing',
      },
    ],
    default: 'deviceHealth',
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
        resource: ['session'],
      },
    },
    description: 'The ID of the WhatsApp number',
  },

  // START DEVICE OPTIONS
  {
    displayName: 'Wait For Session',
    name: 'wait',
    type: 'boolean',
    required: false,
    default: false,
    displayOptions: {
      show: {
        resource: ['session'],
        operation: ['startDevice'],
      },
    },
    description: 'Whether to wait for the device session to be available (may delay response up to 90 seconds)',
  },

  // SCAN QR OPTIONS
  {
    displayName: 'Force New QR',
    name: 'force',
    type: 'boolean',
    required: false,
    default: false,
    displayOptions: {
      show: {
        resource: ['session'],
        operation: ['scanQR'],
      },
    },
    description: 'Whether to force destroy existing session and request a new QR code',
  },
  {
    displayName: 'QR Encoding',
    name: 'encoding',
    type: 'options',
    required: false,
    default: 'svg',
    displayOptions: {
      show: {
        resource: ['session'],
        operation: ['scanQR'],
      },
    },
    options: [
      { name: 'SVG (Default)', value: 'svg' },
      { name: 'JSON', value: 'json' },
      { name: 'Base64', value: 'base64' },
      { name: 'Base64 URI', value: 'base64_uri' },
      { name: 'URI', value: 'uri' },
      { name: 'Image', value: 'image' },
    ],
    description: 'Format to return the QR image',
  },

  // RESET DEVICE OPTIONS
  {
    displayName: 'Options',
    name: 'resetOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['session'],
        operation: ['resetDevice'],
      },
    },
    options: [
      {
        displayName: 'Delete All Data',
        name: 'data',
        type: 'boolean',
        default: false,
        description: 'Whether to delete all stored chats/messages/contacts data',
      },
      {
        displayName: 'Wait For Session',
        name: 'wait',
        type: 'boolean',
        default: false,
        description: 'Whether to wait for the device to be available (may delay response up to 2 minutes)',
      },
      {
        displayName: 'Empty Queue',
        name: 'emptyQueue',
        type: 'boolean',
        default: false,
        description: 'Whether to delete all queued messages in the current device',
      },
    ],
  },

  // REBOOT DEVICE OPTIONS
  {
    displayName: 'Options',
    name: 'rebootOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['session'],
        operation: ['rebootDevice'],
      },
    },
    options: [
      {
        displayName: 'Force Reboot',
        name: 'force',
        type: 'boolean',
        default: false,
        description: 'Whether to force device reboot even if already stopped',
      },
      {
        displayName: 'Wait For Session',
        name: 'wait',
        type: 'boolean',
        default: false,
        description: 'Whether to wait for the device session to be available (may delay response up to 90 seconds)',
      },
      {
        displayName: 'Force Sync',
        name: 'sync',
        type: 'boolean',
        default: false,
        description: 'Whether to force device sync after reboot',
      },
    ],
  },

  // REQUEST NUMBER AUTH CODE OPTIONS
  {
    displayName: 'Force New Authentication',
    name: 'force',
    type: 'boolean',
    required: false,
    default: false,
    displayOptions: {
      show: {
        resource: ['session'],
        operation: ['requestNumberAuthCode'],
      },
    },
    description: 'Whether to force destroy existing session and request a new auth code',
  },
  {
    displayName: 'Phone Number',
    name: 'phone',
    type: 'string',
    required: false,
    default: '',
    displayOptions: {
      show: {
        resource: ['session'],
        operation: ['requestNumberAuthCode'],
      },
    },
    description: 'Phone number to send the authorization code to (in E.164 format, e.g. +16001234560). Required if device was never connected.',
  },
];

export async function executeSessionOperations(
  this: IExecuteFunctions | any,
  index: number,
) {
  const operation = this.getNodeParameter('operation', index) as string;
  const deviceId = this.getNodeParameter('deviceId', index) as string;

  // SYNC SESSION
  if (operation === 'syncSession') {
    return request(
      this,
      'GET',
      `/devices/${deviceId}/sync`,
    );
  }

  // START DEVICE
  if (operation === 'startDevice') {
    const wait = this.getNodeParameter('wait', index, false) as boolean;

    const queryParameters: Record<string, string> = {};
    if (wait) {
      queryParameters.wait = 'true';
    }

    return request(
      this,
      'POST',
      `/devices/${deviceId}/start`,
      undefined,
      queryParameters,
    );
  }

  // SCAN QR
  if (operation === 'scanQR') {
    const force = this.getNodeParameter('force', index, false) as boolean;
    const encoding = this.getNodeParameter('encoding', index, 'svg') as string;

    const queryParameters: Record<string, string> = {};
    if (force) {
      queryParameters.force = 'true';
    }

    if (encoding !== 'svg') {
      queryParameters.encoding = encoding;
    }

    // For SVG responses, we need to set the Accept header to indicate we want SVG
    const customHeaders: Record<string, string> = {};
    if (encoding === 'svg') {
      customHeaders['Accept'] = 'image/svg+xml';
    }

    return request(
      this,
      'GET',
      `/devices/${deviceId}/scan`,
      undefined,
      queryParameters,
      customHeaders,
    );
  }

  // RESET DEVICE
  if (operation === 'resetDevice') {
    const resetOptions = this.getNodeParameter('resetOptions', index, {}) as {
      data?: boolean;
      wait?: boolean;
      emptyQueue?: boolean;
    };

    const queryParameters: Record<string, string> = {};
    if (resetOptions.data) {
      queryParameters.data = 'true';
    }
    if (resetOptions.wait) {
      queryParameters.wait = 'true';
    }
    if (resetOptions.emptyQueue) {
      queryParameters.emptyQueue = 'true';
    }

    return request(
      this,
      'POST',
      `/devices/${deviceId}/reset`,
      undefined,
      queryParameters,
    );
  }

  // REBOOT DEVICE
  if (operation === 'rebootDevice') {
    const rebootOptions = this.getNodeParameter('rebootOptions', index, {}) as {
      force?: boolean;
      wait?: boolean;
      sync?: boolean;
    };

    const queryParameters: Record<string, string> = {};
    if (rebootOptions.force) {
      queryParameters.force = 'true';
    }
    if (rebootOptions.wait) {
      queryParameters.wait = 'true';
    }
    if (rebootOptions.sync) {
      queryParameters.sync = 'true';
    }

    return request(
      this,
      'POST',
      `/devices/${deviceId}/reboot`,
      undefined,
      queryParameters,
    );
  }

  // DEVICE HEALTH
  if (operation === 'deviceHealth') {
    return request(
      this,
      'GET',
      `/devices/${deviceId}/health`,
    );
  }

  // REQUEST NUMBER AUTH CODE
  if (operation === 'requestNumberAuthCode') {
    const force = this.getNodeParameter('force', index, false) as boolean;
    const phone = this.getNodeParameter('phone', index, '') as string;

    const queryParameters: Record<string, string> = {};
    if (force) {
      queryParameters.force = 'true';
    }

    const body: {
      phone?: string;
    } = {};

    if (phone) {
      body.phone = phone;
    }

    return request(
      this,
      'POST',
      `/devices/${deviceId}/authcode`,
      Object.keys(body).length ? body : undefined,
      queryParameters,
    );
  }

  throw new Error(`The operation "${operation}" is not supported for session!`);
}
