import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { request } from '../request';

export const outboundFileProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['outbound-files'],
      },
    },
    options: [
      {
        name: 'Search Files',
        value: 'searchFiles',
        description: 'Search/list files',
      },
      {
        name: 'Upload File',
        value: 'uploadFile',
        description: 'Upload a new file',
      },
      {
        name: 'Delete Files',
        value: 'deleteFiles',
        description: 'Delete multiple files',
      },
      {
        name: 'Get File Preview',
        value: 'previewFile',
        description: 'Get file preview image',
      },
      {
        name: 'Download File',
        value: 'downloadFile',
        description: 'Download file content',
      },
      {
        name: 'Get File',
        value: 'getFile',
        description: 'Get file information by ID',
      },
      {
        name: 'Update File',
        value: 'updateFile',
        description: 'Update file metadata',
      },
      {
        name: 'Delete File',
        value: 'deleteFile',
        description: 'Delete a file by ID',
      },
    ],
    default: 'searchFiles',
  },

  // SEARCH FILES FILTERS
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['outbound-files'],
        operation: ['searchFiles'],
      },
    },
    options: [
      {
        displayName: 'Search Term',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Search files by filename, tags or reference',
      },
      {
        displayName: 'Created After',
        name: 'after',
        type: 'dateTime',
        default: '',
        description: 'Files created after this date',
      },
      {
        displayName: 'Created Before',
        name: 'before',
        type: 'dateTime',
        default: '',
        description: 'Files created before this date',
      },
      {
        displayName: 'File Format',
        name: 'format',
        type: 'multiOptions',
        options: [
          { name: 'GIF', value: 'gif' },
          { name: 'Voice Message', value: 'ptt' },
          { name: 'Native', value: 'native' },
        ],
        default: [],
        description: 'Filter files by format type',
      },
      {
        displayName: 'File IDs',
        name: 'ids',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Filter files by specific IDs',
      },
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Filter files by tags',
      },
      {
        displayName: 'SHA2 Checksum',
        name: 'sha2',
        type: 'string',
        default: '',
        description: 'Find a file by SHA2 checksum',
      },
      {
        displayName: 'Reference',
        name: 'reference',
        type: 'string',
        default: '',
        description: 'Search files by reference',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'multiOptions',
        options: [
          { name: 'Ready', value: 'ready' },
          { name: 'Processing', value: 'processing' },
          { name: 'Failed', value: 'failed' },
        ],
        default: [],
        description: 'Filter files by status',
      },
      {
        displayName: 'Device ID',
        name: 'device',
        type: 'string',
        default: '',
        description: 'Filter files by device ID',
      },
      {
        displayName: 'Filename',
        name: 'filename',
        type: 'string',
        default: '',
        description: 'Search files by filename',
      },
      {
        displayName: 'Origin',
        name: 'origin',
        type: 'options',
        options: [
          { name: 'Remote URL', value: 'remote' },
          { name: 'Upload', value: 'upload' },
        ],
        default: '',
        description: 'Filter files by origin',
      },
      {
        displayName: 'MIME Type',
        name: 'mime',
        type: 'multiOptions',
        options: [
          { name: 'JPEG Image', value: 'image/jpeg' },
          { name: 'PNG Image', value: 'image/png' },
          { name: 'MP4 Video', value: 'video/mp4' },
          { name: 'MP3 Audio', value: 'audio/mp3' },
          { name: 'OGG Audio', value: 'audio/ogg' },
          { name: 'PDF Document', value: 'application/pdf' },
        ],
        default: [],
        description: 'Filter files by MIME type',
      },
      {
        displayName: 'File Type',
        name: 'kind',
        type: 'multiOptions',
        options: [
          { name: 'Image', value: 'image' },
          { name: 'Video', value: 'video' },
          { name: 'Audio', value: 'audio' },
          { name: 'Document', value: 'document' },
          { name: 'Other', value: 'file' },
        ],
        default: [],
        description: 'Filter files by type',
      },
      {
        displayName: 'Extension',
        name: 'ext',
        type: 'multiOptions',
        options: [
          { name: 'JPG', value: 'jpg' },
          { name: 'PNG', value: 'png' },
          { name: 'MP4', value: 'mp4' },
          { name: 'MP3', value: 'mp3' },
          { name: 'OGG', value: 'ogg' },
          { name: 'PDF', value: 'pdf' },
          { name: 'DOCX', value: 'docx' },
          { name: 'XLSX', value: 'xlsx' },
        ],
        default: [],
        description: 'Filter files by extension',
      },
      {
        displayName: 'Permission',
        name: 'permission',
        type: 'options',
        options: [
          { name: 'Public', value: 'public' },
          { name: 'Read-only', value: 'readonly' },
          { name: 'Private', value: 'private' },
        ],
        default: '',
        description: 'Filter files by permission level',
      },
      {
        displayName: 'Owner User ID',
        name: 'owner',
        type: 'string',
        default: '',
        description: 'Filter files by creator user ID',
      },
      {
        displayName: 'File Size Range (bytes)',
        name: 'filesize',
        type: 'string',
        default: '',
        placeholder: '10000,1000000',
        description: 'Filter by file size range (min,max) in bytes',
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

  // UPLOAD FILE OPTIONS
  {
    displayName: 'Upload Method',
    name: 'uploadMethod',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['outbound-files'],
        operation: ['uploadFile'],
      },
    },
    options: [
      {
        name: 'From URL',
        value: 'url',
      },
      // Binary data upload would require additional implementation
      // that's not fully covered in this example
      {
        name: 'From URL (Without Binary Data Support)',
        value: 'url_only',
        description: 'Note: Full binary upload is not supported in this version',
      },
    ],
    default: 'url',
  },
  {
    displayName: 'File URL',
    name: 'url',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['outbound-files'],
        operation: ['uploadFile'],
        uploadMethod: ['url', 'url_only'],
      },
    },
    description: 'URL of the file to upload',
  },
  {
    displayName: 'File Options',
    name: 'fileOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['outbound-files'],
        operation: ['uploadFile'],
      },
    },
    options: [
      {
        displayName: 'Filename',
        name: 'filename',
        type: 'string',
        default: '',
        description: 'Custom filename for the uploaded file',
      },
      {
        displayName: 'Reference',
        name: 'reference',
        type: 'string',
        default: '',
        description: 'Reference identifier for the file',
      },
      {
        displayName: 'Format',
        name: 'format',
        type: 'options',
        options: [
          { name: 'GIF', value: 'gif' },
          { name: 'Voice Message', value: 'ptt' },
          { name: 'Native', value: 'native' },
        ],
        default: 'native',
        description: 'Display format for the file',
      },
      {
        displayName: 'Expiration',
        name: 'expiration',
        type: 'options',
        options: [
          { name: '10 Minutes', value: '10m' },
          { name: '30 Minutes', value: '30m' },
          { name: '1 Hour', value: '1h' },
          { name: '6 Hours', value: '6h' },
          { name: '12 Hours', value: '12h' },
          { name: '1 Day', value: '1d' },
          { name: '2 Days', value: '2d' },
          { name: '3 Days', value: '3d' },
          { name: '5 Days', value: '5d' },
          { name: '7 Days', value: '7d' },
          { name: '15 Days', value: '15d' },
          { name: '30 Days', value: '30d' },
          { name: '60 Days', value: '60d' },
          { name: '90 Days', value: '90d' },
          { name: '120 Days', value: '120d' },
          { name: '180 Days', value: '180d' },
          { name: '1 Year', value: '1y' },
          { name: '2 Years', value: '2y' },
        ],
        default: '30d',
        description: 'File expiration time',
      },
      {
        displayName: 'Permission',
        name: 'permission',
        type: 'options',
        options: [
          { name: 'Public', value: 'public' },
          { name: 'Read-only', value: 'readonly' },
          { name: 'Private', value: 'private' },
        ],
        default: 'public',
        description: 'Access permission for the file',
      },
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Tags for the file',
      },
    ],
  },

  // DELETE FILES OPTIONS
  {
    displayName: 'Delete Options',
    name: 'deleteOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['outbound-files'],
        operation: ['deleteFiles'],
      },
    },
    options: [
      {
        displayName: 'Maximum Files to Delete',
        name: 'limit',
        type: 'number',
        default: 100,
        description: 'Maximum limit of files to delete (1-500)',
      },
      {
        displayName: 'File IDs',
        name: 'ids',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'IDs of files to delete',
      },
      {
        displayName: 'Created Before',
        name: 'before',
        type: 'dateTime',
        default: '',
        description: 'Delete files created before this date',
      },
      {
        displayName: 'Created After',
        name: 'after',
        type: 'dateTime',
        default: '',
        description: 'Delete files created after this date',
      },
      {
        displayName: 'Expires Before',
        name: 'expires',
        type: 'dateTime',
        default: '',
        description: 'Delete files that expire before this date',
      },
      {
        displayName: 'Filename',
        name: 'filename',
        type: 'string',
        default: '',
        description: 'Delete files matching this filename',
      },
      {
        displayName: 'File Extensions',
        name: 'ext',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Delete files with these extensions',
      },
      {
        displayName: 'MIME Types',
        name: 'mime',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Delete files with these MIME types',
      },
      {
        displayName: 'File Types',
        name: 'kind',
        type: 'multiOptions',
        options: [
          { name: 'Image', value: 'image' },
          { name: 'Video', value: 'video' },
          { name: 'Audio', value: 'audio' },
          { name: 'Document', value: 'document' },
          { name: 'Other', value: 'file' },
        ],
        default: [],
        description: 'Delete files of these types',
      },
      {
        displayName: 'Owner IDs',
        name: 'owner',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Delete files created by these user IDs',
      },
      {
        displayName: 'Format',
        name: 'format',
        type: 'options',
        options: [
          { name: 'GIF', value: 'gif' },
          { name: 'Voice Message', value: 'ptt' },
          { name: 'Native', value: 'native' },
        ],
        default: 'native',
        description: 'Delete files with this format',
      },
      {
        displayName: 'Permission',
        name: 'permission',
        type: 'options',
        options: [
          { name: 'Public', value: 'public' },
          { name: 'Read-only', value: 'readonly' },
          { name: 'Private', value: 'private' },
        ],
        default: 'public',
        description: 'Delete files with this permission',
      },
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Delete files with these tags',
      },
      {
        displayName: 'Minimum Size (bytes)',
        name: 'size',
        type: 'number',
        default: 0,
        description: 'Delete files larger than this size in bytes',
      },
      {
        displayName: 'Origin',
        name: 'origin',
        type: 'options',
        options: [
          { name: 'Remote URL', value: 'remote' },
          { name: 'Upload', value: 'upload' },
        ],
        default: '',
        description: 'Delete files with this origin',
      },
      {
        displayName: 'SHA2 Hashes',
        name: 'sha2',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'Delete files with these SHA2 hashes',
      },
    ],
  },

  // FILE ID FOR SINGLE FILE OPERATIONS
  {
    displayName: 'File ID',
    name: 'fileId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['outbound-files'],
        operation: ['previewFile', 'downloadFile', 'getFile', 'updateFile', 'deleteFile'],
      },
    },
    description: 'ID of the file',
  },

  // UPDATE FILE OPTIONS
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['outbound-files'],
        operation: ['updateFile'],
      },
    },
    options: [
      {
        displayName: 'Filename',
        name: 'filename',
        type: 'string',
        default: '',
        description: 'New filename for the file',
      },
      {
        displayName: 'Reference',
        name: 'reference',
        type: 'string',
        default: '',
        description: 'New reference identifier',
      },
      {
        displayName: 'Format',
        name: 'format',
        type: 'options',
        options: [
          { name: 'GIF', value: 'gif' },
          { name: 'Voice Message', value: 'ptt' },
          { name: 'Native', value: 'native' },
        ],
        default: 'native',
        description: 'New display format',
      },
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'New tags for the file',
      },
      {
        displayName: 'Message Caption',
        name: 'message',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        description: 'Text caption for the media file',
      },
      {
        displayName: 'Expiration',
        name: 'expiration',
        type: 'options',
        options: [
          { name: '10 Minutes', value: '10m' },
          { name: '30 Minutes', value: '30m' },
          { name: '1 Hour', value: '1h' },
          { name: '6 Hours', value: '6h' },
          { name: '12 Hours', value: '12h' },
          { name: '1 Day', value: '1d' },
          { name: '2 Days', value: '2d' },
          { name: '3 Days', value: '3d' },
          { name: '5 Days', value: '5d' },
          { name: '7 Days', value: '7d' },
          { name: '15 Days', value: '15d' },
          { name: '30 Days', value: '30d' },
          { name: '60 Days', value: '60d' },
          { name: '90 Days', value: '90d' },
          { name: '120 Days', value: '120d' },
          { name: '180 Days', value: '180d' },
          { name: '1 Year', value: '1y' },
          { name: '2 Years', value: '2y' },
        ],
        default: '',
        description: 'New expiration time',
      },
      {
        displayName: 'Permission',
        name: 'permission',
        type: 'options',
        options: [
          { name: 'Public', value: 'public' },
          { name: 'Read-only', value: 'readonly' },
          { name: 'Private', value: 'private' },
        ],
        default: '',
        description: 'New access permission',
      },
    ],
  },
];

export async function executeOutboundFileOperations(
  this: IExecuteFunctions | any,
  index: number,
) {
  const operation = this.getNodeParameter('operation', index) as string;

  // SEARCH FILES
  if (operation === 'searchFiles') {
    const filters = this.getNodeParameter('filters', index, {}) as {
      search?: string;
      after?: string;
      before?: string;
      format?: string[];
      ids?: string[];
      tags?: string[];
      sha2?: string;
      reference?: string;
      status?: string[];
      device?: string;
      filename?: string;
      origin?: string;
      mime?: string[];
      kind?: string[];
      ext?: string[];
      permission?: string;
      owner?: string;
      filesize?: string;
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
      '/files',
      undefined,
      queryParameters as Record<string, string>,
    );
  }

  // UPLOAD FILE
  if (operation === 'uploadFile') {
    const uploadMethod = this.getNodeParameter('uploadMethod', index) as string;
    const url = this.getNodeParameter('url', index) as string;
    const fileOptions = this.getNodeParameter('fileOptions', index, {}) as {
      filename?: string;
      reference?: string;
      format?: string;
      expiration?: string;
      permission?: string;
      tags?: string[];
    };

    const body: Record<string, any> = {
      url,
    };

    // Add file options to request body
    for (const [key, value] of Object.entries(fileOptions)) {
      if (value !== undefined &&
          (typeof value !== 'object' || (Array.isArray(value) && value.length > 0))) {
        body[key] = value;
      }
    }

    return request(
      this,
      'POST',
      '/files',
      body,
    );
  }

  // DELETE FILES
  if (operation === 'deleteFiles') {
    const deleteOptions = this.getNodeParameter('deleteOptions', index, {}) as {
      limit?: number;
      ids?: string[];
      before?: string;
      after?: string;
      expires?: string;
      filename?: string;
      ext?: string[];
      mime?: string[];
      kind?: string[];
      owner?: string[];
      format?: string;
      permission?: string;
      tags?: string[];
      size?: number;
      origin?: string;
      sha2?: string[];
    };

    const body: Record<string, any> = {};

    // Add delete options to request body
    for (const [key, value] of Object.entries(deleteOptions)) {
      if (value !== undefined &&
          (typeof value !== 'object' || (Array.isArray(value) && value.length > 0))) {
        body[key] = value;
      }
    }

    return request(
      this,
      'DELETE',
      '/files',
      body,
    );
  }

  // GET FILE PREVIEW
  if (operation === 'previewFile') {
    const fileId = this.getNodeParameter('fileId', index) as string;

    // For image responses, set appropriate Accept header
    const customHeaders = {
      'Accept': 'image/*',
    };

    return request(
      this,
      'GET',
      `/files/${fileId}/preview`,
      undefined,
      undefined,
      customHeaders,
    );
  }

  // DOWNLOAD FILE
  if (operation === 'downloadFile') {
    const fileId = this.getNodeParameter('fileId', index) as string;

    // For binary file responses, set appropriate Accept header
    const customHeaders = {
      'Accept': '*/*',
    };

    return request(
      this,
      'GET',
      `/files/${fileId}/download`,
      undefined,
      undefined,
      customHeaders,
    );
  }

  // GET FILE
  if (operation === 'getFile') {
    const fileId = this.getNodeParameter('fileId', index) as string;

    return request(
      this,
      'GET',
      `/files/${fileId}`,
    );
  }

  // UPDATE FILE
  if (operation === 'updateFile') {
    const fileId = this.getNodeParameter('fileId', index) as string;
    const updateFields = this.getNodeParameter('updateFields', index, {}) as {
      filename?: string;
      reference?: string;
      format?: string;
      tags?: string[];
      message?: string;
      expiration?: string;
      permission?: string;
    };

    const body: Record<string, any> = {};

    // Add update fields to request body
    for (const [key, value] of Object.entries(updateFields)) {
      if (value !== undefined &&
          (typeof value !== 'object' || (Array.isArray(value) && value.length > 0))) {
        body[key] = value;
      }
    }

    return request(
      this,
      'PATCH',
      `/files/${fileId}`,
      body,
    );
  }

  // DELETE FILE
  if (operation === 'deleteFile') {
    const fileId = this.getNodeParameter('fileId', index) as string;

    return request(
      this,
      'DELETE',
      `/files/${fileId}`,
    );
  }

  throw new Error(`The operation "${operation}" is not supported for outbound files!`);
}
