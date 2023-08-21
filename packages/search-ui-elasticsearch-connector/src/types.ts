import type { estypes } from "@elastic/elasticsearch";
import { QueryConfig, RequestState } from "@elastic/search-ui";
export type { QueryConfig, RequestState } from "@elastic/search-ui";

export type SearchRequest = estypes.SearchRequest;
export type SearchResponse = estypes.SearchResponse<Record<string, unknown>>;
export type PostProcessRequestBodyFn = (
  requestBody: SearchRequest,
  requestState: RequestState,
  queryConfig: QueryConfig
) => SearchRequest;

export interface CloudHost {
  id: string;
}

export interface Transporter {
  performRequest(requestBody: SearchRequest): Promise<SearchResponse>;
}
