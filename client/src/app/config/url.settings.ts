import { environment } from '../../environments/environment';

export class UrlSettings {
  /* Common values */

  // Base Url
  public static readonly API_ENDPOINT = environment.baseUrl + '/api/';

  // Suffixes
  public static readonly suffixRelation = 'rel';
  public static readonly count = 'count';
  public static readonly latest = 'latest';

  /* Models endpoint */

  // User
  public static readonly userModel = 'users';
  public static readonly userAccessTokens = 'accessTokens';
  public static readonly userLogin = 'login';
  public static readonly userLogout = 'logout';
}
