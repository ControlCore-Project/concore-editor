# Dev Guide

## File size limit used by file browser

The file open size limit is configured in [src/toolbarActions/toolbarFunctions.js](src/toolbarActions/toolbarFunctions.js).

- `MAX_FILE_SIZE_MB` controls the limit in MB.
- `MAX_FILE_SIZE` is derived from it as bytes.

To change the limit, update `MAX_FILE_SIZE_MB` only.
