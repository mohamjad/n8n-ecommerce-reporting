# Field Mapping Reference

This document maps source API fields to canonical schema fields.

## Amazon SP-API Reports

| Canonical Field | SP-API Field | Notes |
|----------------|--------------|-------|
| `total_orders` | `Total Orders` | Sum of order count |
| `total_revenue` | `Total Sales` | Gross sales amount |
| `units_sold` | `Units Sold` | Total units |
| `refunds_amount` | `Refunds` | Total refund amount |
| `order_status_shipped` | `Shipped Orders` | Filter by status |
| `order_status_pending` | `Pending Orders` | Filter by status |
| `order_status_cancelled` | `Cancelled Orders` | Filter by status |
| `fulfillment_by_amazon` | `FBA Orders` | Fulfillment method filter |
| `fulfillment_by_merchant` | `FBM Orders` | Fulfillment method filter |

## Amazon Ads API

| Canonical Field | Ads API Field | Notes |
|----------------|---------------|-------|
| `ad_spend` | `cost` | Total spend |
| `ad_sales` | `attributedSales14d` | Sales attributed (14-day window) |
| `ad_orders` | `attributedConversions14d` | Orders attributed |
| `impressions` | `impressions` | Ad impressions |
| `clicks` | `clicks` | Ad clicks |
| `campaign_type_sp` | Filter by `campaignType = SPONSORED_PRODUCTS` | Sponsored Products |
| `campaign_type_sb` | Filter by `campaignType = SPONSORED_BRANDS` | Sponsored Brands |
| `campaign_type_sd` | Filter by `campaignType = SPONSORED_DISPLAY` | Sponsored Display |

**Note:** Attribution window varies by report type. Document which window is used.

## Walmart Seller API

| Canonical Field | Walmart Field | Notes |
|----------------|---------------|-------|
| `total_orders` | `orderCount` | Total orders |
| `total_revenue` | `totalSales` | Gross sales |
| `units_sold` | `unitsSold` | Total units |
| `refunds_amount` | `refundAmount` | Refund total |

## Walmart Ads API

| Canonical Field | Walmart Ads Field | Notes |
|----------------|-------------------|-------|
| `ad_spend` | `spend` | Total spend |
| `ad_sales` | `sales` | Attributed sales |
| `ad_orders` | `orders` | Attributed orders |
| `impressions` | `impressions` | Ad impressions |
| `clicks` | `clicks` | Ad clicks |

## Computed Fields

These fields are calculated from raw metrics:

| Computed Field | Formula | Notes |
|---------------|---------|-------|
| `acos` | `(ad_spend / ad_sales) * 100` | Advertising Cost of Sales |
| `tacos` | `(ad_spend / total_revenue) * 100` | Total ACoS |
| `ctr` | `(clicks / impressions) * 100` | Click-through rate |
| `cpc` | `ad_spend / clicks` | Cost per click |
| `roas` | `ad_sales / ad_spend` | Return on ad spend |
| `conversion_rate` | `(ad_orders / clicks) * 100` | Conversion rate |
| `avg_order_value` | `total_revenue / total_orders` | Average order value |
| `refund_rate` | `(refunds_amount / total_revenue) * 100` | Refund percentage |
| `net_revenue` | `total_revenue - refunds_amount` | Revenue after refunds |
| `organic_sales` | `total_revenue - promoted_sales` | Non-ad attributed sales |

## Handling Missing Fields

When a source API doesn't provide a field:

1. Set to `null` or `0` based on field type
2. Document in `data_source_version` which fields are unavailable
3. Add notes in run logs about missing fields
4. Consider using estimates or defaults if business-critical

## Date Handling

- All dates normalized to CST/CDT
- Use ISO 8601 format: `YYYY-MM-DD`
- Handle DST transitions carefully
- Store timezone in metadata

## Currency Handling

- Normalize to account currency
- Store original currency if different
- Use ISO 4217 codes (USD, CAD, etc.)
