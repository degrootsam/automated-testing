export type GitHttpError = {
  name: "HttpError";
  status: number;
  request: {
    method: string;
    url: string;
    headers: Record<string, string>;
    request?: Record<string, unknown>;
  };
  response: {
    url: string;
    status: number;
    headers: Record<string, string>;
    data: {
      message: string;
      errors?: string[];
      documentation_url?: string;
      status?: string;
      [key: string]: unknown;
    };
  };
};
