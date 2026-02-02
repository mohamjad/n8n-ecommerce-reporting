# Project Summary

## Multi-API E-commerce Reporting Automation (n8n)
**Frontend Specification Document**

A comprehensive frontend specification for automating daily e-commerce dashboards that pull sales and ad metrics from Amazon SP-API, Amazon Ads API, and Walmart Seller/Ads APIs, normalize the data, compute derived KPIs, validate totals, and write clean outputs to Google Sheets.

> **Note**: This is a frontend specification focusing on architecture, UI design, data models, and documentation. Implementation details are provided as reference structures.

---

## Project Structure

```
n8n-ecommerce-reporting/
├── README.md                          # Main project documentation
├── LICENSE                            # MIT License
├── .gitignore                         # Git ignore rules
├── PROJECT_SUMMARY.md                 # This file
│
├── workflows/                         # n8n workflow JSON files
│   ├── amazon-sp-api-workflow.json    # Amazon SP-API + Ads workflow
│   └── walmart-api-workflow.json      # Walmart Seller + Ads workflow
│
├── schemas/                           # Data schemas and mappings
│   ├── canonical-schema.json          # Unified schema definition
│   ├── sample-output-schema.json      # Sample JSON output
│   ├── sample-output.csv              # Sample CSV output
│   └── field-mapping.md               # API field mapping reference
│
├── templates/                         # Google Sheets templates
│   ├── google-sheets-template.md      # Sheet structure documentation
│   └── sheets-formulas.md             # Formula reference
│
└── docs/                              # Documentation
    ├── setup-guide.md                 # Complete setup instructions
    ├── validation-checklist.md        # Data validation rules
    └── troubleshooting-guide.md       # Common issues and solutions
```

---

## Key Features

✅ **Multi-Platform Support**: Amazon SP-API, Amazon Ads, Walmart Seller, Walmart Ads  
✅ **Automated Scheduling**: Daily runs at 06:00/06:15 CST with DST handling  
✅ **Robust Parsing**: TSV, JSON, and GZIP-compressed formats  
✅ **Canonical Schema**: Unified data model across all sources  
✅ **Derived Metrics**: ACoS, TACoS, CTR, CPC, ROAS, conversion rates  
✅ **Validation**: Totals checks, drift detection, data quality  
✅ **Idempotent Writes**: Safe reruns, no duplicates  
✅ **Retry Logic**: Exponential backoff for rate limits and failures  
✅ **Observability**: Run logging, error notifications, audit trail  
✅ **Production-Ready**: Error handling, monitoring, documentation  

---

## Quick Start (Frontend Specification)

1. **Review Architecture**: Start with `README.md` for overview and architecture diagram
2. **Study Data Model**: Review `schemas/canonical-schema.json` for field definitions
3. **Design UI**: Use `templates/google-sheets-template.md` for dashboard layout
4. **Understand Metrics**: Review metrics tables in README for KPIs
5. **Plan Implementation**: Use workflow structures as reference (not full implementation)
6. **Build Frontend**: Create dashboards based on specifications

---

## Deliverables Checklist

- [x] Exportable n8n workflow JSON (Amazon lane + Walmart lane)
- [x] Google Sheets template documentation (tabs + formulas)
- [x] Canonical schema spec (JSON Schema)
- [x] Validation checklist + known edge cases
- [x] Troubleshooting guide (common failure modes)
- [x] Sample output schema (CSV/JSON)
- [x] Field mapping reference
- [x] Setup guide
- [x] Architecture diagram (in README)
- [x] Metrics tables (in README)

---

## Metrics Produced

### Sales Metrics (15 fields)
- Orders, revenue, units, refunds, order status breakdowns
- Fulfillment method, organic vs promoted sales

### Ads Metrics (15 fields)
- Spend, sales, orders, impressions, clicks
- CTR, CPC, ACoS, TACoS, ROAS, conversion rate
- Campaign type breakdowns (SP/SB/SD)

### Metadata (8 fields)
- Date, marketplace, account_id, currency
- Attribution window, data source version, report_id, run_id

---

## Reliability Guarantees

✅ Retry logic for rate limits and transient failures  
✅ Exponential backoff polling with timeout caps  
✅ Idempotent writes (safe reruns, no duplicates)  
✅ Central run logging (audit trail)  
✅ Drift alerts when totals deviate beyond thresholds  
✅ Clear documentation and handoff  

---

## Known Edge Cases

1. Ads attribution windows cause differences vs console views
2. Settlement latency can shift revenue totals for recent days
3. Daylight savings boundary handling (CST/CDT)
4. API throttling (429) and report availability delays
5. Missing fields for some marketplaces/campaign types

---

## Tech Stack

**Core**: n8n • REST APIs • OAuth refresh • Webhooks  
**Data Processing**: TSV parsing • GZIP decompression • JSON parsing  
**Storage**: Google Sheets API • Postgres (optional)  
**Frontend**: React dashboard (optional)  
**Monitoring**: Run logging • Error notifications • Drift alerts  

---

## Next Steps

1. **Customize**: Update account IDs, marketplaces, report types
2. **Test**: Run with sample data, validate outputs
3. **Deploy**: Enable scheduled runs, monitor first executions
4. **Extend**: Add more data sources, create dashboards, set up alerts
5. **Maintain**: Regular credential rotation, API updates, performance tuning

---

## Support

- **Documentation**: See `docs/` directory
- **Troubleshooting**: Check `docs/troubleshooting-guide.md`
- **Validation**: Review `docs/validation-checklist.md`
- **Setup**: Follow `docs/setup-guide.md`

---

## License

MIT License - See LICENSE file for details

---

**Created**: February 2, 2026  
**Version**: 1.0.0  
**Status**: Reference Implementation
