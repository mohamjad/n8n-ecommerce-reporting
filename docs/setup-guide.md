# Setup Guide

Complete setup instructions for the Multi-API E-commerce Reporting Automation workflow.

## Prerequisites

- n8n instance (self-hosted or cloud)
- Amazon SP-API access
- Amazon Ads API access
- Walmart Seller API access (optional)
- Walmart Ads API access (optional)
- Google Sheets API access
- Google Cloud Project with service account

---

## Step 1: API Credentials Setup

### Amazon SP-API

1. **Create IAM User**
   - Go to AWS IAM Console
   - Create user with programmatic access
   - Attach `AmazonSellingPartnerAPIReadOnly` policy

2. **Register Application**
   - Go to Seller Central → Apps & Services → Develop Apps
   - Create new application
   - Note down: Client ID, Client Secret, Refresh Token

3. **Configure in n8n**
   - Add credentials: Amazon SP-API OAuth2
   - Enter Client ID, Client Secret, Refresh Token
   - Test connection

### Amazon Ads API

1. **Create Application**
   - Go to Amazon Ads API portal
   - Register new application
   - Get Client ID and Client Secret

2. **OAuth Flow**
   - Authorize application
   - Get refresh token
   - Configure in n8n: Amazon Ads OAuth2

### Walmart APIs

1. **Seller API**
   - Go to Walmart Developer Portal
   - Create application
   - Get Client ID and Client Secret
   - Generate access token

2. **Ads API**
   - Similar process for Ads API
   - Store credentials securely

### Google Sheets API

1. **Create Service Account**
   - Go to Google Cloud Console
   - Create new project (or use existing)
   - Enable Google Sheets API
   - Create service account
   - Download JSON key file

2. **Share Sheet**
   - Create Google Sheet
   - Share with service account email (from JSON key)
   - Grant Editor permissions
   - Copy Sheet ID from URL

---

## Step 2: n8n Configuration

### Install Required Nodes

Ensure these nodes are available:
- HTTP Request (built-in)
- Code (built-in)
- Google Sheets (built-in)
- Cron Trigger (built-in)
- Wait (built-in)
- IF (built-in)

### Environment Variables

Set these in n8n environment variables:

```bash
GOOGLE_SHEETS_ID=your-sheet-id-here
AMAZON_SP_API_CLIENT_ID=your-client-id
AMAZON_SP_API_CLIENT_SECRET=your-client-secret
AMAZON_SP_API_REFRESH_TOKEN=your-refresh-token
AMAZON_ADS_CLIENT_ID=your-ads-client-id
AMAZON_ADS_CLIENT_SECRET=your-ads-client-secret
WALMART_ACCESS_TOKEN=your-walmart-token
WALMART_CLIENT_ID=your-walmart-client-id
```

### Credentials Setup

1. **Amazon SP-API OAuth2**
   - Type: OAuth2 API
   - Name: Amazon SP-API
   - Client ID: From environment variable
   - Client Secret: From environment variable
   - Access Token URL: `https://api.amazon.com/auth/o2/token`
   - Scope: `sellingpartnerapi::migration`

2. **Google Sheets OAuth2**
   - Type: Google Sheets OAuth2 API
   - Name: Google Sheets
   - Use service account JSON key
   - Or use OAuth2 flow for user account

---

## Step 3: Import Workflows

1. **Import Amazon Workflow**
   - Open n8n
   - Click "Import from File"
   - Select `workflows/amazon-sp-api-workflow.json`
   - Review and adjust node configurations

2. **Import Walmart Workflow** (if using)
   - Import `workflows/walmart-api-workflow.json`
   - Configure Walmart-specific credentials

3. **Verify Connections**
   - Check all nodes are connected correctly
   - Verify credentials are attached
   - Test individual nodes

---

## Step 4: Google Sheets Setup

1. **Create Sheet**
   - Create new Google Sheet
   - Name it "E-commerce Dashboard"

2. **Create Tabs**
   - Sales Dashboard
   - Ads Dashboard
   - Product Performance (optional)
   - Run Logs
   - Metadata

3. **Set Up Headers**
   - Copy headers from `templates/google-sheets-template.md`
   - Format header row (bold, colored background)
   - Freeze header row

4. **Add Formulas**
   - Copy summary formulas from `templates/sheets-formulas.md`
   - Add to Row 2 of each tab
   - Test formulas with sample data

5. **Configure Permissions**
   - Share with service account email
   - Grant Editor access
   - Copy Sheet ID from URL

---

## Step 5: Customize Workflow

### Update Account IDs

In normalization nodes, update:
- `account_id`: Your seller/ad account IDs
- `marketplace`: Default marketplace codes

### Adjust Date Logic

Verify timezone handling matches your needs:
- Default: CST/CDT
- Adjust if needed in "Timezone + Yesterday Window Builder" node

### Configure Report Types

Update report types based on your needs:
- Amazon SP-API: `GET_FLAT_FILE_ALL_ORDERS_DATA_BY_ORDER_DATE_GENERAL`
- Amazon Ads: Campaign performance reports
- Walmart: Item performance reports

### Set Retry Parameters

Adjust in backoff calculator nodes:
- `maxAttempts`: Default 10
- `baseWaitSeconds`: Default 30
- Max wait cap: 300 seconds (5 minutes)

---

## Step 6: Validation Setup

1. **Review Validation Checklist**
   - See `docs/validation-checklist.md`
   - Enable validation nodes in workflow
   - Set thresholds

2. **Configure Drift Alerts**
   - Set drift threshold (default: 50%)
   - Configure notification channels
   - Test alert delivery

---

## Step 7: Testing

### Test Individual Nodes

1. **Date Window Builder**
   - Run manually
   - Verify dates are correct
   - Check timezone handling

2. **API Calls**
   - Test report request nodes
   - Verify authentication works
   - Check response format

3. **Parsing**
   - Test with sample files
   - Verify TSV/JSON parsing
   - Check normalization

4. **Google Sheets Write**
   - Test write operation
   - Verify upsert logic
   - Check formatting

### Test Full Workflow

1. **Manual Execution**
   - Run workflow manually
   - Monitor execution
   - Check for errors

2. **Verify Output**
   - Check Google Sheets
   - Validate data accuracy
   - Review run logs

3. **Test Error Handling**
   - Simulate failures
   - Verify retries work
   - Check notifications

---

## Step 8: Schedule Workflows

1. **Set Cron Schedule**
   - Amazon workflow: 06:00 CST
   - Walmart workflow: 06:15 CST
   - Adjust based on your needs

2. **Enable Workflows**
   - Activate workflows in n8n
   - Verify cron triggers are active
   - Monitor first few runs

---

## Step 9: Monitoring Setup

1. **Run Logs**
   - Verify run logs are written
   - Check Run Logs tab in Sheets
   - Review execution times

2. **Notifications**
   - Configure email/Slack/webhook
   - Test failure notifications
   - Verify alert delivery

3. **Dashboards**
   - Set up monitoring dashboard
   - Track success rates
   - Monitor execution times

---

## Step 10: Documentation

1. **Update Configuration**
   - Document account IDs
   - Note API versions used
   - Record any customizations

2. **Create Runbook**
   - Document common issues
   - Create troubleshooting guide
   - Note escalation procedures

---

## Troubleshooting

### Common Issues

1. **Authentication Failures**
   - Check credentials are correct
   - Verify tokens aren't expired
   - Re-authenticate if needed

2. **Rate Limiting**
   - Reduce request frequency
   - Increase backoff times
   - Check API quotas

3. **Parsing Errors**
   - Verify file format matches expected
   - Check for API changes
   - Update parser if needed

4. **Sheets Write Failures**
   - Verify permissions
   - Check sheet ID is correct
   - Verify service account access

See `docs/troubleshooting-guide.md` for detailed solutions.

---

## Maintenance

### Regular Tasks

- **Weekly**: Review run logs, check for errors
- **Monthly**: Rotate API credentials, review data quality
- **Quarterly**: Update API versions, review workflow performance

### Updates

- Monitor API changes
- Update workflows as needed
- Test updates in staging first

---

## Support

For issues or questions:
1. Check troubleshooting guide
2. Review run logs
3. Test individual nodes
4. Consult API documentation

---

## Next Steps

After setup:
1. Monitor first few runs closely
2. Validate data accuracy
3. Adjust thresholds as needed
4. Set up additional dashboards
5. Document any customizations
