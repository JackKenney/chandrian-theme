# Contributing to Solarized Chandrian

## Prerequisites

```
npm install --location=global vsce
npm install
```

## Debugging

Bump version in `package.json`.

```
npm run test-install
```

and reload window

## Publishing

```
vsce login
```

to log into the `jackkenney` publishing account.

```
npm run publish
```

which uses [vsce](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) to build and submit.

## Resources

- https://code.visualstudio.com/api/references/theme-color
- https://code.visualstudio.com/api/extension-guides/color-theme