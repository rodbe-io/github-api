import { to } from '@rodbe/fn-utils';

import type { Repository } from './orgs.types';
import { getHeaders } from '@/utils';

export interface GetAllReposByOrgProps<T> {
  mapper?: (repo: Repository) => T;
  org: string;
  token: string;
}

export const getAllReposByOrg = async <T = Repository>({ mapper, org, token }: GetAllReposByOrgProps<T>) => {
  let allRepos: typeof mapper extends undefined ? Array<Repository> : Array<T> = [];
  let page = 1;
  let hasNextPage = true;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (hasNextPage) {
    const [error, response] = await to<Array<Repository>>(
      fetch(`https://api.github.com/orgs/${org}/repos?page=${String(page)}&per_page=100&type=all`, {
        headers: getHeaders(token),
        method: 'GET',
      })
        .then(async r => {
          const { status, statusText } = r;
          const linkHeader = r.headers.get('link');

          if (linkHeader?.includes('rel="next"')) {
            page++;
          } else {
            hasNextPage = false;
          }

          return r.ok ? r : Promise.reject(new Error(`HTTP Error Response: ${String(status)} ${statusText}`));
        })
        .then(async r => r.json() as Promise<Array<Repository>>)
    );

    if (error) {
      console.error(`Error getting repositories for "${org}": `, error);

      break;
    }

    if (response.length === 0) {
      break;
    }

    if (mapper) {
      allRepos = allRepos.concat(response.map(mapper));
    } else {
      allRepos = allRepos.concat(response as Array<T>);
    }
  }

  return allRepos;
};

export interface GetAllReposByOrgsProps<T, Org> {
  mapper?: (repo: Repository) => T;
  orgs: Array<Org>;
  token: string;
}

export const getAllReposByOrgs = async <T = Repository, const Org extends string = string>({
  mapper,
  orgs,
  token,
}: GetAllReposByOrgsProps<T, Org>) => {
  const response = {} as Record<Org, Array<T>>;

  for (const org of orgs) {
    const res = await getAllReposByOrg({ mapper, org, token });

    response[org] = res;
  }

  return response;
};
