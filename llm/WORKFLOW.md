# RoadChal Backend Workflow Setup

## 1. Prerequisites

1. Python 3.11+
2. Virtual environment created and activated
3. Supabase project with valid keys
4. WhatsApp relay service running at `http://localhost:8001/send`

Install dependencies:

```bash
pip install -r requirements.txt
```

## 2. Environment Variables

Create/update `.env` in project root:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key_or_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key
```

`components/supabase_setup.py` loads these values automatically.

## 3. Create Supabase Table

Run this SQL in Supabase SQL Editor:

`migrations/create_journeyDetails_table.sql`

This creates:

- `journeyDetails` table
- `idx_journey_username` index

## 4. Register Router in FastAPI App

Your FastAPI app must include the `llm` router.

In `server.py`, ensure:

```python
from llm import router as stark_router

app.include_router(stark_router)
```

Without this, `/stark/` and `/stark/confirm/{journey_id}` will not exist.

## 5. Start Backend

```bash
uvicorn server:app --reload --host 0.0.0.0 --port 6767
```

## 6. Message Flow

### Step A: User says hi

WhatsApp backend forwards payload to `POST /stark/`:

```json
{
  "message": "hi",
  "username": "alice",
  "latitude": 18.5204,
  "longitude": 73.8567
}
```

Backend sends WhatsApp reply:

`hello, where would you wanna go`

### Step B: User sends destination

WhatsApp backend again calls `POST /stark/`:

```json
{
  "message": "talegaon supermarket",
  "username": "alice",
  "latitude": 18.5204,
  "longitude": 73.8567
}
```

Backend actions:

1. Extract destination (LLM placeholder)
2. Create `journey_id`
3. Save initial record in `journeyDetails` with `state=start`
4. Find nearest metro using Overpass + haversine
5. Compare direct vs metro route
6. Request ride option from booking placeholder
7. Send WhatsApp confirmation prompt

Response includes `journey_id`.

### Step C: User replies YES

WhatsApp service calls:

`POST /stark/confirm/{journey_id}?username=alice`

Backend actions:

1. Confirm booking
2. Update state to `intransit1`
3. Send confirmation message
4. Start async tracking workflow

## 7. Async Journey Lifecycle

State progression:

1. `start`
2. `intransit1`
3. `mid` (metro reached, QR ticket sent)
4. `intransit2` (final ride started)
5. `end` (journey complete)

For each state change, backend does both:

1. Update `journeyDetails` in Supabase
2. Send WhatsApp progress message

## 8. Troubleshooting

If you get:

`Supabase table 'journeyDetails' was not found`

Run:

`migrations/create_journeyDetails_table.sql`

If WhatsApp messages are not sent:

1. Verify `WHATSAPP_API` in `llm.py` (`http://localhost:8001/send`)
2. Confirm WhatsApp relay service is running
