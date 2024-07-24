export class KV {
  private apiKey: string;
  private authEmail: string;
  private apiUrl = "https://api.cloudflare.com/client/v4";
  private accountId: string;
  constructor(apiKey: string, authEmail: string, accountId: string) {
    this.apiKey = apiKey;
    this.accountId = accountId;
    this.authEmail = authEmail;
  }

  async write(namespace: string, key: string, value: any) {
    const res = await fetch(
      `${this.apiUrl}/accounts/${this.accountId}/storage/kv/namespaces/${namespace}/values/${key}`,
      {
        method: "PUT",
        headers: {
          "X-Auth-Email": `${this.authEmail}`,
          "X-Auth-Key": `${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value }),
      }
    );

    return await res.json();
  }

  async read(namespace: string, key: string) {
    const res = await fetch(
      `${this.apiUrl}/accounts/${this.accountId}/storage/kv/namespaces/${namespace}/values/${key}`,
      {
        headers: {
          "X-Auth-Email": `${this.authEmail}`,
          "X-Auth-Key": `${this.apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return await res.json();
  }

  async getAllKeys(namespace: string) {
    const res = await fetch(
      `${this.apiUrl}/accounts/${this.accountId}/storage/kv/namespaces/${namespace}/keys`,
      {
        headers: {
          "X-Auth-Email": `${this.authEmail}`,
          "X-Auth-Key": `${this.apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return (await res.json()) as {
      result: {
        expiration: number;
        metadata: {
          someMetadataKey: string;
        };
        name: string;
      }[];
    };
  }

  /**
   * This can handle bulk delete, you should pass an array.
   * @param namespace
   * @param keys
   * @returns
   */
  async delete(namespace: string, keys: string[]) {
    const res = await fetch(
      `${this.apiUrl}/accounts/${this.accountId}/storage/kv/namespaces/${namespace}/bulk`,
      {
        method: "DELETE",
        headers: {
          "X-Auth-Email": `${this.authEmail}`,
          "X-Auth-Key": `${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(keys),
      }
    );

    return await res.json();
  }
}
