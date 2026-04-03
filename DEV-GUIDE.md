# Dev Guide

## File size limit used by file browser

The file open size limit is configured in [src/toolbarActions/toolbarFunctions.js](src/toolbarActions/toolbarFunctions.js).

- `MAX_FILE_SIZE_MB` controls the limit in MB.
- `MAX_FILE_SIZE` is derived from it as bytes.

To change the limit, update `MAX_FILE_SIZE_MB` only.

## Workspace persistence (hybrid storage)

Workspace persistence now uses a hybrid model:

- Files/binary artifacts (imports/exports) stay on the browser filesystem path.
- Graph/session metadata is stored in IndexedDB (`concore-editor-storage`) when available.
- Local storage is used as a fallback if IndexedDB is unavailable.

### IndexedDB schema (v1)

- `graphs` store (key: `id`): graph snapshot payloads used by autosave/recovery.
- `meta` store (key: `key`):
	- `graph_order`
	- `session`
	- `author_name`
	- `migrated_local_storage_v1`

### Migration behavior

On first successful IndexedDB init, legacy localStorage data is migrated once:

- all graph snapshots from `ALL_GRAPHS`
- session metadata from `SESSION_STATE` (if present)
- author metadata from `AUTHOR_NAME`

### Fallback behavior

If IndexedDB cannot be initialized, the app stays functional with localStorage fallback.
The same public storage manager API is used in both cases.

### Manual verification checklist

1. Open multiple graphs, switch active tab, reload page.
2. Confirm open tabs and active tab are restored.
3. Edit graphs and verify autosave keeps action history.
4. Corrupt one graph record manually and confirm app still loads remaining workspace.
5. Simulate IndexedDB unavailability and verify fallback load/save still works.
