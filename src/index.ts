import { type GetAllReposByOrgProps, getAllReposByOrg, getAllReposByOrgs, getOrgs } from './orgs';

interface GitHubApiProps {
  token: string;
}

export const gitHubApi = ({ token }: GitHubApiProps) => {
  return {
    getAllReposByOrg: async <T>(orgProps: GetAllReposByOrgProps<T>) => getAllReposByOrg(token)(orgProps),
    getAllReposByOrgs,
    getOrgs,
    // getAllReposByOrgs,
  };
};

export * from './orgs';
