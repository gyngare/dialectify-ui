# Shopee product rank API (`/rank-shopee`)

One public endpoint, no login. The frontend calls it from `lib/rank-api.ts` and computes the score itself from the response (`lib/product-rank.ts`, rubric v1). **The backend never returns a score**: it returns facts about the listing and yes/no answers to fixed checks. That keeps the score deterministic and lets us change the rubric without touching the backend.

JSON is camelCase. Amounts are rupiah as numbers.

---

## `POST /api/rank/shopee`

```json
{ "url": "https://shopee.co.id/Sepatu-Sneakers-Pria-i.88120334.24019387712" }
```

Accepted links:

- `shopee.co.id/<slug>-i.<shopId>.<itemId>`
- `shopee.co.id/product/<shopId>/<itemId>`
- short links `id.shp.ee/…`, `shp.ee/…`, `shope.ee/…`: follow the redirect, then parse as above

Strip query strings before using the URL as a cache key.

### 200

```json
{
  "listing": {
    "url": "https://shopee.co.id/product/88120334/24019387712",
    "shopId": "88120334",
    "itemId": "24019387712",
    "title": "Sepatu Sneakers Pria Kanvas Low Top Sol Karet Anti Slip Ukuran 39-44",
    "shopName": "Langkah Ringan Official",
    "categoryPath": ["Sepatu Pria", "Sneakers"],
    "price": 189000,
    "soldMonthly": 1840,
    "soldTotal": 21300,
    "rating": 4.8,
    "ratingCount": 6120,
    "ratingWithPhotoCount": 1410,
    "imageUrls": ["https://down-id.img.susercontent.com/file/…"],
    "hasVideo": true,
    "descriptionLength": 1260,
    "variationCount": 12
  },
  "checks": {
    "main_photo_clean": true,
    "main_photo_fills": true,
    "photos_sharp": true,
    "photos_in_use": true,
    "title_clear": true,
    "title_no_spam": true,
    "desc_specs": true,
    "desc_structured": true,
    "desc_answers": false,
    "variation_photos": false
  },
  "contentHash": "9f2c41aa",
  "checkedAt": "2026-11-25T08:14:00Z"
}
```

Field rules. These matter for fairness, so please follow them exactly:

| Field | Rule |
|---|---|
| `price` | Lowest variation price **after** the seller's discount, before vouchers. |
| `soldMonthly` | Units sold in the last 30 days. If only a rounded label is available ("1RB+", "10RB+"), use the lower bound (1000, 10000). Never estimate upward. |
| `soldTotal` | Lifetime units, same rounding rule. Shown only, not scored. |
| `rating` | 0–5. `0` when `ratingCount` is 0. |
| `ratingWithPhotoCount` | Reviews that include a photo or video. |
| `imageUrls` | Listing gallery in order, main photo first. Variation photos excluded. |
| `descriptionLength` | Characters after collapsing whitespace. |
| `variationCount` | Number of purchasable variations (1 if none). |

### The checks

Answer each with a model at **temperature 0**, one question per call or one structured call with a JSON schema of booleans. Use the exact question text below. When in doubt the answer is `false`.

| id | Input | Question |
|---|---|---|
| `main_photo_clean` | main photo | Is the background plain or uncluttered, with no unrelated objects? |
| `main_photo_fills` | main photo | Does the product take up at least about half of the image? |
| `photos_sharp` | all gallery photos | Are all photos sharp, with no visible blur, pixelation or heavy compression? |
| `photos_in_use` | all gallery photos | Does at least one photo show the product in use, worn, or next to an object that shows its size? |
| `title_clear` | title | Does the title name the product type and at least one distinguishing attribute (material, size, model, flavour)? |
| `title_no_spam` | title | Is the title free of repeated words or phrases, unrelated brand names, and all-caps text? |
| `desc_specs` | description | Does the description list concrete specifications such as material, dimensions, weight, contents or warranty? |
| `desc_structured` | description | Is the description broken into short sections, lines or bullet points rather than one block of text? |
| `desc_answers` | description | Does it answer at least two common buyer questions (how to use, care, sizing, shipping, returns)? |
| `variation_photos` | variations | Does every variation have its own photo? `true` when there is only one variation. |

The four rule checks (photo count, video, title length, description length) are computed by the frontend from `listing`, so they are not in `checks`.

### Caching

Cache the whole response by `shopId + itemId` for 24 hours. Cache check answers by `contentHash` (a hash of title, description, image URLs and variation list) **indefinitely**: if the listing content hasn't changed, return the same answers even after the 24-hour refresh of sales numbers. This is what makes the score stable.

### Errors

Body: `{ "error": "<code>" }`

| Status | `error` | When |
|---|---|---|
| 400 | `invalid_url` | Not a Shopee Indonesia product link |
| 404 | `not_found` | Listing deleted, banned or private |
| 422 | `unreadable` | Shopee blocked the fetch or the page couldn't be parsed |
| 429 | `rate_limited` | Per-IP limit hit. Suggest 10 requests per IP per hour. |

The frontend shows a specific message for each.

CORS: allow the frontend origin for `POST`, no credentials needed.
