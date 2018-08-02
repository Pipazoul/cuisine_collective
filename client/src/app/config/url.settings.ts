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

  // Contributor
  public static readonly contributorModel = 'contributors';

  // Event
  public static readonly eventModel = 'events';
  public static readonly eventContributors = 'contributors';
  public static readonly eventContributorsAssistants = 'contributorsAssistants';
  public static readonly eventContributorsFood = 'contributorsFood';
  public static readonly eventContributorsLocation = 'contributorsLocation';
  public static readonly eventContributorsPeople = 'contributorsPeople';
  public static readonly eventContributorsSkills = 'contributorsSkills';

  // User
  public static readonly userModel = 'Users';
  public static readonly userAccessTokens = 'accessTokens';
  public static readonly userLogin = 'login';
  public static readonly userLogout = 'logout';
}
