# Validation Checklist

This checklist ensures data quality and accuracy before writing to Google Sheets.

## Pre-Processing Validations

### 1. Date Window Validation
- [ ] Start date is before end date
- [ ] Date range is exactly one day (yesterday in CST)
- [ ] Date format is valid (YYYY-MM-DD)
- [ ] Date accounts for DST transitions

### 2. Authentication Validation
- [ ] SP-API tokens are valid and not expired
- [ ] Amazon Ads OAuth token refresh successful
- [ ] Walmart API credentials are valid
- [ ] Google Sheets API credentials are valid

### 3. Report Request Validation
- [ ] Report request submitted successfully
- [ ] Report ID returned and stored
- [ ] Report type matches expected format
- [ ] Report date range matches request

## Post-Download Validations

### 4. File Format Validation
- [ ] File downloaded successfully (non-empty)
- [ ] File format detected correctly (TSV/JSON/GZIP)
- [ ] GZIP decompression successful (if applicable)
- [ ] File can be parsed without errors

### 5. Schema Validation
- [ ] Required fields are present
- [ ] Field types match expected types
- [ ] No unexpected null values in required fields
- [ ] Date formats are consistent
- [ ] Currency codes are valid ISO 4217 codes

### 6. Row Count Validation
- [ ] Row count > 0 (data exists)
- [ ] Row count matches expected range (not suspiciously high/low)
- [ ] Row count logged for audit trail

## Normalization Validations

### 7. Data Completeness
- [ ] All expected metrics are present
- [ ] Missing fields are handled with defaults
- [ ] No data loss during normalization
- [ ] Field mappings are correct

### 8. Data Type Validation
- [ ] Numeric fields are numbers (not strings)
- [ ] Dates are valid date objects/strings
- [ ] Booleans are boolean values
- [ ] Arrays are properly formatted

## Computed Metrics Validation

### 9. Derived Metrics Accuracy
- [ ] ACoS = (ad_spend / ad_sales) * 100
- [ ] TACoS = (ad_spend / total_revenue) * 100
- [ ] CTR = (clicks / impressions) * 100
- [ ] CPC = ad_spend / clicks (when clicks > 0)
- [ ] ROAS = ad_sales / ad_spend (when ad_spend > 0)
- [ ] Conversion rate = (ad_orders / clicks) * 100
- [ ] Avg order value = total_revenue / total_orders (when orders > 0)
- [ ] Refund rate = (refunds_amount / total_revenue) * 100
- [ ] Net revenue = total_revenue - refunds_amount

### 10. Division by Zero Checks
- [ ] No division by zero errors
- [ ] Zero values handled gracefully (return null or 0)
- [ ] Log warnings for zero denominators

## Reconciliation Validations

### 11. Totals Sanity Checks
- [ ] total_revenue >= net_revenue (refunds can't exceed revenue)
- [ ] total_orders >= sum of order_status_* (status counts don't exceed total)
- [ ] units_sold > 0 when total_orders > 0 (logical consistency)
- [ ] ad_sales <= total_revenue (ads can't exceed total sales)
- [ ] clicks <= impressions (clicks can't exceed impressions)
- [ ] ad_orders <= total_orders (ad orders can't exceed total orders)

### 12. Cross-Source Validation
- [ ] Sales totals match between Seller and Ads APIs (within tolerance)
- [ ] Date ranges align across sources
- [ ] Marketplace codes are consistent
- [ ] Account IDs match expected values

### 13. Drift Detection
- [ ] Compare totals to previous day (if available)
- [ ] Flag if change > threshold (e.g., >50% day-over-day)
- [ ] Compare to platform console views (if available)
- [ ] Document attribution window differences

## Idempotency Validation

### 14. Duplicate Prevention
- [ ] Check for existing record with same (date, account_id, marketplace)
- [ ] Use upsert logic (update if exists, insert if new)
- [ ] Preserve run_id and last_updated timestamps
- [ ] No duplicate rows created

## Output Validation

### 15. Google Sheets Write Validation
- [ ] Data written successfully to Sheets
- [ ] Row count matches expected count
- [ ] No truncation or data loss
- [ ] Formatting applied correctly
- [ ] Formulas updated (if applicable)

### 16. Run Logging
- [ ] Run ID generated and logged
- [ ] Start timestamp recorded
- [ ] End timestamp recorded
- [ ] Duration calculated
- [ ] Report IDs stored
- [ ] Error messages logged (if any)
- [ ] Validation failures logged

## Error Handling Validation

### 17. Retry Logic
- [ ] 429 (rate limit) errors trigger retry
- [ ] 5xx errors trigger retry
- [ ] Exponential backoff implemented
- [ ] Max retry attempts enforced
- [ ] Timeout caps prevent infinite loops

### 18. Failure Notifications
- [ ] Critical failures trigger alerts
- [ ] Alert includes run_id and error details
- [ ] Alert sent to configured channels (email/Slack/webhook)
- [ ] Non-critical warnings logged but don't block

## Post-Run Validation

### 19. Final Checks
- [ ] All expected reports processed
- [ ] No unhandled exceptions
- [ ] Run log entry created
- [ ] Success/failure status recorded
- [ ] Next run scheduled (if successful)

## Validation Thresholds

Configure these thresholds based on your business needs:

- **Drift threshold**: 50% day-over-day change (flag for review)
- **Max retry attempts**: 3-5 attempts
- **Polling timeout**: 30-60 minutes
- **Backoff multiplier**: 2x (exponential)
- **Min row count**: 0 (allow zero sales days)
- **Max row count**: 1,000,000 (prevent data corruption)

## Validation Failure Actions

1. **Critical failures**: Stop workflow, send alert, log error
2. **Warnings**: Log warning, continue with defaults, flag in run log
3. **Data quality issues**: Flag in output, send notification, continue
4. **Retryable errors**: Retry with backoff, log attempt

## Audit Trail

All validations should be logged with:
- Timestamp
- Validation type
- Pass/fail status
- Details (values, thresholds, etc.)
- Action taken (if failed)
