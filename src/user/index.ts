import { to } from '@rodbe/fn-utils';

import type { Organization } from './user.types';
import { getHeaders } from '@/utils';

export interface GetOrgsProps<T> {
  mapper?: (org: Organization) => T;
  token: string;
}

export const getOrgs = async <T = Organization>({ mapper, token }: GetOrgsProps<T>) => {
  let organizations: typeof mapper extends undefined ? Array<Organization> : Array<T> = [];
  let page = 1;
  let hasNextPage = true;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (hasNextPage) {
    const [error, response] = await to<Array<Organization>>(
      // NOTE: https://docs.github.com/en/rest/orgs/orgs?apiVersion=2022-11-28#list-organizations-for-the-authenticated-user
      fetch(`https://api.github.com/user/orgs?page=${String(page)}&per_page=100`, {
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
        .then(async r => r.json() as Promise<Array<Organization>>)
    );

    if (error) {
      console.error('Error getting organizations:', error);

      break;
    }

    if (response.length === 0) {
      break;
    }

    if (mapper) {
      organizations = organizations.concat(response.map(mapper));
    } else {
      organizations = organizations.concat(response as Array<T>);
    }
  }

  return organizations;
};
