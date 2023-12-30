import { BaseUserResponseAPI } from '../../../user/http/response/base-user-response-api.model';

export type BaseImageResponseAPI = {
  created_at?: string;
  updated_at?: string;
  public_id?: string;
  published_at?: string;
  file_url?: string;
  title?: string;
  description?: string;
  visibility?: string;
  author?: BaseUserResponseAPI;
};
