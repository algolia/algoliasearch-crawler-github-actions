import type ResponseType from 'node-fetch';

export interface AlgoliaResponseJson {
  body: string;
  bodyUsed: boolean;
  size: number;
  timeout: number;
  headers: Headers;
  ok: boolean;
  redirected: boolean;
  status: number;
  statusText: string;
  type: ResponseType;
  url: string;
  id?: string;
}
