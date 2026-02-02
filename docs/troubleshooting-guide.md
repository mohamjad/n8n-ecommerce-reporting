# Troubleshooting Guide

Common failure modes and solutions for the Multi-API E-commerce Reporting Automation workflow.

## Authentication Failures

### Symptom: "401 Unauthorized" or "403 Forbidden" errors

**Causes:**
- Expired API tokens
- Invalid credentials
- OAuth token refresh failure
- Missing required scopes

**Solutions:**
1. Check token expiration dates in n8n credentials
2. Verify API credentials are correct
3. Re-authenticate OAuth flows (Amazon Ads, Google Sheets)
4. Ensure required API scopes are granted
5. Check if credentials were rotated/changed

**Prevention:**
- Implement automatic token refresh before expiration
- Monitor token expiration dates
- Set up alerts for auth failures

---

## Rate Limiting (429 Errors)

### Symptom: "429 Too Many Requests" errors, workflow slows down

**Causes:**
- Too many concurrent API calls
- Exceeding API rate limits
- Rapid retry attempts

**Solutions:**
1. Implement exponential backoff (already in workflow)
2. Reduce concurrent requests
3. Add delays between API calls
4. Check API rate limit documentation
5. Use request throttling

**Prevention:**
- Monitor API rate limit headers
- Implement request queuing
- Spread requests across time windows
- Cache responses when possible

---

## Report Generation Delays

### Symptom: Reports not ready after polling timeout

**Causes:**
- High API load during peak times
- Large date ranges
- Complex report types
- Platform maintenance

**Solutions:**
1. Increase polling timeout (30-60 minutes)
2. Reduce date range if possible
3. Check platform status pages
4. Retry report request
5. Use simpler report types if available

**Prevention:**
- Schedule runs during off-peak hours
- Monitor platform status
- Set appropriate timeout values
- Log report generation times

---

## Parsing Errors

### Symptom: "Failed to parse TSV/JSON" or "Unexpected format" errors

**Causes:**
- File format changed by API
- Corrupted download
- GZIP decompression failure
- Encoding issues
- Missing expected columns

**Solutions:**
1. Verify file format matches expected type
2. Check file size (should be > 0 bytes)
3. Manually inspect downloaded file
4. Update parser to handle new formats
5. Add format detection fallbacks
6. Check for encoding issues (UTF-8 vs other)

**Prevention:**
- Validate file format before parsing
- Add format version checks
- Monitor for API changes
- Test parser with sample files

---

## Missing Fields

### Symptom: Required fields are null or missing in output

**Causes:**
- API doesn't return field for this marketplace
- Field name changed in API
- Report type doesn't include field
- Data not available for date range

**Solutions:**
1. Check API documentation for field availability
2. Use safe defaults (0 for numbers, null for optional)
3. Update field mappings
4. Document missing fields in run logs
5. Verify report type includes required fields

**Prevention:**
- Validate required fields before processing
- Use schema validation
- Document field availability by marketplace
- Set up alerts for missing critical fields

---

## Data Quality Issues

### Symptom: Totals don't match, negative values, impossible ratios

**Causes:**
- Data corruption during download
- API returning incorrect data
- Timezone misalignment
- Attribution window differences
- Settlement delays

**Solutions:**
1. Validate totals against platform console
2. Check timezone handling (CST/CDT)
3. Verify attribution windows match
4. Compare to previous days
5. Flag suspicious values for review
6. Check for data type mismatches

**Prevention:**
- Implement reconciliation checks
- Compare to previous periods
- Validate business rules (e.g., clicks <= impressions)
- Set up drift alerts
- Document known discrepancies

---

## Google Sheets Write Failures

### Symptom: "Failed to write to Sheets" or "Permission denied"

**Causes:**
- Google Sheets API quota exceeded
- Invalid sheet ID or range
- Insufficient permissions
- Sheet is locked/read-only
- Network issues

**Solutions:**
1. Verify Google Sheets API credentials
2. Check sheet permissions (service account access)
3. Verify sheet ID and range are correct
4. Check API quota limits
5. Retry with exponential backoff
6. Verify sheet isn't locked by another user

**Prevention:**
- Use service account with proper permissions
- Monitor API quota usage
- Validate sheet IDs before writing
- Implement retry logic
- Use batch writes for efficiency

---

## Timezone Issues

### Symptom: Data appears on wrong date, gaps or overlaps

**Causes:**
- DST transition not handled
- Wrong timezone used for date calculations
- API returns UTC but workflow uses CST
- Date boundaries misaligned

**Solutions:**
1. Use timezone-aware date libraries
2. Explicitly convert to CST/CDT
3. Handle DST transitions explicitly
4. Verify date boundaries match API expectations
5. Log timezone conversions for debugging

**Prevention:**
- Always use CST/CDT for date calculations
- Test DST transition dates
- Document timezone handling
- Use consistent timezone throughout workflow

---

## Idempotency Failures

### Symptom: Duplicate rows in Google Sheets

**Causes:**
- Upsert logic not working
- Unique key mismatch
- Workflow rerun without deduplication
- Concurrent runs

**Solutions:**
1. Verify upsert uses correct unique key (date, account_id, marketplace)
2. Check for existing rows before insert
3. Use UPDATE instead of INSERT when exists
4. Prevent concurrent runs (use locks/flags)
5. Clean up duplicates manually if needed

**Prevention:**
- Implement proper upsert logic
- Use unique constraints in Sheets
- Add run locks to prevent concurrent execution
- Test idempotency with reruns

---

## Memory/Performance Issues

### Symptom: Workflow times out, slow execution, memory errors

**Causes:**
- Large report files
- Too much data in memory
- Inefficient parsing
- Multiple large files processed simultaneously

**Solutions:**
1. Process files in chunks
2. Stream parsing instead of loading entire file
3. Increase n8n memory limits
4. Process reports sequentially instead of parallel
5. Optimize parsing logic
6. Use batch processing

**Prevention:**
- Monitor memory usage
- Optimize data processing
- Use streaming parsers for large files
- Set appropriate timeout values
- Test with large datasets

---

## Notification Failures

### Symptom: Alerts not sent on failures

**Causes:**
- Webhook URL incorrect
- Email service unavailable
- Slack token expired
- Notification node failed silently

**Solutions:**
1. Verify webhook URLs are correct
2. Test notification channels independently
3. Check email/Slack credentials
4. Add error handling to notification nodes
5. Use fallback notification methods
6. Log notification attempts

**Prevention:**
- Test notifications regularly
- Use multiple notification channels
- Monitor notification success rates
- Set up notification health checks

---

## Run Logging Issues

### Symptom: Missing run logs, incomplete audit trail

**Causes:**
- Logging node failed
- Database/Sheets write failed
- Run ID not generated
- Logging disabled

**Solutions:**
1. Verify logging nodes are enabled
2. Check database/Sheets write permissions
3. Ensure run ID is generated early
4. Add error handling to logging
5. Use fallback logging (file/console)

**Prevention:**
- Make logging non-blocking
- Use multiple logging targets
- Validate logging success
- Regular audit of logs

---

## Debugging Tips

1. **Enable Debug Mode**: Turn on n8n execution data to see node outputs
2. **Check Node Execution Data**: Inspect data at each node to find where it fails
3. **Review Run Logs**: Check run logs for patterns in failures
4. **Test Individual Nodes**: Test API calls, parsing, and writes independently
5. **Use Sample Data**: Test with known-good sample files
6. **Monitor API Status**: Check platform status pages for outages
7. **Compare to Console**: Validate against platform dashboards
8. **Check Timezones**: Verify all dates are in correct timezone
9. **Validate Credentials**: Regularly rotate and test credentials
10. **Document Changes**: Keep changelog of API/workflow changes

---

## Getting Help

If issues persist:

1. Check n8n execution logs for detailed error messages
2. Review API documentation for changes
3. Test API calls manually (Postman/curl)
4. Compare workflow to known-good previous versions
5. Check platform status pages
6. Review run logs for patterns
7. Contact API support if platform-specific issues

---

## Prevention Checklist

- [ ] Regular credential rotation and testing
- [ ] Monitor API rate limits and quotas
- [ ] Test workflow after API updates
- [ ] Validate data quality regularly
- [ ] Review run logs weekly
- [ ] Test DST transitions
- [ ] Keep documentation updated
- [ ] Set up proactive alerts
- [ ] Regular backup of workflows
- [ ] Test disaster recovery procedures
