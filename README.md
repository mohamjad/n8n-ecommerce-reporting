# Multi-API Sales + Ads Dashboards in n8n

**Frontend Specification Document**

**Daily automated dashboards that pull sales and ad metrics, normalize formats, compute derived KPIs, validate totals, and write clean outputs to Google Sheets with retries, alerts, and run logs.**

> **Note**: This is a frontend specification document. Implementation details and workflow JSON files are provided as reference only.

![Badges](https://img.shields.io/badge/n8n-Workflow-orange) ![Badges](https://img.shields.io/badge/Amazon-SP--API-orange) ![Badges](https://img.shields.io/badge/Amazon-Ads-orange) ![Badges](https://img.shields.io/badge/Walmart-APIs-blue) ![Badges](https://img.shields.io/badge/Google-Sheets-green) ![Badges](https://img.shields.io/badge/GZIP%2FTSV-Parsing-lightgrey) ![Badges](https://img.shields.io/badge/Retry%2BAlerts-Built--in-red) ![Badges](https://img.shields.io/badge/Validation-Checks-yellow)

[View Workflow Schematic](#architecture-diagram) | [Download Sample Output Schema](./schemas/sample-output-schema.json)

---

## How It Works

This project demonstrates a production-ready n8n architecture for daily e-commerce dashboards. It schedules CST-based runs, requests platform reports, polls asynchronously until documents are ready, downloads and parses TSV and GZIP-compressed JSON formats, normalizes all sources into a canonical metric schema, computes derived KPIs like ACoS and TACoS, validates totals with drift thresholds, and writes idempotent outputs to Google Sheets. The workflow includes retry logic, centralized run logging, and failure notifications to support ongoing reliability.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    ORCHESTRATION (n8n Core)                                 │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                             │
│  ┌──────────────┐    ┌──────────────────────┐    ┌─────────────────────────────┐         │
│  │ Cron Trigger │───▶│ Timezone + "Yesterday"│───▶│ Auth & Token Refresh Layer │         │
│  │ 06:00 CST    │    │ Window Builder        │    │ • SP-API tokens            │         │
│  │ 06:15 CST    │    │ compute start/end     │    │ • Ads OAuth refresh        │         │
│  └──────────────┘    │ timestamps in CST     │    │ • Walmart auth            │         │
│                      └──────────────────────┘    └─────────────────────────────┘         │
│                                                                                             │
│                                    ┌──────────────────┐                                    │
│                                    │ Report Request   │                                    │
│                                    │ Dispatcher       │                                    │
│                                    └────────┬─────────┘                                    │
│                                             │                                              │
│                    ┌────────────────────────┼────────────────────────┐                    │
│                    │                        │                        │                    │
│                    ▼                        ▼                        ▼                    │
│         ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐            │
│         │ Amazon Seller    │    │ Amazon Ads API  │    │ Walmart Seller + │            │
│         │ Central (SP-API)│    │ (Reporting)     │    │ Walmart Ads APIs │            │
│         │ Reports          │    │                  │    │                  │            │
│         └──────────────────┘    └──────────────────┘    └──────────────────┘            │
│                    │                        │                        │                    │
│                    └────────────────────────┼────────────────────────┘                    │
│                                             │                                              │
│                                    ┌────────▼─────────┐                                    │
│                                    │ Polling Controller│                                    │
│                                    │ (Backoff + Timeout)│                                   │
│                                    │ loop until DONE/  │                                    │
│                                    │ FAILED            │                                    │
│                                    └────────┬──────────┘                                    │
│                                             │ (dotted line)                                 │
│                                    ┌────────▼──────────────┐                                │
│                                    │ Document Download      │                                │
│                                    │ Manager                │                                │
│                                    │ fetch report URLs      │                                │
│                                    └────────┬───────────────┘                                │
│                                             │                                                │
│                                    ┌────────▼──────────┐                                    │
│                                    │ Format Detector    │                                    │
│                                    │ TSV vs JSON vs GZIP│                                    │
│                                    └────────┬───────────┘                                    │
│                                             │                                                │
│                                    ┌────────▼──────────┐                                    │
│                                    │ Decompress + Parse │                                    │
│                                    │ GZIP decode        │                                    │
│                                    │ TSV parse          │                                    │
│                                    │ JSON parse         │                                    │
│                                    └────────┬───────────┘                                    │
│                                             │                                                │
│                                    ┌────────▼──────────────────┐                            │
│                                    │ Normalize to Canonical    │                            │
│                                    │ Schema                    │                            │
│                                    │ map all sources to common │                            │
│                                    │ metric keys               │                            │
│                                    └────────┬──────────────────┘                            │
│                                             │                                                │
│                                    ┌────────▼──────────────────┐                            │
│                                    │ Derived Metrics Engine    │                            │
│                                    │ ACoS, TACoS, CTR, CPC,    │                            │
│                                    │ conversion, organic sales │                            │
│                                    └────────┬──────────────────┘                            │
│                                             │                                                │
│                                    ┌────────▼──────────────────────┐                        │
│                                    │ Validation & Reconciliation   │                        │
│                                    │ Checks                        │                        │
│                                    │ row counts, required fields,  │                        │
│                                    │ totals sanity checks         │                        │
│                                    └────────┬──────────────────────┘                        │
│                                             │                                                │
│                                    ┌────────▼──────────────┐                                │
│                                    │ Idempotent Write Layer │                                │
│                                    │ upsert by (date,       │                                │
│                                    │ account, marketplace)  │                                │
│                                    └────────┬───────────────┘                                │
│                                             │                                                │
│                    ┌────────────────────────┼────────────────────────┐                    │
│                    │                        │                        │                    │
│                    ▼                        ▼                        ▼                    │
│         ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐            │
│         │ Notifications    │    │ Run Logging      │    │ Error Handler    │            │
│         │ email/webhook on │    │ runId, timings,  │    │ (red path)       │            │
│         │ failure or drift │    │ reportIds, counts│    │ Retry, Backoff   │            │
│         └──────────────────┘    └──────────────────┘    └──────────────────┘            │
│                                                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    OUTPUTS & OBSERVABILITY                                  │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                             │
│  ┌──────────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐   │
│  │ Google Sheets Dashboard  │    │ Run Logs Tab /       │    │ Alerts                │   │
│  │ • Sales tab              │    │ Postgres (optional)  │    │ Slack/Email/Webhook   │   │
│  │ • Ads tab                │    │                      │    │                       │   │
│  │ • Product tab (optional) │    │                      │    │                       │   │
│  └──────────────────────────┘    └──────────────────────┘    └──────────────────────┘   │
│                                                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

**Key Guarantees:** Retry • Backoff • Upsert • Drift Alert
```

---

## Workflow Details

### Card 1: Scheduling + Date Logic

**What it does:** Implements CST-safe "yesterday" boundaries with proper daylight savings handling.

**Why it matters:** Ensures consistent date windows across API calls and prevents data gaps or overlaps during timezone transitions. Critical for accurate daily reporting and reconciliation.

---

### Card 2: Report Lifecycle

**What it does:** Manages the asynchronous report workflow: Request → poll → download → parse.

**Why it matters:** Platform APIs generate reports asynchronously. This pattern handles variable wait times, prevents premature downloads, and ensures data completeness before processing.

---

### Card 3: Parsing Layer

**What it does:** Handles TSV parsing (Seller), GZIP-compressed JSON parsing (Ads), with schema checks and safe defaults.

**Why it matters:** Different APIs return data in different formats. Robust parsing prevents failures from format variations and missing fields, ensuring reliable data extraction.

---

### Card 4: Canonical Metric Model

**What it does:** Normalizes all sources to one unified schema, separating raw fields from computed fields.

**Why it matters:** Enables consistent analysis across platforms, simplifies dashboard creation, and makes it easy to add new data sources without changing downstream consumers.

---

### Card 5: Validation & Accuracy

**What it does:** Performs totals checks, drift threshold monitoring, and attribution/timezone alignment validation.

**Why it matters:** Catches data quality issues early, ensures report accuracy, and provides confidence in downstream business decisions based on the data.

---

### Card 6: Reliability & Observability

**What it does:** Implements retries on 429/5xx errors, centralized run logs (runId, endpoints, durations), and failure notifications.

**Why it matters:** Production systems need resilience. Retry logic handles transient failures, logging enables debugging, and notifications ensure issues are caught quickly.

---

## What Metrics Are Produced

### Sales Metrics

| Metric Name | Description | Unit |
|------------|-------------|------|
| `total_orders` | Total number of orders | count |
| `total_revenue` | Gross revenue before refunds | currency |
| `units_sold` | Total units sold | count |
| `avg_order_value` | Average order value | currency |
| `refunds_amount` | Total refund amount | currency |
| `order_status_shipped` | Orders with shipped status | count |
| `order_status_pending` | Orders with pending status | count |
| `order_status_cancelled` | Orders with cancelled status | count |
| `product_sales_top_skus` | Top SKUs by sales (optional) | JSON array |
| `organic_sales` | Sales not attributed to ads | currency |
| `promoted_sales` | Sales attributed to ads | currency |
| `net_revenue` | Revenue after refunds | currency |
| `refund_rate` | Percentage of orders refunded | percentage |
| `fulfillment_by_amazon` | FBA orders count | count |
| `fulfillment_by_merchant` | FBM orders count | count |

### Ads Metrics

| Metric Name | Description | Unit |
|------------|-------------|------|
| `ad_spend` | Total advertising spend | currency |
| `ad_sales` | Sales attributed to ads | currency |
| `ad_orders` | Orders from ads | count |
| `impressions` | Ad impressions | count |
| `clicks` | Ad clicks | count |
| `ctr` | Click-through rate | percentage |
| `cpc` | Cost per click | currency |
| `acos` | Advertising Cost of Sales | percentage |
| `tacos` | Total Advertising Cost of Sales | percentage |
| `campaign_type_sp` | Sponsored Products spend | currency |
| `campaign_type_sb` | Sponsored Brands spend | currency |
| `campaign_type_sd` | Sponsored Display spend | currency |
| `conversion_rate` | Orders per click | percentage |
| `roas` | Return on ad spend | ratio |
| `ad_attribution_window` | Attribution window used | days |

### Metadata Fields

| Field Name | Description | Example |
|-----------|-------------|---------|
| `date` | Report date (CST) | 2026-02-01 |
| `marketplace` | Marketplace identifier | US, CA, MX |
| `account_id` | Seller/ad account ID | A123456789 |
| `currency` | Currency code | USD, CAD |
| `attribution_window` | Attribution window | 7, 14, 30 |
| `data_source_version` | API version used | v1.0, v2.0 |
| `report_id` | Source report identifier | RPT-12345 |
| `run_id` | Workflow run identifier | RUN-20260202-060000 |
| `last_updated` | Last update timestamp | 2026-02-02T06:15:00Z |

---

## Reliability Guarantees

✅ **Retry logic for rate limits and transient failures**  
✅ **Exponential backoff polling with timeout caps**  
✅ **Idempotent writes (safe reruns, no duplicates)**  
✅ **Central run logging (audit trail)**  
✅ **Drift alerts when totals deviate beyond thresholds**  
✅ **Clear documentation and handoff**

---

## Reference Implementation Deliverables

### Frontend Specification Documents
- [Architecture diagram](#architecture-diagram) - Visual workflow schematic
- [Metrics tables](#what-metrics-are-produced) - Complete field definitions
- [Google Sheets template structure](./templates/google-sheets-template.md) - UI layout and columns
- [Canonical schema](./schemas/canonical-schema.json) - Data model specification

### Reference Workflows (Placeholder)
- [Amazon lane workflow](./workflows/amazon-sp-api-workflow.json) - Reference structure only
- [Walmart lane workflow](./workflows/walmart-api-workflow.json) - Reference structure only

> **Note**: Workflow JSON files are provided as reference/placeholder structures. Actual implementation should be built based on this specification.

### Google Sheets Template
- [Template structure documentation](./templates/google-sheets-template.md)
- [Sample formulas and formatting](./templates/sheets-formulas.md)

### Canonical Schema Specification
- [JSON Schema definition](./schemas/canonical-schema.json)
- [Field mapping reference](./schemas/field-mapping.md)

### Validation Checklist
- [Validation rules and checks](./docs/validation-checklist.md)

### Troubleshooting Guide
- [Common failure modes and solutions](./docs/troubleshooting-guide.md)

### Sample Output Files
- [Sample CSV output](./schemas/sample-output.csv)
- [Sample JSON output](./schemas/sample-output-schema.json)

---

## Known Edge Cases

1. **Ads attribution windows cause differences vs console views**  
   Different attribution windows (7-day vs 14-day) will show different numbers than platform consoles. Document the window used.

2. **Settlement latency can shift revenue totals for recent days**  
   Revenue totals may change as settlements finalize. Consider flagging recent days as "provisional."

3. **Daylight savings boundary handling (CST/CDT)**  
   Ensure date calculations account for DST transitions to prevent gaps or overlaps.

4. **API throttling (429) and report availability delays**  
   Reports may take longer during peak times. Backoff logic handles this, but may delay completion.

5. **Missing fields for some marketplaces/campaign types**  
   Some marketplaces or campaign types may not return all fields. Use safe defaults and document gaps.

---

## Screenshots & Mockups

> **Note:** For frontend specification, mockups and screenshots should be added to the `docs/screenshots/` directory:
> - **Architecture mockup**: n8n canvas showing: trigger → request → polling loop → download → parse → write
> - **UI mockups**: Google Sheets dashboard layouts (Sales, Ads, Run Logs tabs)
> - **Component designs**: Polling loop visualization, parse node UI
> - **Dashboard previews**: One day row example, clean column layouts
> - **Status displays**: Run logs tab mockup (runId, status, counts)
> - **Alert designs**: Error notification UI examples (email/webhook payload display)

These visual references help frontend developers understand the expected UI/UX.

---

## Tech Stack

**Core:** n8n • REST APIs • OAuth refresh • Webhooks  
**Data Processing:** TSV parsing • GZIP decompression • JSON parsing  
**Storage:** Google Sheets API • Postgres (optional)  
**Frontend:** React dashboard (optional)  
**Monitoring:** Run logging • Error notifications • Drift alerts

---

## Getting Started (Frontend Specification)

This is a **frontend specification document**. To use this specification:

1. **Review Architecture** - Study the architecture diagram and workflow details
2. **Understand Data Model** - Review `schemas/canonical-schema.json` for field definitions
3. **Design UI** - Use `templates/google-sheets-template.md` for dashboard layout
4. **Plan Implementation** - Use workflow structures as reference for implementation planning
5. **Build Dashboards** - Create frontend components based on metrics tables and schemas

For implementation details, see the [Setup Guide](./docs/setup-guide.md) (reference only for this spec phase).

---

## License

MIT License - See LICENSE file for details
