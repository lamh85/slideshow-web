The following report was created by Copilot.

WARNING - It may not be fully accurate.

# Data Dependency Outline

## Level 0 — Independent Data (no dependencies on other app data)

These are the root sources of truth, created from scratch:

| Data | Source | Description |
|------|--------|-------------|
| `images` | [UploadPage/index.tsx](../src/UploadPage/index.tsx) → `usePlaylist.setImages` | User-selected files from disk; each has `blob`, `name`, `timeStamp`, `fileData` |
| `showingGallery` | [useGallery.ts](../src/hooks/useGallery.ts) | Independent boolean toggle (default `false`) |
| `objectFit` | [useMainImage.ts](../src/SlideshowPage/SlideshowContext/useMainImage.ts) | Independent `'cover'`/`'contain'` toggle |
| `dateSorting` | [usePlaylist.ts](../src/hooks/usePlaylist.ts) | Independent `'asc'`/`'desc'`/`'random'` state |
| `isLoadingImages` | [usePlaylist.ts](../src/hooks/usePlaylist.ts) | Independent boolean (default `true`) |

---

## Level 1 — 1 degree removed (depends directly on Level 0 data)

| Data | Source | Depends On |
|------|--------|------------|
| `playlist` | [usePlaylist.ts](../src/hooks/usePlaylist.ts) | `images` + `dateSorting` — sorts image indices by timestamp or randomizes them |
| `galleryImages` | [usePlaylist.ts](../src/hooks/usePlaylist.ts) | `images` + `playlist` — `playlist.map(idx => images[idx])` |
| `playlistCursor` | [usePlaylist.ts](../src/hooks/usePlaylist.ts) | `images` (reset to 0 when images load); modified by navigation |

---

## Level 2 — 2 degrees removed (depends on Level 1 data)

| Data | Source | Depends On |
|------|--------|------------|
| `mainImage` | [useMainImage.ts](../src/SlideshowPage/SlideshowContext/useMainImage.ts) | `images` + `playlist` + `playlistCursor` — resolves to `images[playlist[playlistCursor]]` |
| `date` | [useMainImage.ts](../src/SlideshowPage/SlideshowContext/useMainImage.ts) | `mainImage.name` — parsed via `fileNameToMoment()` into formatted string |
| `thumbnails` | [usePlaylist.ts](../src/hooks/usePlaylist.ts) | `playlist` + `playlistCursor` + `images` — window of 5 images around cursor |
| `fileData` (current) | [SlideshowContext/index.tsx](../src/SlideshowPage/SlideshowContext/index.tsx) | `images` + `playlist` + `playlistCursor` — `images[playlist[playlistCursor]]?.fileData` |
| `navigate()` / `keyDownHandler` | [useNavigation.ts](../src/SlideshowPage/SlideshowContext/useNavigation.ts) | `images` + `playlist` + `playlistCursor` — reads them to compute bounds and increment cursor |
| `navigateToDate()` | [useNavigation.ts](../src/SlideshowPage/SlideshowContext/useNavigation.ts) | `images` + `playlist` + `dateSorting` — scans playlist-ordered images to find date match |

---

## Level 3 — 3 degrees removed (depends on Level 2 data)

| Data | Source | Depends On |
|------|--------|------------|
| `exifExtracted` (GPS coords) | [useExif.ts](../src/SlideshowPage/SlideshowContext/useExif.ts) | `fileData` (current) — reads EXIF binary from the current image's file handle |
| `isExifPresent` | [useExif.ts](../src/SlideshowPage/SlideshowContext/useExif.ts) | `exifExtracted` — checks all 4 GPS fields are non-null |

---

## Level 4 — 4 degrees removed (depends on Level 3 + external API)

| Data | Source | Depends On |
|------|--------|------------|
| `city` | [useExif.ts](../src/SlideshowPage/SlideshowContext/useExif.ts) | `exifExtracted` GPS coords → **external API call** to `/locations` endpoint |
| `country` | [useExif.ts](../src/SlideshowPage/SlideshowContext/useExif.ts) | `exifExtracted` GPS coords → **external API call** to `/locations` endpoint |
| `isLoadingGeoNames` | [useExif.ts](../src/SlideshowPage/SlideshowContext/useExif.ts) | Tracks the async state of the API call above |

---

## Visual Dependency Chain

```
Level 0 (independent)
  images, dateSorting, showingGallery, objectFit, isLoadingImages
    │
Level 1 (sorted/indexed)
  playlist, galleryImages, playlistCursor
    │
Level 2 (resolved from cursor)
  mainImage, date, thumbnails, fileData, navigate(), navigateToDate()
    │
Level 3 (extracted from file)
  exifExtracted, isExifPresent
    │
Level 4 (external API)
  city, country, isLoadingGeoNames
```
