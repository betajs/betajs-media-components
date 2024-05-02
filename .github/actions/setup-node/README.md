### A detailed description of what the action does:
This action will set up Node JS with package manager. After install all dependencies 
and cache them

### Required to be input and output arguments:
- version: NodeJS version like: '18.x'
- 
### Optional input and output arguments:
- pkg-manager: one of package managers `npm`, `yarn` or `pnpm`, default is `npm`
- key: any unique key, default will be: `${{ github.event.pull_request.head.sha }}`

### Secrets the action uses:

### Environment variables the action uses:

### An example of how to use your action in a workflow:
```yaml
  - name: setup node
    uses: betajs/betajs-media-components/.github/actions/setup-node@main
    with:
      version: '18.x'
      key: '${{ github.head_ref }}.${{ github.sha }}'
      pkg-manager: 'npm'

```
