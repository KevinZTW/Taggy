// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

interface IRequestParams {
  url: string;
  body?: object;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  queryParams?: Record<string, any>;
  headers?: Record<string, string>;
}

const request = async <T>({
  url = '',
  method = 'GET',
  body,
  queryParams = {},
  headers = {
    'content-type': 'application/json',
  },
}: IRequestParams): Promise<T> => {
  const response = await fetch(`${url}?${new URLSearchParams(queryParams).toString()}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers,
  });

  const responseText = await response.text();
  const payload = JSON.parse(responseText);
  if (!response.ok) throw new Error(response.statusText + " " + payload.error.details);
  
  if (!!responseText) return payload;

  return undefined as unknown as T;
};

export default request;
