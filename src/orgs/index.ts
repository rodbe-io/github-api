import { getReposByOrg } from '@/repos';
import type { OrgRepository } from '@/repos/getReposByOrg.types.';

export interface GetAllReposByOrgsProps<T, Org> {
  mapper?: (repo: OrgRepository) => T;
  orgs: Array<Org>;
  token: string;
}

export const getReposByOrgs = async <T = OrgRepository, const Org extends string = string>({
  mapper,
  orgs,
  token,
}: GetAllReposByOrgsProps<T, Org>) => {
  const response = {} as Record<Org, Array<T>>;

  for (const org of orgs) {
    const res = await getReposByOrg({ mapper, org, token });

    response[org] = res;
  }

  return response;
};
