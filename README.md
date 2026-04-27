# Signing Editor Platform

A React + TypeScript web editor for placing signature, seal, date and text-field widgets on PDF documents. Widgets are draggable, resizable, and persisted in a Redux store ready to be submitted to a signing backend.

## Features

- Render multi-page PDFs with [`react-pdf`](https://github.com/wojtekmaj/react-pdf) and zoom in/out
- Drag-and-drop widgets from a sidebar onto any page (`react-dnd`) or right-click for a context menu
- Move and resize placed widgets within page bounds (`react-draggable`, `re-resizable`)
- Per-signer widget assignment with avatar list, validation and delete actions
- Redux Toolkit store with undo/redo (`redux-undo`)
- Internationalization (`i18next`) with on-demand JSON loading
- Ant Design components and `styled-components` theming

## Tech stack

React 18 - TypeScript - Redux Toolkit - Ant Design - styled-components - react-pdf - react-dnd - react-draggable - re-resizable - i18next - CRA + CRACO

## Getting started

### Prerequisites

- Node.js 16+ and npm 8+

### Install

```bash
npm install --legacy-peer-deps
```

> The `--legacy-peer-deps` flag is required because of strict peer ranges between `react-pdf` 5.x and React 18.

### Run in development

```bash
npm start
```

The app runs on [http://localhost:3000](http://localhost:3000).

### Build

| Script | Output |
| --- | --- |
| `npm run build` | Standalone web app (uses `env/.envCommon`) |
| `npm run build:library` | Library bundle for embedding (uses `env/.envLibrary`) |
| `npm run build:debug` | Standalone build with `REACT_APP_DEBUG_MODE=true` |
| `npm run compile` | Generates ESM + CJS type-safe library output to `dist/` |

Build artifacts are emitted to `build/` (`static/js/editor.js`, `static/css/editor.css`).

## Configuration

Sign-server requests are proxied in development through `src/setupProxy.js`. Override the upstream by exporting an env var before `npm start`:

```bash
# PowerShell
$env:REACT_APP_SIGN_SERVER_URL = "http://localhost:5005"
npm start
```

Without it, the proxy defaults to `http://localhost:5005`.

## Project structure

```
src/
  commons/          Reusable, prop-driven primitives (e.g. DraggableWrapper)
  components/       Composed UI built on top of commons (e.g. sidebar widgets)
  layouts/          Multi-component sections (e.g. doc workboard)
  pages/            Top-level routes assembled from layouts
  models/           TypeScript types and view-models
  styles/           Theme constants and shared style tokens
  utils/            Pure helpers (formatters, geometry, etc.)
  pages/manual-sign-page/reducer/   Redux slices, selectors, and root reducer
  i18n.tsx          i18next setup
  setupProxy.js     CRA dev proxy
```

### Naming conventions

- Files ending in `*-wrapper.tsx` accept `children` and forward configuration props.
- Redux slices live under `pages/<page>/reducer/slices/` with matching selectors next to them.
- Styled components are colocated with the component that uses them.

## Scripts

| Script | Description |
| --- | --- |
| `npm start` | Run the dev server |
| `npm run start:debug` | Dev server with `REACT_APP_DEBUG_MODE=true` |
| `npm test` | Run tests in watch mode |
| `npm run build` | Production build of the standalone app |
| `npm run build:library` | Production build for embedding |
| `npm run compile` | Build distributable ESM + CJS library |
| `npm run clean:all` | Remove `dist/`, `build/`, and `node_modules/` |

## License

[MIT](./LICENSE)
