# World Models Content Guide

This directory stores version 1 editorial data for the world-models site.

## Rules

- One JSON file per record.
- File name must match `slug`.
- Dates use `YYYY-MM-DD`.
- Chinese and English fields are both required.
- Keep summaries short and editorial.
- Only use taxonomy values defined in the app schema.
- Use `featured: true` sparingly for homepage sections.

## Collections

- `topics/`
- `papers/`
- `projects/`
- `updates/`
- `timeline/`

## Review Checklist

- Slug is unique.
- Both languages are present.
- Links resolve.
- Related slugs point to existing records.
- Topic, capability, and scenario tags are valid.
