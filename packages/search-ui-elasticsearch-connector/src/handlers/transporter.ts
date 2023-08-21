import { SearchRequest, SearchResponse, Transporter } from "../types";

export class ElasticsearchTransporter implements Transporter {
  constructor(
    private host: string,
    private engineName: string,
    private httpRequest?: (
      host: string,
      engineName: string,
      requestBody: SearchRequest
    ) => Promise<SearchResponse>
  ) {}

  async performRequest(requestBody: SearchRequest): Promise<SearchResponse> {
    if (!fetch)
      throw new Error("Fetch is not supported in this browser / environment");

    if (this.httpRequest) {
      return this.httpRequest(this.host, this.engineName, requestBody);
    } else {
      const response = await fetch(
        `${this.host}/api/engines/${this.engineName}/_search`,
        {
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      const json = await response.json();
      return json;
    }
  }
}
