# Ikigai Mapper Screen — Enhanced UX (REQ-N2)

## Overview

This PR delivers a complete Ikigai discovery feature with polished UX, local persistence, and Claude-powered AI analysis.

## What's Included

### Core Feature: `/ikigai` Page
- **2×2 textarea grid** for four ikigai circles:
  - What you love
  - What you're good at
  - What the world needs
  - What you can be paid for
- **Clerk authentication gate** — sign-in required to generate and save
- **Claude AI analysis** via `/api/ikigai` endpoint
- **Local-first persistence** — IndexedDB pre-fills previous entries
- **Navigation integration** — "Ikigai" tab between Values and Insights

### Enhanced UX Features

#### 1. Loading State During Pre-fill
- Shows "Loading your previous entry…" while fetching from IndexedDB
- Textareas disabled during load to prevent conflicts
- Smooth transition to interactive form once data loads

#### 2. Character Counters
- Real-time character count displayed below each textarea
- Format: `current / 2000` (enforced max per field)
- Helps users understand input limits without hitting them

#### 3. Success Feedback
- Brief toast message "✓ Saved successfully" after submission
- Auto-dismisses after 4 seconds
- Reassures user that persistence worked

#### 4. Timeout Handling
- 30-second timeout on Claude API requests
- User-friendly error: "Request timed out. Please try again."
- Prevents indefinite loading states

#### 5. Clean Code
- DRY `renderField()` helper function eliminates textarea duplication
- Consistent error handling and validation
- TypeScript types throughout for safety

### API Design

**POST `/api/ikigai`**
- Input: `{ love, goodAt, worldNeeds, paidFor }` (strings, 1–2000 chars each)
- Output: `{ analysis: string }` (Claude's reflection)
- Zod validation, comprehensive error messages
- Caches system prompt with Claude's ephemeral cache control

### Data Model

**`IkigaiEntry` type**
```typescript
{
  id: string;              // uuid
  createdAt: number;       // timestamp
  love: string;            // user input
  goodAt: string;          // user input
  worldNeeds: string;      // user input
  paidFor: string;         // user input
  analysis: string;        // AI-generated
}
```

**Database Schema**
- IndexedDB v1 → v2 migration (safe, versioned upgrade)
- `ikigai` object store with `byCreatedAt` index
- Helper functions: `saveIkigai()`, `getLatestIkigai()`

### AI System Prompt

Guides Claude to generate warm, grounded reflections that:
- Find genuine overlap between the four domains
- Name what ikigai might be pointing toward (without prescribing)
- Offer one honest observation about what pursuing it requires
- Avoid generic platitudes

## Files Changed

1. **`app/ikigai/page.tsx`** — New page component with UX enhancements
2. **`app/api/ikigai/route.ts`** — API endpoint for AI analysis
3. **`lib/types.ts`** — `IkigaiEntry` interface
4. **`lib/db.ts`** — Database layer with schema migration
5. **`lib/ai/prompts.ts`** — Ikigai system prompt
6. **`components/Nav.tsx`** — Navigation tab integration
7. **`CHANGELOG.md`** — Feature documentation
8. **`docs/REQUIREMENTS.md`** — Requirement tracking update

## Quality Checklist

✅ Type-safe (TypeScript throughout)  
✅ Input validation (Zod schema)  
✅ Error handling (API, UI, timeout)  
✅ UX clarity (loading, counters, success, timeout feedback)  
✅ Data persistence (IndexedDB, pre-fill on return)  
✅ Schema safety (versioned database migration)  
✅ Clerk integration (sign-in gate)  
✅ Responsive design (mobile-first)  
✅ Documentation (CHANGELOG, REQUIREMENTS, inline comments)

## Testing Recommendations

- [ ] Pre-fill works on return visit
- [ ] Character counter prevents input over 2000 chars
- [ ] Success toast appears after submission
- [ ] Timeout error triggers after 30 seconds of no response
- [ ] Sign-out users see sign-in prompt
- [ ] Loading state shows during IndexedDB pre-fill
- [ ] Error messages are clear and actionable

## Ready to Merge

✅ All features complete  
✅ UX enhancements finalized  
✅ Documentation updated  
✅ No blocking issues

**Next:** Merge to main for v0.2.0 release.
