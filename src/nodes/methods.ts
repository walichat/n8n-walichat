import axios from 'axios';
import { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';

export async function getDevices(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  // Retrieve the credentials object declared on the node
  const credentials = await this.getCredentials('WaliChatApiKey');
  if (!credentials || !credentials.apiKey) {
    throw new Error('No WaliChat API Key credentials found!');
  }
  const apiKey = credentials.apiKey as string;
  const response = await axios.get(`https://api.wali.chat/v1/devices?token=${apiKey}`);
  return response.data.map((device: { id: string, alias: string, phone: string }) => ({
    name: `${device.alias} (${device.phone})`,
    value: device.id,
  }));
}

export async function getGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  // Retrieve the credentials object declared on the node
  const credentials = await this.getCredentials('WaliChatApiKey');
  if (!credentials || !credentials.apiKey) {
    throw new Error('No WaliChat API Key credentials found!');
  }
  const device = this.getNodeParameter('device', 0) as string;
  if (!device) {
    throw new Error('Please select WhatsApp device selected');
  }
  const target = this.getNodeParameter('target') as string;
  const apiKey = credentials.apiKey as string;
  const response = await axios.get(`https://api.wali.chat/v1/devices/${device}/groups?size=500&kind=${target === 'channel' ? 'channel' : 'group'}&token=${apiKey}`);
  return response.data.filter((group: { isReadOnly: boolean }) => {
    return group.isReadOnly !== true;
  }).map((group: { wid: string, name: string }) => ({
    name: `${group.name} (${group.wid})`,
    value: group.wid,
  }));
}

export async function getFiles(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  // Retrieve the credentials object declared on the node
  const credentials = await this.getCredentials('WaliChatApiKey');
  if (!credentials || !credentials.apiKey) {
    throw new Error('No WaliChat API Key credentials found!');
  }

  const apiKey = credentials.apiKey as string;
  const search = this.getNodeParameter('file', 0) as string;
  let url = `https://api.wali.chat/v1/files?size=100&token=${apiKey}`;
  if (search) {
    url += `&search=${search}`;
  }
  const response = await axios.get(url);
  return response.data.map((file: { id: string, filename: string }) => ({
    name: file.filename,
    value: file.id,
  }));
}

