# Debug Mode Guide

## 🚀 Quick Start

### Build WITH Console Logs (Debug Mode)
```bash
npm run build:debug
```
**Result:** ALL `console.log` statements work normally

### Build WITHOUT Console Logs (Production Mode)
```bash
npm run build
```
**Result:** ALL `console.log` statements are suppressed

## 🎯 How It Works

The system automatically overrides `console.log` globally:

- **`npm run build:debug`** → Sets `REACT_APP_DEBUG_MODE=true` → `console.log` works
- **`npm run build`** → `REACT_APP_DEBUG_MODE` is undefined → `console.log` is disabled

**Important:**
- ✅ `console.error` and `console.warn` always work
- ✅ No code changes needed - use `console.log` as normal
- ✅ Works for ALL console.log statements in the entire app
- ✅ **Exceptions:** Logs containing `window.__INITIAL_STATE__` or `onClickReactLibraryApply` always show (even in production)

## 📊 Debug Logs for Signset Positioning

When debug mode is enabled, you'll see detailed logs for drag & drop operations:

### Sidebar Drag & Drop
- `🌐 [GLOBAL DRAG TRACKER]` - Position tracking from sidebar to page
- `🔄 [SIDEBAR DRAG HOVER]` - Real-time position when hovering over page
- `🎯 [SIDEBAR DRAG DROP]` - Final position calculation on drop

### Within-Page Dragging
- `🔄 [WITHIN-PAGE DRAG]` - Widget being dragged on page
- `🛑 [WITHIN-PAGE DRAG STOP]` - Drag ended, position saved

### Click-to-Place
- `👆 [SIDEBAR CLICK]` - Widget clicked in sidebar
- `🎯 [CLICK TO PLACE - MOUSE]` - Mouse click placement
- `🎯 [CLICK TO PLACE - TOUCH]` - Touch placement

### Context Menu
- `🎯 [CONTEXT MENU - SIGNATURE]` - Right-click signature placement
- `🎯 [CONTEXT MENU - SEAL]` - Right-click seal placement
- `🎯 [CONTEXT MENU - SIGN DATE]` - Right-click sign date placement
- `🎯 [CONTEXT MENU - TEXT FIELD]` - Right-click text field placement

## 🔧 Technical Details

**Files Modified:**
- `src/utils/debug-logger.ts` - Debug utility that overrides console.log
- `src/index.tsx` - Imports debug-logger to initialize override
- `src/commons/drag-position-tracker.tsx` - Global drag tracking component
- `src/layouts/doc-workboard/doc-workboard-panel.tsx` - Sidebar & click-to-place logs
- `src/commons/draggable-wrapper.tsx` - Within-page drag logs
- `src/commons/widget-wrapper.tsx` - Sidebar widget logs
- `package.json` - Added `build:debug` and `start:debug` scripts

**How to Remove Debug System:**
1. Delete `src/utils/debug-logger.ts`
2. Delete `src/commons/drag-position-tracker.tsx`
3. Remove import from `src/index.tsx`
4. Remove `<DragPositionTracker />` from `src/pages/manual-sign-page/index.tsx`
5. Replace all `debugLog()` calls back to `console.log()`
6. Remove `:debug` scripts from `package.json`

---

That's it! Just use `npm run build:debug` or `npm run build` to toggle console logs on/off.
