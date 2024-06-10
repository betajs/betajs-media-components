### A detailed description of what the action does:
This action will set up Node.js with package manager. After install all dependencies 
and cache them

### Required input arguments:
- version: NodeJS version like: '18.x'

### Optional input arguments:
- pkg-manager: one of package managers `npm`, `yarn` or `pnpm`, default is `npm`
- use-cache: boolean value, default is `true`, to use cache or not
- cache-key: any unique key for store and restore cache

### Output arguments:
- package-cache-dir: the directory where the package cache is stored.
- cache-hit: a boolean value indicating whether the cache was restored.
- cache-key: the key used to store and restore the cache.

### Secrets the action uses:

### Environment variables the action uses:

### An example of how to use your action in a workflow:
```yaml
  - name: setup node
    uses: betajs/betajs-media-components/.github/actions/setup-node@main
    with:
      version: '18.x'
      cache-key: '${{ github.head_ref }}.${{ github.sha }}'
      pkg-manager: 'npm'
      use-cache: 'true'
```
