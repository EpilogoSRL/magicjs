# @epilogo/magicjs

### Installation

```
# yarn
yarn add @epilogo/magicjs

# npm
npm install @epilogo/magicjs
```

### Usage

The package exposes 2 functions.

```typescript
import {
  magicJS, // The magicJS implementation
  useMagicJS, // The equivalent react implementation
} from '@epilogo/magicjs';
```

### React example

https://codesandbox.io/s/epilogo-magicjs-9czdls?file=/src/App.js

The package must be initialized in the following way before using it.

```typescript
import { React } from 'react';

useMagicJS.initialize({
  model: 'gpt-3.5-turbo-0613',

  // Change the API key to your own
  openAIApiKey: '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',

  // Important to bind window before passing it to the module
  fetch: window.fetch.bind(window),

  // Your React instance. Internally useMagicJS needs
  // useState
  // useEffect
  // useMemo
  React: React,
});
```

You can then use the `useMagicJS` as follows

```typescript
const [
  result, // When loading becomes false, result = [2, 9, 10]
  loading, // Initially true, then false
  error, // null unless there's an error
] = useMagicJS(
  'sort this list',
  z.array(z.number()),
  [10, 9, 2],
);
```
