export interface GithubComment {
  id: number;
  body?: string;
  user: {
    login: string;
  } | null;
}
