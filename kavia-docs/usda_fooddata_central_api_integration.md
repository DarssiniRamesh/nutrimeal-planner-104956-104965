# USDA FoodData Central API Integration Guide

This document provides a comprehensive overview and reference for integrating the USDA FoodData Central API into the Meal Planner frontend application for the purpose of nutritional and calorie data retrieval.

---

## 1. API Overview

USDA FoodData Central is an open data platform provided by the U.S. Department of Agriculture. It offers extensive databases including nutrition information on thousands of foods: raw ingredients, branded food products, and more.

- **Official Docs:** [https://fdc.nal.usda.gov/api-guide.html](https://fdc.nal.usda.gov/api-guide.html)
- **API Base URL:** `https://api.nal.usda.gov/fdc/v1/`
- **Data Coverage:** Raw foods, packaged/processed foods (via brand/UPC), nutrients, food categories.
- **Use Case in Meal Planner:** Retrieve food details, search nutritional content, and obtain calorie information for meal planning features.

---

## 2. Authentication / API Key Handling

All USDA FoodData Central API requests require an API key, which is passed either as a query parameter (`api_key`) or via an HTTP header (`X-Api-Key`). The most common approach is to include it as a query parameter.

- **How to Obtain a Key:** Register at [https://fdc.nal.usda.gov/api-key-signup.html](https://fdc.nal.usda.gov/api-key-signup.html)
- **Key Safety:** Never commit your API key in public repositories. Store it in environment variables (see `.env` example below).

### Example (with query parameter):

```
GET https://api.nal.usda.gov/fdc/v1/foods/search?query=apple&api_key=YOUR_API_KEY
```

### Example (with header):

```
X-Api-Key: YOUR_API_KEY
```

---

## 3. Key Endpoints & Request Examples

### a) Search Foods

- **Endpoint:** `/foods/search`
- **Purpose:** Search for foods and retrieve nutrition summaries.
- **Example Request:**
    ```
    GET https://api.nal.usda.gov/fdc/v1/foods/search?query=banana&api_key=YOUR_API_KEY
    ```
- **Params (common):**
    - `query`: search term (e.g. `banana`)
    - `pageSize`: number of results (default: 50, max: 200)
    - `pageNumber`: page to retrieve
    - `dataType`: filter by data source (e.g. `Foundation`, `Branded`)
    - `api_key`: your secret API key

### b) Get Food Details

- **Endpoint:** `/food/{fdcId}`
- **Purpose:** Obtain detailed nutrition information for a specific food item, referenced by its FDC ID (`fdcId`).
- **Example Request:**
    ```
    GET https://api.nal.usda.gov/fdc/v1/food/1102657?api_key=YOUR_API_KEY
    ```
    `1102657` is the FDC ID for "Apple, raw, with skin".

### c) List Foods (Advanced Bulk Retrieval)

- **Endpoint:** `/foods`
- **Purpose:** Get detailed info for multiple foods in a single POST request.
- **Example Request:**
    ```
    POST https://api.nal.usda.gov/fdc/v1/foods?api_key=YOUR_API_KEY
    Content-Type: application/json

    {
      "fdcIds": [1102657, 1102716]
    }
    ```

---

## 4. Sample Response

### Search Result Example (truncated):

```json
{
  "foods": [
    {
      "fdcId": 1102657,
      "description": "Apple, raw, with skin",
      "dataType": "Foundation",
      "foodNutrients": [
        {
          "nutrientName": "Energy",
          "unitName": "KCAL",
          "value": 52
        },
        {
          "nutrientName": "Protein",
          "unitName": "G",
          "value": 0.26
        }
        // ...
      ]
    }
    // ...
  ],
  "totalHits": 1,
  "currentPage": 1,
  "totalPages": 1
}
```

### Food Details Example (truncated):

```json
{
  "fdcId": 1102657,
  "description": "Apple, raw, with skin",
  "dataType": "Foundation",
  "brandOwner": null,
  "labelNutrients": {
    "calories": { "value": 52 },
    "protein": { "value": 0.26 },
    "fat": { "value": 0.17 },
    "carbohydrates": { "value": 13.8 }
  }
  // More nutrient info...
}
```

---

## 5. Best Practices and Rate Limits

- **Key Security:** Use environment variables for managing API keys. Never expose secrets in source code or version control.
- **Rate Limits:** The API does enforce rate limits, but specific thresholds are not publicly documented. For best reliability, limit requests per minute; batch food detail lookups using the `/foods` POST endpoint where possible.
- **Caching:** Cache food data locally when possible to reduce redundant API calls.
- **Error Handling:** Handle HTTP errors (e.g. 401 Unauthorized for bad keys, 429 Too Many Requests for rate limits).
- **Attribution:** When displaying USDA data to users, include a note or link referencing “Food data provided by USDA FoodData Central.”

---

## 6. Example .env Configuration

Create a `.env` file at the root of your frontend project (e.g. `meal_planner_frontend/.env`):

```
# USDA FoodData Central API Key
REACT_APP_USDA_API_KEY=your_actual_api_key_here

# Base API URL (optional, for abstraction/future migration)
REACT_APP_USDA_API_BASE_URL=https://api.nal.usda.gov/fdc/v1/
```

- Reference environment variables in React using `process.env.REACT_APP_USDA_API_KEY`.
- Never include your actual API key when sharing code publicly.

---

## Appendix: Useful Links

- [USDA FoodData Central Home](https://fdc.nal.usda.gov/)
- [API Documentation](https://fdc.nal.usda.gov/api-guide.html)
- [API Key Signup](https://fdc.nal.usda.gov/api-key-signup.html)

---

**End of document**
