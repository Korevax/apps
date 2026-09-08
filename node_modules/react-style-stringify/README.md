# react-style-stringify

[![NPM Version](https://img.shields.io/npm/v/react-style-stringify)](https://www.npmjs.com/package/react-style-stringify)
[![npm bundle size](https://img.shields.io/bundlephobia/min/react-style-stringify/latest)](https://www.npmjs.com/package/react-style-stringify)
[![Module type](https://img.shields.io/badge/module_type-cjs%2Besm-f7df1e)](https://www.npmjs.com/package/react-style-stringify)
[![NPM Type Definitions](https://img.shields.io/npm/types/react-style-stringify?color=3178C6)](https://www.npmjs.com/package/react-style-stringify)
[![NPM Downloads](https://img.shields.io/npm/dm/react-style-stringify)](https://www.npmjs.com/package/react-style-stringify)

[![GitHub Actions - Tests](https://github.com/arkarlov/react-style-stringify/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/arkarlov/react-style-stringify/actions/workflows/tests.yml)

A utility for converting React `CSSProperties` objects or `Record<string, CSSProperties>` into CSS strings.

This utility was originally created to simplify the process of adding inline CSS styles to HTML email templates in a React project. Previously, all styles were written as plain strings, which became unmanageable as the project grew. To make styles more maintainable and consistent, this utility was developed to convert React `CSSProperties` objects into CSS strings, streamlining the process of embedding styles in the final HTML before sending emails.

## Features

- Converts a single `CSSProperties` object to a CSS string.
- Converts a `Record<string, CSSProperties>` map to a CSS string.
- Automatically adds units (`px` by default) for numeric values.
- Optionally injects the `!important` statement for each css declaration.

## Installation

```bash
npm install react-style-stringify
```

or

```bash
yarn add react-style-stringify
```

> [!TIP]
> This package uses the `CSSProperties` type from `@types/react`.
>
> If you're working with TypeScript and don't use React, install [@types/react](https://www.npmjs.com/package/@types/react).

## Usage

### Import utils

```tsx
import {
  stringifyCSSProperties,
  stringifyStyleMap,
} from "react-style-stringify";
```

### Convert a single `CSSProperties` object

```tsx
const cssString = stringifyCSSProperties({
  flex: 1,
  padding: 20,
  backgroundColor: "teal",
});
// Output: "flex:1;padding:20px;background-color:teal;"

const importantCssString = stringifyCSSProperties(
  {
    flex: 1,
    padding: 20,
    backgroundColor: "teal",
  },
  { important: true } // `true` in versions <= 1.1.1
);
// Output: "flex:1!important;padding:20px!important;background-color:teal!important;"

const cssStringWtihDefinedUnit = stringifyCSSProperties(
  {
    padding: 10,
    fontSize: 1.6,
  },
  {
    unit: "em",
  }
);
// Output: "padding:10em;font-size:1.6em;"

const cssStringWtihDefinedUnitMap = stringifyCSSProperties(
  {
    padding: 10,
    fontSize: 1.6,
  },
  {
    unit: { fontSize: "rem" },
  }
);
// Output: "padding:10px;font-size:1.6rem;"
```

> [!WARNING]
> In versions `<= 1.1.1`, only `true` was accepted as the second argument.
> As of `v1.2.0`, the options object `{ important: true }` is recommended.

### Convert a `Record<string, CSSProperties>` object

```tsx
const cssMapString = stringifyStyleMap({
  p: {
    margin: 0,
    color: "teal",
  },
  "#root ul.my-list > li": {
    padding: 10,
  },
});
// Output: "p{margin:0;color:teal;}#root ul.my-list>li{padding:10px;}"
```

> [!NOTE]
> The `options` argument is forwarded internally to `stringifyCSSProperties`, so all options (like `important` or `unit`) work the same way.

### Generic

```ts
import {
  stringifyStyleDeclaration,
  stringifyStyleRule,
} from "react-style-stringify";

type MyStyle = {
  padding: number;
  fontSize: number;
};

stringifyStyleDeclaration<MyStyle>({
  padding: 10,
  fontSize: 16,
})
// Output: "padding:10px;font-size:16px;"

stringifyStyleRule<MyStyle>({
  ".container": {
      padding: 10,
      fontSize: 16,
  },
});
// Output: ".container{"padding:10px;font-size:16px;"}"
```

> [!NOTE]
> The `options` argument works the same way as for `stringifyCSSProperties` and `stringifyStyleMap`.

## API

### Types

```ts
type StyleMap = Record<string, CSSProperties>;

type CSSUnit = "px" | "em" | "rem" | "vw" | "vh" | "%";

type CSSUnitMap<K extends PropertyKey = string> = {
    [P in K]?: CSSUnit;
};

type StringifyOptions<T extends object = Record<string, string | number>> = {
    important?: boolean;
    unit?: CSSUnit | CSSUnitMap<keyof T>;
};

type StyleDeclaration = Record<string, string | number>;

type StyleRule<T extends object = StyleDeclaration> = Record<string, T>;
```

### Functions

```ts
function stringifyCSSProperties(
  cssProperties: CSSProperties,
  optionsOrImportant?: StringifyOptions<CSSProperties> | boolean
): string;

function stringifyStyleMap(
  styleMap: StyleMap,
  optionsOrImportant?: StringifyOptions<CSSProperties> | boolean
): string;
```

### Generic

```ts
function stringifyStyleDeclaration<T extends object = StyleDeclaration>(
  styleDeclaration: T,
  options?: StringifyOptions<T>
): string;

function stringifyStyleRule<T extends object = StyleDeclaration>(
  styleRule: StyleRule<T>,
  options?: StringifyOptions<T>
): string;
```

## Dependencies

- **[@emotion/unitless](https://www.npmjs.com/package/@emotion/unitless)**: Handles checking for CSS properties that are unitless (e.g., `line-height`, `z-index`, etc.).

## Requirements

- **[@types/react](https://www.npmjs.com/package/@types/react)**: The package uses React's `CSSProperties` type for defining style objects.

## Contributing

Contributions are welcome! If you have ideas or improvements, feel free to open an issue or submit a pull request.

### Steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Create a pull request.

Please make sure your code adheres to the project's coding standards and passes the existing tests.
