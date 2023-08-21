import type {
  QueryConfig,
  RequestState,
  ResponseState,
  AutocompleteResponseState,
  APIConnector,
  AutocompleteQueryConfig
} from "@elastic/search-ui";

import handleSearchRequest from "./handlers/search";
import handleAutocompleteRequest from "./handlers/autocomplete";
import { CloudHost, PostProcessRequestBodyFn, Transporter } from "./types";

type ConnectionOptions = {
  host?: string;
  cloud?: CloudHost;
  index: string;
  apiKey?: string;
  connectionOptions?: {
    headers?: Record<string, string>;
  };
};

function isTransporter(
  config: ConnectionOptions | Transporter
): config is Transporter {
  return (config as Transporter).performRequest !== undefined;
}

export * from "./types";

export { ElasticsearchTransporter } from "./handlers/transporter";

export { SearchResponse as Response } from "./handlers/search/Response";
export { SearchRequest as Request } from "./handlers/search/Request";

class ElasticsearchAPIConnector implements APIConnector {
  private transporter: Transporter;

  constructor(
    private config: ConnectionOptions | Transporter,
    private postProcessRequestBodyFn?: PostProcessRequestBodyFn
  ) {
    if (isTransporter(config)) {
      this.transporter = config;
    } else {
      if (!config.host && !config.cloud) {
        throw new Error("Either host or cloud configuration must be provided");
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onResultClick(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onAutocompleteResultClick(): void {}

  async onSearch(
    state: RequestState,
    queryConfig: QueryConfig
  ): Promise<ResponseState> {
    this.config = this.config as ConnectionOptions;
    return handleSearchRequest({
      state,
      queryConfig,
      cloud: this.config.cloud,
      host: this.config.host,
      index: this.config.index,
      connectionOptions: {
        apiKey: this.config.apiKey,
        headers: this.config.connectionOptions?.headers
      },
      postProcessRequestBodyFn: this.postProcessRequestBodyFn,
      transporter: this.transporter
    });
  }

  async onAutocomplete(
    state: RequestState,
    queryConfig: AutocompleteQueryConfig
  ): Promise<AutocompleteResponseState> {
    this.config = this.config as ConnectionOptions;
    return handleAutocompleteRequest({
      state,
      queryConfig,
      cloud: this.config.cloud,
      host: this.config.host,
      index: this.config.index,
      connectionOptions: {
        apiKey: this.config.apiKey,
        headers: this.config.connectionOptions?.headers
      }
    });
  }
}

export default ElasticsearchAPIConnector;
