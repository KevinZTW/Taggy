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
  }).catch((err) => {
    throw new Error(err);
  });

  const responseText = await response.text();
  if (!response.ok) throw new Error(response.statusText + " " + responseText);
  

  try {
    const payload = JSON.parse(responseText);
    if (!!responseText) return payload;
  } catch (err) {
    return responseText as T;
  }

  return undefined as unknown as T;
};

export default request;
