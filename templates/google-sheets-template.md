# Google Sheets Template Structure

This document describes the Google Sheets template structure for the Multi-API E-commerce Reporting Dashboard.

## Sheet Structure

The template consists of multiple tabs:

1. **Sales Dashboard** - Sales metrics by date, marketplace, account
2. **Ads Dashboard** - Advertising metrics and KPIs
3. **Product Performance** (Optional) - SKU-level breakdowns
4. **Run Logs** - Workflow execution audit trail
5. **Metadata** - Configuration and field definitions

---

## Tab 1: Sales Dashboard

### Column Structure

| Column | Field Name | Data Type | Format | Description |
|--------|-----------|-----------|--------|-------------|
| A | date | Date | YYYY-MM-DD | Report date (CST) |
| B | marketplace | Text | - | Marketplace code (US, CA, etc.) |
| C | account_id | Text | - | Seller account ID |
| D | currency | Text | - | Currency code (USD, CAD) |
| E | total_orders | Number | #,##0 | Total orders |
| F | total_revenue | Currency | $#,##0.00 | Gross revenue |
| G | net_revenue | Currency | $#,##0.00 | Revenue after refunds |
| H | units_sold | Number | #,##0 | Units sold |
| I | avg_order_value | Currency | $#,##0.00 | Average order value |
| J | refunds_amount | Currency | $#,##0.00 | Total refunds |
| K | refund_rate | Percentage | 0.00% | Refund percentage |
| L | order_status_shipped | Number | #,##0 | Shipped orders |
| M | order_status_pending | Number | #,##0 | Pending orders |
| N | order_status_cancelled | Number | #,##0 | Cancelled orders |
| O | organic_sales | Currency | $#,##0.00 | Non-ad sales |
| P | promoted_sales | Currency | $#,##0.00 | Ad-attributed sales |
| Q | fulfillment_by_amazon | Number | #,##0 | FBA orders |
| R | fulfillment_by_merchant | Number | #,##0 | FBM orders |
| S | run_id | Text | - | Workflow run ID |
| T | last_updated | DateTime | YYYY-MM-DD HH:MM:SS | Last update timestamp |

### Formulas

**Row 1**: Headers (frozen)
**Row 2**: Summary row with formulas:
- `=SUM(E:E)` - Total orders
- `=SUM(F:F)` - Total revenue
- `=AVERAGE(I:I)` - Average order value across all rows

**Data starts at Row 3**

### Formatting

- Header row: Bold, background color #4285F4, white text
- Date column: Date format
- Currency columns: Currency format with 2 decimals
- Percentage columns: Percentage format with 2 decimals
- Alternating row colors for readability
- Freeze first row and first 2 columns

---

## Tab 2: Ads Dashboard

### Column Structure

| Column | Field Name | Data Type | Format | Description |
|--------|-----------|-----------|--------|-------------|
| A | date | Date | YYYY-MM-DD | Report date (CST) |
| B | marketplace | Text | - | Marketplace code |
| C | account_id | Text | - | Ad account ID |
| D | currency | Text | - | Currency code |
| E | ad_spend | Currency | $#,##0.00 | Total ad spend |
| F | ad_sales | Currency | $#,##0.00 | Ad-attributed sales |
| G | ad_orders | Number | #,##0 | Ad-attributed orders |
| H | impressions | Number | #,##0 | Ad impressions |
| I | clicks | Number | #,##0 | Ad clicks |
| J | ctr | Percentage | 0.00% | Click-through rate |
| K | cpc | Currency | $#,##0.00 | Cost per click |
| L | acos | Percentage | 0.00% | Advertising Cost of Sales |
| M | tacos | Percentage | 0.00% | Total ACoS |
| N | roas | Number | 0.00 | Return on ad spend |
| O | conversion_rate | Percentage | 0.00% | Conversion rate |
| P | campaign_type_sp | Currency | $#,##0.00 | Sponsored Products spend |
| Q | campaign_type_sb | Currency | $#,##0.00 | Sponsored Brands spend |
| R | campaign_type_sd | Currency | $#,##0.00 | Sponsored Display spend |
| S | attribution_window | Number | # | Attribution window (days) |
| T | run_id | Text | - | Workflow run ID |
| U | last_updated | DateTime | YYYY-MM-DD HH:MM:SS | Last update timestamp |

### Formulas

**Summary Row (Row 2)**:
- `=SUM(E:E)` - Total ad spend
- `=SUM(F:F)` - Total ad sales
- `=SUM(E:E)/SUM(F:F)*100` - Overall ACoS
- `=SUM(F:F)/SUM(E:E)` - Overall ROAS
- `=SUM(I:I)/SUM(H:H)*100` - Overall CTR

**KPIs Row (Row 3)** - Calculated metrics:
- `=AVERAGE(L:L)` - Average ACoS
- `=AVERAGE(N:N)` - Average ROAS
- `=AVERAGE(J:J)` - Average CTR

### Formatting

- Header row: Bold, background color #EA4335, white text
- Conditional formatting:
  - ACoS > 30%: Red background
  - ACoS < 20%: Green background
  - ROAS > 4: Green background
  - ROAS < 2: Red background

---

## Tab 3: Product Performance (Optional)

### Column Structure

| Column | Field Name | Data Type | Format | Description |
|--------|-----------|-----------|--------|-------------|
| A | date | Date | YYYY-MM-DD | Report date |
| B | marketplace | Text | - | Marketplace code |
| C | account_id | Text | - | Account ID |
| D | sku | Text | - | Product SKU |
| E | units_sold | Number | #,##0 | Units sold |
| F | revenue | Currency | $#,##0.00 | Revenue from SKU |
| G | ad_spend | Currency | $#,##0.00 | Ad spend for SKU |
| H | ad_sales | Currency | $#,##0.00 | Ad-attributed sales |
| I | acos | Percentage | 0.00% | SKU ACoS |
| J | run_id | Text | - | Workflow run ID |

### Formulas

**Pivot Table**: Top 10 SKUs by revenue
**Charts**: 
- Bar chart: Revenue by SKU
- Line chart: Units sold over time

---

## Tab 4: Run Logs

### Column Structure

| Column | Field Name | Data Type | Format | Description |
|--------|-----------|-----------|--------|-------------|
| A | run_id | Text | - | Unique run identifier |
| B | start_time | DateTime | YYYY-MM-DD HH:MM:SS | Workflow start time |
| C | end_time | DateTime | YYYY-MM-DD HH:MM:SS | Workflow end time |
| D | duration_seconds | Number | #,##0 | Execution duration |
| E | status | Text | - | SUCCESS / FAILED / PARTIAL |
| F | reports_requested | Number | #,##0 | Number of reports requested |
| G | reports_completed | Number | #,##0 | Number of reports completed |
| H | rows_written | Number | #,##0 | Rows written to sheets |
| I | errors | Text | - | Error messages (if any) |
| J | report_ids | Text | - | Comma-separated report IDs |
| K | validation_failures | Number | #,##0 | Number of validation failures |
| L | notifications_sent | Text | - | Y/N |

### Formulas

**Summary Row (Row 2)**:
- `=COUNTIF(E:E,"SUCCESS")` - Successful runs
- `=COUNTIF(E:E,"FAILED")` - Failed runs
- `=AVERAGE(D:D)` - Average duration
- `=SUM(H:H)` - Total rows written

### Formatting

- Status column: Conditional formatting
  - SUCCESS: Green background
  - FAILED: Red background
  - PARTIAL: Yellow background
- Sort by start_time descending (newest first)

---

## Tab 5: Metadata

### Configuration Section

| Field | Value | Description |
|-------|-------|-------------|
| Workflow Version | 1.0.0 | Current workflow version |
| Last Updated | 2026-02-02 | Last template update |
| Timezone | CST/CDT | Timezone used for dates |
| Attribution Window | 7/14 days | Default attribution windows |

### Field Definitions

Reference table mapping canonical fields to source API fields.

### Validation Rules

List of validation rules and thresholds used.

---

## Upsert Logic

The workflow uses upsert logic to prevent duplicates:

**Unique Key**: `(date, account_id, marketplace)`

**Process**:
1. Check if row exists with matching unique key
2. If exists: UPDATE row with new data, preserve run_id and last_updated
3. If not exists: INSERT new row

**Implementation in n8n**:
- Use Google Sheets "Update Row" node with lookup
- Or use "Append Row" with pre-check and delete if exists

---

## Data Refresh

**Schedule**: Daily at 06:00 CST and 06:15 CST

**Process**:
1. Fetch yesterday's data (CST)
2. Normalize and validate
3. Upsert to appropriate tabs
4. Log run details to Run Logs tab
5. Send notifications on failure

---

## Access Control

- **Service Account**: Used by n8n for API access
- **Viewers**: Read-only access for stakeholders
- **Editors**: Manual corrections (if needed)

---

## Backup Strategy

- Weekly export to CSV
- Version history enabled in Google Sheets
- Archive old data to separate sheet after 90 days

---

## Sample Formulas for Analysis

### Daily Trends
```
=QUERY(Sales!A:F,"SELECT A, SUM(E), SUM(F) GROUP BY A ORDER BY A DESC LIMIT 7")
```

### Marketplace Comparison
```
=QUERY(Sales!A:F,"SELECT B, SUM(E), SUM(F) GROUP BY B")
```

### Top Accounts
```
=QUERY(Sales!A:F,"SELECT C, SUM(F) GROUP BY C ORDER BY SUM(F) DESC LIMIT 10")
```

### ACoS Trends
```
=QUERY(Ads!A:M,"SELECT A, AVG(L) GROUP BY A ORDER BY A DESC LIMIT 30")
```

---

## Notes

- All dates are in CST/CDT timezone
- Currency is normalized to account currency
- Missing values are represented as 0 or empty
- Run logs are append-only (never deleted)
- Historical data is preserved (no overwrites, only updates)
