import { IExecuteFunctions } from 'n8n-workflow';
import axios, { AxiosRequestConfig, Method } from 'axios';

const baseUrl = 'https://api.wali.chat/v1';
const clientRuntime = process.env.N8N_RUNTIME_CLIENT

export async function rawRequest (opts: AxiosRequestConfig, apiKey: string): Promise<any> {
  if (!apiKey) {
    throw new Error('API key is required');
  }
  if (!opts.url) {
    throw new Error('URL path is required');
  }
  opts.baseURL = baseUrl;
  opts.headers = opts.headers || {};
  Object.assign(opts.headers, {
    'x-n8n-client': 'n8n',
    'Authorization': `Bearer ${clientRuntime ? clientRuntime + '_' : ''}${apiKey}`,
  })

  return await axios(opts);
}

/**
 * Makes an authenticated request to the WaliChat API
 *
 * @param executeFunctions - The n8n execute functions context
 * @param method - HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @param endpoint - API endpoint (without base URL)
 * @param body - Optional request body for POST, PUT, PATCH, DELETE
 * @param query - Optional query parameters
 * @param customHeaders - Optional custom headers to merge with defaults
 * @returns The API response data
 */
export async function request(
  executeFunctions: IExecuteFunctions,
  method: Method,
  endpoint: string,
  body?: object,
  query?: Record<string, string>,
  customHeaders?: Record<string, string>,
): Promise<any> {
  const credentials = await executeFunctions.getCredentials('walichatApiKey');
  const apiKey = credentials.walichatApiKey as string;
  if (!apiKey) {
    throw new Error('API key is required');
  }

  const url = `${baseUrl}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${clientRuntime ? clientRuntime + '_' : ''}${apiKey}`,
    'x-n8n-client': 'n8n',
    ...(customHeaders || {}),
  };

  const config: AxiosRequestConfig = {
    url,
    method,
    headers,
    params: query,
  };

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && body) {
    config.data = body;
  }

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Create a detailed error object with additional information
      const errorResponse: Record<string, any> = {
        error: error.message,
        statusCode: error.response?.status,
      };

      if (error.response) {
        errorResponse.statusText = error.response.statusText;

        // Add response data if available
        if (error.response.data) {
          if (typeof error.response.data === 'object') {
            errorResponse.responseBody = error.response.data;
          } else {
            try {
              errorResponse.responseBody = JSON.parse(error.response.data);
            } catch (e) {
              errorResponse.responseBody = error.response.data;
            }
          }

          // Add any error message or code from the response
          if (error.response.data.error) {
            errorResponse.apiError = error.response.data.error;
          }
          if (error.response.data.code) {
            errorResponse.apiCode = error.response.data.code;
          }
          if (error.response.data.message) {
            errorResponse.apiMessage = error.response.data.message;
          }
        }
      }

      throw new Error(`WaliChat API Error: ${JSON.stringify(errorResponse)}`);
    }

    // Re-throw non-axios errors
    throw error;
  }
}

