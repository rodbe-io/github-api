# 🐙 @rodbe/github-api

Typed and customizable wrapper for the GitHub REST API. Handles pagination automatically and supports custom mappers to transform responses into the shape your app needs.

## 📦 Installation

```bash
npm install @rodbe/github-api
# or
pnpm add @rodbe/github-api
```

## ✅ Requirements

- Node.js >= 18.18.2
- A [GitHub personal access token](https://github.com/settings/tokens) 🔑

## 📖 API

All functions accept a `token` parameter (GitHub personal access token) and an optional `mapper` function to transform each item in the response.

### `getOrgs({ token, mapper? })` 🏢

Fetches all organizations for the authenticated user. Handles pagination automatically.

```ts
import { getOrgs } from '@rodbe/github-api';

const { organizations, errors } = await getOrgs({ token: 'ghp_...' });

// With a custom mapper
const { organizations } = await getOrgs({
  token: 'ghp_...',
  mapper: org => ({ id: org.id, name: org.login, avatar: org.avatar_url }),
});
```

**Returns:** `{ organizations: T[], errors: Error[] }`

---

### `getReposByUser({ token, mapper? })` 👤

Fetches all repositories for the authenticated user (owned, member, forked, etc.).

```ts
import { getReposByUser } from '@rodbe/github-api';

const repos = await getReposByUser({ token: 'ghp_...' });

// With a custom mapper
const repos = await getReposByUser({
  token: 'ghp_...',
  mapper: repo => ({ name: repo.name, isPrivate: repo.private, stars: repo.stargazers_count }),
});
```

**Returns:** `T[]`

---

### `getReposByOrg({ token, org, mapper? })` 🏗️

Fetches all repositories for a specific organization.

```ts
import { getReposByOrg } from '@rodbe/github-api';

const repos = await getReposByOrg({ token: 'ghp_...', org: 'my-org' });

// With a custom mapper
const repos = await getReposByOrg({
  token: 'ghp_...',
  org: 'my-org',
  mapper: repo => ({ name: repo.name, url: repo.html_url }),
});
```

**Returns:** `T[]`

---

### `getReposByOrgs({ token, orgs, mapper? })` 🏗️🏗️

Fetches repositories for multiple organizations in a single call. Returns a record keyed by org name.

```ts
import { getReposByOrgs } from '@rodbe/github-api';

const result = await getReposByOrgs({
  token: 'ghp_...',
  orgs: ['org-a', 'org-b'],
});

result['org-a']; // OrgRepository[]
result['org-b']; // OrgRepository[]

// With a custom mapper
const result = await getReposByOrgs({
  token: 'ghp_...',
  orgs: ['org-a', 'org-b'] as const,
  mapper: repo => repo.name,
});
```

**Returns:** `Record<Org, T[]>`

---

### `getStarredRepos({ token, mapper? })` ⭐

Fetches all repositories starred by the authenticated user.

```ts
import { getStarredRepos } from '@rodbe/github-api';

const starred = await getStarredRepos({ token: 'ghp_...' });

// With a custom mapper
const starred = await getStarredRepos({
  token: 'ghp_...',
  mapper: repo => ({ name: repo.name, language: repo.language }),
});
```

**Returns:** `T[]`

---

## 🔄 Custom mappers

Every function accepts an optional `mapper` callback that receives the raw GitHub API object and returns a value of any shape. The return type of the function is inferred automatically from the mapper's return type.

```ts
// Without mapper → returns UserRepository[]
const repos = await getReposByUser({ token });

// With mapper → returns { name: string; stars: number }[]
const repos = await getReposByUser({
  token,
  mapper: repo => ({ name: repo.name, stars: repo.stargazers_count }),
});
```

## 🧩 Types

The following types are exported and can be used in your own code:

| Type             | Description                           |
| ---------------- | ------------------------------------- |
| `Organization`   | GitHub organization object            |
| `UserRepository` | Repository returned by user endpoints |
| `OrgRepository`  | Repository returned by org endpoints  |
| `Owner`          | Repository owner object               |
| `Permissions`    | Repository permissions object         |
| `License`        | Repository license object             |

## 📄 License

MIT
