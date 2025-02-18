import { to } from '@rodbe/fn-utils';

import { getHeaders } from '@/utils';
import type { UserRepository } from './getReposByUser.types';
import type { OrgRepository } from './getReposByOrg.types';

export interface GetReposByUserProps<T> {
  mapper?: (repo: UserRepository) => T;
  token: string;
}

export const getReposByUser = async <T = UserRepository>({ mapper, token }: GetReposByUserProps<T>) => {
  let allRepos: typeof mapper extends undefined ? Array<UserRepository> : Array<T> = [];
  let page = 1;
  let hasNextPage = true;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (hasNextPage) {
    const [error, response] = await to<Array<UserRepository>>(
      fetch(`https://api.github.com/user/repos?page=${String(page)}&per_page=100&type=all`, {
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
        .then(async r => r.json() as Promise<Array<UserRepository>>)
    );

    if (error) {
      console.error(`Error getting repositories: `, error);

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

export interface GetReposByOrgProps<T> {
  mapper?: (repo: OrgRepository) => T;
  org: string;
  token: string;
}
export const getReposByOrg = async <T = OrgRepository>({ mapper, org, token }: GetReposByOrgProps<T>) => {
  let allRepos: typeof mapper extends undefined ? Array<OrgRepository> : Array<T> = [];
  let page = 1;
  let hasNextPage = true;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (hasNextPage) {
    const [error, response] = await to<Array<OrgRepository>>(
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
        .then(async r => r.json() as Promise<Array<OrgRepository>>)
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

export interface GetStarredReposProps<T> {
  mapper?: (repo: UserRepository) => T;
  token: string;
}
export const getStarredRepos = async <T = UserRepository>({ mapper, token }: GetStarredReposProps<T>) => {
  let allRepos: typeof mapper extends undefined ? Array<UserRepository> : Array<T> = [];
  let page = 1;
  let hasNextPage = true;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (hasNextPage) {
    const [error, response] = await to<Array<UserRepository>>(
      fetch(`https://api.github.com/user/starred?page=${String(page)}&per_page=100&type=all`, {
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
        .then(async r => r.json() as Promise<Array<UserRepository>>)
    );

    if (error) {
      console.error(`Error getting starred repositories: `, error);

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
