# AI Coding Agent Instructions for variant-analysis-evo2

## Project Overview

**EVO2 Variant Analysis** is a full-stack application for predicting variant pathogenicity (disease-causing potential) in DNA sequences using the Evo2 large language model.

**Architecture:**

- **Backend** (`evo2-backend/`): Python FastAPI server deployed on Modal (H100 GPU serverless)
- **Frontend** (`evo2-frontend/`): Next.js 15 + React 19 with TypeScript, Tailwind CSS, Shadcn UI
- **Model**: Evo2 (Arc Institute) - genome LLM pre-trained on biological sequences

**Data Flow**: User searches/browses genes → Frontend fetches UCSC genome sequences & NCBI ClinVar variants → User inputs mutation → Frontend sends to Modal API → Evo2 scores reference vs. mutant sequence → Results displayed with confidence metrics.

---

## Key Files & Patterns

### Backend (Modal Deployment)

**`evo2-backend/main.py`** - Entrypoint for all backend logic:

- `VariantRequest` (Pydantic): `{variant_position, alternative, genome, chromosome}`
- `evo2_image`: Custom Docker image with CUDA 12.4, Evo2 repo (pinned commit), compiled vortex submodule
- `Evo2Model` class (Modal): H100 GPU, persistent model in memory across requests
  - `analyze_single_variant()`: FastAPI endpoint - fetches 8192bp genome window via UCSC API, computes delta_score, predicts pathogenicity
  - Model initialized once via `@modal.enter()` (efficient for request batching)
  - Uses `model.score_sequences()` to compare reference vs. alternative allele logits
  - Confidence: scale delta_score relative to learned threshold (-0.0009178519) and std devs

**`evo2-backend/evo2/`** - Submodule (Arc Institute repo):

- `evo2/models.py`: Evo2 class interface (load checkpoint, score_sequences, generate)
- `configs/evo2-*-*.yml`: Model configs (7b/40b, 1m/8k context window variants)
- `test/`: Validation of forward pass accuracy vs. expected metrics

**Important**: Evo2 model is loaded ONCE in `@modal.enter()` and reused across requests. Do NOT recreate model in request handler.

### Frontend (Next.js)

**`evo2-frontend/src/app/page.tsx`** - Main UI page:

- Genome selector (dropdown with available assemblies)
- Browse/Search tabs for genes
- GeneViewer component (displays selected gene, delegates to sub-components)

**`evo2-frontend/src/utils/genome-api.ts`** - External API integration:

- `getAvailableGenomes()`: UCSC API → list assemblies
- `searchGenes(symbol, genomeId)`: NCBI E-utilities → gene metadata + bounds
- `getGenomeSequence()`: UCSC API → fetch 8192bp window around position
- `searchClinvarVariants()`: NCBI E-utilities → known variants for gene
- `analyzeVariantWithAPI()`: POST to Modal endpoint → analysis result
- **Type-safe response parsing** (handle UCSC/NCBI JSON quirks)

**Key Types**:

- `ClinvarVariant`: clinvar ID, classification, location, optional evo2Result
- `AnalysisResult`: position, reference, alternative, delta_score, prediction, classification_confidence

**`evo2-frontend/src/components/`**:

- `gene-viewer.tsx`: Container managing selected gene state
- `variant-analysis.tsx`: Input form for custom mutations (position + alt base)
- `known-variants.tsx`: Display ClinVar variants, add Evo2 scores
- `variant-comparison-modal.tsx`: Side-by-side ClinVar vs. Evo2 prediction
- `gene-sequence.tsx`: Display reference sequence with nucleotide highlighting
- UI components (Button, Card, Input, Select, Table, Tabs): Shadcn components from `components/ui/`

**Environment Config** (`env.js`):

- `NEXT_PUBLIC_ANALYZE_SINGLE_VARIANT_BASE_URL`: Modal endpoint URL (must be set in `.env.local`)

**Styling Conventions**:

- Tailwind CSS with custom color scheme: `#3c4f3d` (forest green) + `#de8246` (orange accent)
- Shadcn components extend from `~/components/ui/`
- Path aliases: `~/` → `src/`

---

## Development Workflows

### Backend Setup & Deployment

```bash
cd evo2-backend
pip install -r requirements.txt
modal setup  # Authenticate with Modal
modal run main.py  # Test locally on Modal
modal deploy main.py  # Deploy to production
```

**Testing Model**:

```bash
cd evo2-backend/evo2
python test/test_evo2.py --model_name evo2_7b  # Validate forward pass
python test/test_evo2_generation.py  # Test sequence generation
```

**Key Modal Concepts**:

- `@app.function()`: Serverless function (runs once)
- `@app.cls()`: Persistent class with state (model loaded once)
- `@modal.enter()`: Initialization (runs when class starts)
- `@modal.fastapi_endpoint()`: Exposes as HTTP endpoint
- `volumes`: Persistent storage (HF model cache shared across requests)

### Frontend Development

```bash
cd evo2-frontend
npm i
npm run dev  # Start Next.js dev server (turbo mode)
npm run check  # Lint + typecheck
npm run format:write  # Auto-format with Prettier
```

**Required Environment**:

- Create `.env.local` with `NEXT_PUBLIC_ANALYZE_SINGLE_VARIANT_BASE_URL=<modal-endpoint>`
- Frontend makes direct HTTP calls to Modal (no CORS proxy needed)

---

## Critical Patterns & Conventions

### Variant Scoring Algorithm

**Location in code**: `evo2-backend/main.py` → `analyze_variant()` function

```python
# Reference sequence vs. mutant sequence
ref_score = model.score_sequences([window_seq])[0]
var_score = model.score_sequences([var_seq])[0]
delta_score = var_score - ref_score  # Negative = loss-of-function

# Classification thresholds
threshold = -0.0009178519
if delta_score < threshold:
    prediction = "Likely pathogenic"
    confidence = min(1.0, abs(delta_score - threshold) / lof_std)  # Scale by LoF std dev
else:
    prediction = "Likely benign"
    confidence = min(1.0, abs(delta_score - threshold) / func_std)  # Scale by functional std dev
```

**Key insight**: Confidence is NOT probability; it's distance from threshold scaled by empirical std dev. Variants near threshold have low confidence.

### Genome Window Extraction

**Location**: `evo2-backend/main.py` → `get_genome_sequence()`

- Always fetches 8192bp window (half-window = 4096bp on each side)
- UCSC API coordinates are 0-based: `start = position - 1 - half_window`
- Relative position in window (for mutation): `relative_pos = 4096 + (position - 1 - window_start)`
- **Error handling**: Check response status AND `"dna"` key in JSON (UCSC API returns errors as JSON)

### Frontend State Management

**Pattern**: Components manage local state with `useState`, no Redux/Zustand.

- Parent component (HomePage) holds genome/gene selection
- GeneViewer holds gene details, clinvar variants
- Child components (VariantAnalysis, KnownVariants) manage their own submission/loading states
- State passed down as props; callbacks passed up

**ClinVar variant mutation**: `updateClinvarVariant(id, newVariant)` callback updates array directly (immutable pattern).

### Type Safety (TypeScript)

- All API responses are typed (interfaces in `genome-api.ts`)
- Zod schema for environment variables (`env.js`)
- Strict mode enabled in `tsconfig.json` (`noUncheckedIndexedAccess`, `strict: true`)

---

## Common Developer Tasks

### Adding a New Prediction Model

1. Update `evo2-backend/evo2/evo2/utils.py` → `MODEL_NAMES` + `HF_MODEL_NAME_MAP` + `CONFIG_MAP`
2. In `Evo2Model.load_evo2_model()`, parameterize model name
3. Update threshold/std-dev calibration in `analyze_variant()` if needed
4. Add test case in `evo2-backend/evo2/test/test_evo2.py`

### Extending Known Variants Display

1. Modify `searchClinvarVariants()` in `genome-api.ts` to fetch additional fields
2. Update `ClinvarVariant` interface
3. Render new fields in `known-variants.tsx`

### Changing Scoring Thresholds

- Edit `evo2-backend/main.py` → `analyze_variant()` function
- Update `threshold`, `lof_std`, `func_std` based on validation data
- No frontend changes needed (backend returns prediction + confidence)

### Debugging API Integration

- Frontend: Check Network tab (DevTools) for POST to Modal endpoint, response status + JSON
- Backend: Modal logs available via `modal app logs variant-analysis-evo2`
- Test locally: `modal run main.py` then `curl -X POST <web_url> -H "Content-Type: application/json" -d '...'`

---

## Deployment & Environment

- **Frontend**: Deploy Next.js (Vercel, AWS Amplify, etc.)
- **Backend**: Deploy Modal function via `modal deploy main.py`
- **Frontend config**: Set `NEXT_PUBLIC_ANALYZE_SINGLE_VARIANT_BASE_URL` environment variable to deployed Modal endpoint

**Known Issues**:

- Evo2 model download (4B+ for evo2_40b) can timeout; Modal volume caches across deployments
- UCSC/NCBI APIs have rate limits; consider adding request caching in production
- GPU-accelerated inference on H100 takes ~5-10s per variant (model load amortized)

---

## External Dependencies & APIs

| Service                 | Usage                          | Limits                                            |
| ----------------------- | ------------------------------ | ------------------------------------------------- |
| UCSC Genome Browser API | Fetch reference sequences      | No auth, rate-limited                             |
| NCBI E-utilities        | Search genes, ClinVar variants | API key recommended (set in headers if available) |
| Hugging Face Hub        | Download Evo2 checkpoints      | Requires internet access, cached on Modal volume  |
| Modal                   | GPU compute, FastAPI hosting   | Free tier with limits; pro tier for production    |

---

## Questions for Code Review

- Confirm the 8192bp window size is appropriate for clinical variants
- Should delta_score be logged for future model calibration?
- Consider adding request rate limiting on Modal endpoint
