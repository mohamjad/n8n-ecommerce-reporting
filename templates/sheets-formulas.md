# Google Sheets Formulas Reference

Common formulas used in the Multi-API E-commerce Reporting Dashboard.

## Sales Dashboard Formulas

### Summary Row (Row 2)

```excel
Total Orders: =SUM(E3:E)
Total Revenue: =SUM(F3:F)
Net Revenue: =SUM(G3:G)
Total Units: =SUM(H3:H)
Average Order Value: =AVERAGE(I3:I)
Refund Rate: =SUM(J3:J)/SUM(F3:F)*100
```

### Daily Totals (by Date)

```excel
=QUERY(Sales!A3:T,"SELECT A, SUM(E), SUM(F), SUM(G) WHERE A IS NOT NULL GROUP BY A ORDER BY A DESC")
```

### Marketplace Breakdown

```excel
=QUERY(Sales!A3:T,"SELECT B, SUM(E), SUM(F), SUM(G) WHERE B IS NOT NULL GROUP BY B")
```

### Top Accounts by Revenue

```excel
=QUERY(Sales!A3:T,"SELECT C, SUM(F) WHERE C IS NOT NULL GROUP BY C ORDER BY SUM(F) DESC LIMIT 10")
```

### Week-over-Week Growth

```excel
=IFERROR((SUMIF(A:A,TODAY()-7,F:F)-SUMIF(A:A,TODAY()-14,F:F))/SUMIF(A:A,TODAY()-14,F:F)*100,"N/A")
```

---

## Ads Dashboard Formulas

### Summary Row (Row 2)

```excel
Total Ad Spend: =SUM(E3:E)
Total Ad Sales: =SUM(F3:F)
Total Impressions: =SUM(H3:H)
Total Clicks: =SUM(I3:I)
Overall CTR: =SUM(I3:I)/SUM(H3:H)*100
Overall ACoS: =SUM(E3:E)/SUM(F3:F)*100
Overall ROAS: =SUM(F3:F)/SUM(E3:E)
Overall CPC: =SUM(E3:E)/SUM(I3:I)
```

### Campaign Type Breakdown

```excel
=QUERY(Ads!A3:U,"SELECT SUM(P), SUM(Q), SUM(R) WHERE P IS NOT NULL")
```

### ACoS by Marketplace

```excel
=QUERY(Ads!A3:U,"SELECT B, AVG(L) WHERE B IS NOT NULL GROUP BY B")
```

### Top Performing Campaigns (by ROAS)

```excel
=QUERY(Ads!A3:U,"SELECT B, N WHERE N IS NOT NULL ORDER BY N DESC LIMIT 10")
```

### Daily ACoS Trend

```excel
=QUERY(Ads!A3:U,"SELECT A, AVG(L) WHERE A IS NOT NULL GROUP BY A ORDER BY A DESC LIMIT 30")
```

---

## Calculated Metrics (Computed in Workflow)

These are computed by the n8n workflow, but can also be calculated in Sheets:

### ACoS
```excel
=IF(F3>0, E3/F3*100, 0)
```

### TACoS
```excel
=IF(INDIRECT("Sales!F"&ROW())>0, E3/INDIRECT("Sales!F"&ROW())*100, 0)
```

### CTR
```excel
=IF(H3>0, I3/H3*100, 0)
```

### CPC
```excel
=IF(I3>0, E3/I3, 0)
```

### ROAS
```excel
=IF(E3>0, F3/E3, 0)
```

### Conversion Rate
```excel
=IF(I3>0, G3/I3*100, 0)
```

---

## Run Logs Formulas

### Success Rate
```excel
=COUNTIF(E3:E,"SUCCESS")/COUNTA(E3:E)*100
```

### Average Duration
```excel
=AVERAGE(D3:D)
```

### Total Rows Written (Last 7 Days)
```excel
=SUMIF(A3:A,">="&TODAY()-7,H3:H)
```

### Failed Runs (Last 30 Days)
```excel
=COUNTIFS(A3:A,">="&TODAY()-30,E3:E,"FAILED")
```

### Last Successful Run
```excel
=MAXIFS(A3:A,E3:E,"SUCCESS")
```

---

## Data Validation Formulas

### Check for Duplicates
```excel
=COUNTIFS(A:A,A3,B:B,B3,C:C,C3)>1
```

### Validate Totals
```excel
=IF(G3>F3,"ERROR: Net > Gross","OK")
```

### Check Date Range
```excel
=IF(A3>TODAY(),"ERROR: Future Date","OK")
```

### Validate ACoS Range
```excel
=IF(AND(L3>=0,L3<=100),"OK","ERROR: ACoS out of range")
```

---

## Conditional Formatting Rules

### Sales Dashboard

**High Revenue Days** (Green):
- Range: F3:F
- Formula: `=F3>AVERAGE($F$3:$F$1000)*1.5`
- Format: Green background

**Low Revenue Days** (Red):
- Range: F3:F
- Formula: `=F3<AVERAGE($F$3:$F$1000)*0.5`
- Format: Red background

**High Refund Rate** (Yellow):
- Range: K3:K
- Formula: `=K3>5`
- Format: Yellow background

### Ads Dashboard

**High ACoS** (Red):
- Range: L3:L
- Formula: `=L3>30`
- Format: Red background

**Low ACoS** (Green):
- Range: L3:L
- Formula: `=L3<20`
- Format: Green background

**High ROAS** (Green):
- Range: N3:N
- Formula: `=N3>4`
- Format: Green background

**Low ROAS** (Red):
- Range: N3:N
- Formula: `=N3<2`
- Format: Red background

---

## Pivot Table Formulas

### Sales by Marketplace (Pivot)

```excel
=QUERY(Sales!A3:T,"SELECT B, SUM(E), SUM(F), SUM(G), AVG(I) WHERE B IS NOT NULL GROUP BY B")
```

### Ads Performance by Date (Pivot)

```excel
=QUERY(Ads!A3:U,"SELECT A, SUM(E), SUM(F), AVG(L), AVG(N) WHERE A IS NOT NULL GROUP BY A ORDER BY A DESC")
```

### Campaign Type Performance

```excel
=QUERY(Ads!A3:U,"SELECT 'SP' as Type, SUM(P) as Spend, SUM(F) as Sales WHERE P IS NOT NULL UNION ALL SELECT 'SB', SUM(Q), SUM(F) WHERE Q IS NOT NULL UNION ALL SELECT 'SD', SUM(R), SUM(F) WHERE R IS NOT NULL")
```

---

## Lookup Formulas

### Get Latest Data for Account

```excel
=INDEX(Sales!F:F,MATCH(MAXIFS(Sales!A:A,Sales!C:C,"A123456789"),Sales!A:A,0))
```

### Get ACoS for Date Range

```excel
=SUMIFS(Ads!E:E,Ads!A:A,">="&DATE(2026,2,1),Ads!A:A,"<="&DATE(2026,2,7))/SUMIFS(Ads!F:F,Ads!A:A,">="&DATE(2026,2,1),Ads!A:A,"<="&DATE(2026,2,7))*100
```

---

## Array Formulas

### Calculate Daily ACoS (Array)

```excel
=ARRAYFORMULA(IF(E3:E>0, E3:E/F3:F*100, 0))
```

### Calculate Daily ROAS (Array)

```excel
=ARRAYFORMULA(IF(E3:E>0, F3:E/E3:E, 0))
```

---

## Error Handling

### Safe Division

```excel
=IF(B3>0, A3/B3, 0)
```

### Handle Missing Data

```excel
=IFERROR(VLOOKUP(A3,Data!A:B,2,FALSE),"N/A")
```

### Validate Before Calculation

```excel
=IF(AND(ISNUMBER(E3),ISNUMBER(F3),F3>0), E3/F3*100, "")
```

---

## Date Formulas

### Get Yesterday (CST)

```excel
=TODAY()-1
```

### Get Last 7 Days Range

```excel
=TODAY()-7 & " to " & TODAY()-1
```

### Get Month-to-Date

```excel
=SUMIFS(F:F,A:A,">="&EOMONTH(TODAY(),-1)+1,A:A,"<="&TODAY())
```

---

## Notes

- All formulas assume data starts at Row 3 (Row 1 = headers, Row 2 = summary)
- Use absolute references ($) for fixed ranges
- Test formulas with sample data before deploying
- Consider performance for large datasets (use QUERY instead of multiple SUMIFs)
- Document custom formulas in Metadata tab
