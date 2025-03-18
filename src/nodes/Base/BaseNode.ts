import axios, { AxiosRequestConfig } from 'axios';
import { INodeType, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { getDevices, getFiles, getGroups } from '../methods';

interface ApiRequestParams {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';
  body?: object | any[];
  query?: object;
  path: string;
  headers?: object;
}

export class BaseNode {
  baseUrl: string = 'https://api.wali.chat/v1';

  async request(params: ApiRequestParams): Promise<any> {
    const { method = 'POST', body, query, path, headers } = params;

    const config: AxiosRequestConfig = {
      method,
      url: `${this.baseUrl}${path}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      data: body,
      params: query,
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      let errorMessage: string = 'Unknown error';
      if (axios.isAxiosError(error)) {
        if (error.response?.data) {
          // Include status code and error data for better debugging:
          errorMessage = `HTTP Error ${error.response.status}: ${JSON.stringify(error.response.data)}`;
        } else if (error.request) {
          errorMessage = 'No response received from the API.';
        } else {
          errorMessage = error.message;
        }
      } else {
        errorMessage = (error as Error).message;
      }
      throw new Error(errorMessage);
    }
  }

  methods: INodeType['methods'] = {
    loadOptions: {
      getFiles,
      getDevices,
      getGroups
    },
  };

  async execute(node: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // This method should be overridden by the inheriting class
    throw new Error('Execute method not implemented');
  }
}
