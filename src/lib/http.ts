/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @interface RequestConfig
 * Configuration for an individual request.
 */
interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>; // For query parameters
  // We can add more options here like timeout, signal for AbortController, etc.
}

/**
 * @class HTTPError
 * Custom error class for HTTP-related errors.
 */
export class HTTPError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly data?: any // The response body, if any
  ) {
    super(`HTTP Error: ${status} ${statusText}`);
    this.name = "HTTPError";
    // This is to ensure that 'instanceof HTTPError' works correctly
    Object.setPrototypeOf(this, HTTPError.prototype);
  }
}

/**
 * @class FetchClient
 * A simple HTTP client using fetch, inspired by Axios.
 */
export class Http {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  /**
   * Creates an instance of FetchClient.
   * @param {string} baseUrl - The base URL for all requests.
   * @param {Record<string, string>} [defaultHeaders={}] - Default headers to be sent with every request.
   */
  constructor(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
    // Ensure baseUrl doesn't end with a slash to avoid double slashes
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json", // Default content type
      ...defaultHeaders,
    };
  }

  /**
   * Private method to handle the actual fetch request.
   * @template T - The expected response data type.
   * @param {string} method - HTTP method (GET, POST, PUT, etc.).
   * @param {string} endpoint - The API endpoint (e.g., "/users").
   * @param {any} [data] - Data to be sent in the request body (for POST, PUT, PATCH).
   * @param {RequestConfig} [config] - Request-specific configuration.
   * @returns {Promise<T>} - A promise that resolves with the response data.
   * @throws {HTTPError} - Throws an HTTPError if the request fails (non-2xx status).
   */
  private async _request<T = any>(
    method: string,
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    // Ensure endpoint starts with a slash if not already present
    const urlEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    let fullUrl = `${this.baseUrl}${urlEndpoint}`;

    const headers: HeadersInit = {
      ...this.defaultHeaders,
      ...(config?.headers || {}),
    };

    // Handle query parameters
    if (config?.params) {
      const queryParams = new URLSearchParams();
      for (const key in config.params) {
        if (Object.prototype.hasOwnProperty.call(config.params, key)) {
          queryParams.append(key, String(config.params[key]));
        }
      }
      if (queryParams.toString()) {
        fullUrl += `?${queryParams.toString()}`;
      }
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
      credentials: "include",
    };

    if (data) {
      // If data is FormData, let fetch handle Content-Type
      if (data instanceof FormData) {
        fetchOptions.body = data;
        // Remove Content-Type header so browser can set it with boundary
        if (
          (headers as Record<string, string>)["Content-Type"]?.includes(
            "multipart/form-data"
          ) ||
          (headers as Record<string, string>)["Content-Type"]?.includes(
            "application/json"
          )
        ) {
          delete (headers as Record<string, string>)["Content-Type"];
        }
      } else if (typeof data === "object") {
        fetchOptions.body = JSON.stringify(data);
        // Ensure Content-Type is application/json if not already specified and not FormData
        if (!(headers as Record<string, string>)["Content-Type"]) {
          (headers as Record<string, string>)["Content-Type"] =
            "application/json";
        }
      } else {
        fetchOptions.body = data; // For other types like string
      }
    }

    try {
      const response = await fetch(fullUrl, fetchOptions);

      if (!response.ok) {
        let errorData;
        try {
          // Try to parse error response as JSON
          errorData = await response.json();
        } catch (e: unknown) {
          // If not JSON, use text
          errorData = await response
            .text()
            .catch(() => `Could not retrieve error body ${e}`);
        }
        throw new HTTPError(response.status, response.statusText, errorData);
      }

      // Handle cases like 204 No Content
      if (
        response.status === 204 ||
        response.headers.get("content-length") === "0"
      ) {
        return undefined as T; // Or return null, or an empty object, depending on preference
      }

      // Assuming the response is JSON. For other types, this would need to be more flexible.
      // For example, check response.headers.get('Content-Type')
      const responseData = await response.json();
      return responseData as T;
    } catch (error) {
      if (error instanceof HTTPError) {
        throw error; // Re-throw custom HTTP errors
      }
      // For network errors or other fetch-related issues not caught by response.ok
      console.error("Network or unexpected error during fetch:", error);
      throw new Error(`Network request failed: ${(error as Error).message}`);
    }
  }

  /**
   * Performs a GET request.
   * @template T - The expected response data type.
   * @param {string} endpoint - The API endpoint.
   * @param {RequestConfig} [config] - Request-specific configuration.
   * @returns {Promise<T>}
   */
  public get<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this._request<T>("GET", endpoint, undefined, config);
  }

  /**
   * Performs a POST request.
   * @template T - The expected response data type.
   * @param {string} endpoint - The API endpoint.
   * @param {any} data - Data to be sent in the request body.
   * @param {RequestConfig} [config] - Request-specific configuration.
   * @returns {Promise<T>}
   */
  public post<T = any>(
    endpoint: string,
    data: any,
    config?: RequestConfig
  ): Promise<T> {
    return this._request<T>("POST", endpoint, data, config);
  }

  /**
   * Performs a PUT request.
   * @template T - The expected response data type.
   * @param {string} endpoint - The API endpoint.
   * @param {any} data - Data to be sent in the request body.
   * @param {RequestConfig} [config] - Request-specific configuration.
   * @returns {Promise<T>}
   */
  public put<T = any>(
    endpoint: string,
    data: any,
    config?: RequestConfig
  ): Promise<T> {
    return this._request<T>("PUT", endpoint, data, config);
  }

  /**
   * Performs a PATCH request.
   * @template T - The expected response data type.
   * @param {string} endpoint - The API endpoint.
   * @param {any} data - Data to be sent in the request body.
   * @param {RequestConfig} [config] - Request-specific configuration.
   * @returns {Promise<T>}
   */
  public patch<T = any>(
    endpoint: string,
    data: any,
    config?: RequestConfig
  ): Promise<T> {
    return this._request<T>("PATCH", endpoint, data, config);
  }

  /**
   * Performs a DELETE request.
   * @template T - The expected response data type.
   * @param {string} endpoint - The API endpoint.
   * @param {RequestConfig} [config] - Request-specific configuration (sometimes DELETE can have a body or query params).
   * @param {any} [data] - Optional data for the request body, though less common for DELETE.
   * @returns {Promise<T>}
   */
  public delete<T = any>(
    endpoint: string,
    config?: RequestConfig,
    data?: any
  ): Promise<T> {
    return this._request<T>("DELETE", endpoint, data, config);
  }
}

export const http = new Http(`${process.env.NEXT_PUBLIC_BASE_URL}/api`);
