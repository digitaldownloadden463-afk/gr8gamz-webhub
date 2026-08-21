# Outreach review queue

This workflow never publishes externally. A draft requires a current community rule source, a specific public discussion, a GR8 GAMZ destination, transparent operator disclosure, and `approvalStatus: "pending"`.

Generate a local draft with:

```bash
pnpm run outreach:draft -- --input path/to/request.json
```

The request must contain `communityId`, `targetDiscussion`, `destination`, `campaign`, `content`, `proposedCopy`, and `operatorDisclosure`. Use `Ray, founder of GR8 GAMZ` where that disclosure is relevant. The generated review queue lives in `reports/` and is not submitted anywhere. Re-check the community's live rules immediately before any human-approved post.

Raw affiliate links, external destinations, unsolicited private messages, automatic approval and automatic submission are rejected.
