import axios, { AxiosRequestConfig } from 'axios';
import { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { rawRequest } from '../request';

async function query (url: string, apiKey: string): Promise<any[]> {
  const opts: AxiosRequestConfig = {
    url,
    method: 'GET'
  }
  const { data } = await rawRequest(opts, apiKey)
  return data
}

export async function getDevices(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  // Retrieve the credentials object declared on the node
  const credentials = await this.getCredentials('walichatApiKey');
  if (!credentials || !credentials.walichatApiKey) {
    throw new Error('No WaliChat API Key credentials found!');
  }
  const apiKey = credentials.walichatApiKey as string;
  const data = await query(`/devices?size=100`, apiKey);
  return data.map((device: { id: string, alias: string, phone: string }) => ({
    name: `${device.alias} (${device.phone})`,
    value: device.id,
  }));
}

export async function getGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  // Retrieve the credentials object declared on the node
  const credentials = await this.getCredentials('walichatApiKey');
  if (!credentials || !credentials.walichatApiKey) {
    throw new Error('No WaliChat API Key credentials found!');
  }
  const device = this.getNodeParameter('device', 0) as string;
  if (!device) {
    throw new Error('Please select WhatsApp device selected');
  }
  const target = this.getNodeParameter('target') as string;
  const apiKey = credentials.walichatApiKey as string;
  const kind = target === 'channel' ? 'channel' : 'group';
  const data = await query(`/devices/${device}/groups?size=500&kind=${kind}`, apiKey);
  return data.filter((group: { isReadOnly: boolean }) => {
    return group.isReadOnly !== true;
  }).map((group: { wid: string, name: string }) => ({
    name: `${group.name} (${group.wid})`,
    value: group.wid,
  }));
}

export async function getFiles(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  // Retrieve the credentials object declared on the node
  const credentials = await this.getCredentials('walichatApiKey');
  if (!credentials || !credentials.walichatApiKey) {
    throw new Error('No WaliChat API Key credentials found!');
  }

  const apiKey = credentials.walichatApiKey as string;
  const search = this.getNodeParameter('file', 0) as string;
  let url = `/files?size=100`;
  if (search) {
    url += `&search=${search}`;
  }
  const data = await query(url, apiKey);
  return data.map((file: { id: string, filename: string }) => ({
    name: file.filename,
    value: file.id,
  }));
}

export async function getTeamAgents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  // Retrieve the credentials object declared on the node
  const credentials = await this.getCredentials('walichatApiKey');
  if (!credentials || !credentials.walichatApiKey) {
    throw new Error('No WaliChat API Key credentials found!');
  }
  const device = this.getNodeParameter('device', 0) as string;
  if (!device) {
    throw new Error('Please select WhatsApp device selected');
  }
  const apiKey = credentials.walichatApiKey as string;
  const data = await query(`/devices/${device}/team?size=100`, apiKey);
  return data.map((agent: { id: string, displayName: string, email: string }) => ({
    name: agent.displayName + ' - ' + agent.email,
    value: agent.id,
  }));
}

export async function getDepartments(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  const credentials = await this.getCredentials('walichatApiKey');
  if (!credentials || !credentials.walichatApiKey) {
    throw new Error('No WaliChat API Key credentials found!');
  }
  const device = this.getNodeParameter('device', 0) as string;
  if (!device) {
    throw new Error('Please select WhatsApp device selected');
  }
  const apiKey = credentials.walichatApiKey as string;
  const data = await query(`/devices/${device}/departments`, apiKey);
  return data.map((department: { id: string, name: string }) => ({
    name: department.name,
    value: department.id
  }));
}

export async function getLabels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  // Implement the call
  // Retrieve the credentials object declared on the node
  const credentials = await this.getCredentials('walichatApiKey');
  if (!credentials || !credentials.walichatApiKey) {
    throw new Error('No WaliChat API Key credentials found!');
  }
  const device = this.getNodeParameter('device', 0) as string;
  if (!device) {
    throw new Error('Please select WhatsApp device selected');
  }
  const apiKey = credentials.walichatApiKey as string;
  const data = await query(`/devices/${device}/labels?size=100`, apiKey);
  return data.filter((label: { scope: string }) => label.scope === 'chat').map((label: { id: string, name: string, scope: string }) => ({
    name: label.name,
    value: label.name
  }));
}
