import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { googleSearch } from './google.js'
import bodleianSearch from './bodleian.js'
import {openAlexSearch} from './openalex.js'
import { makeKey, cached } from './cache.js'
import rateLimit from 'express-rate-limit'

const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many searches. Wait a minute and try again." },
  skipFailedRequests: true
});

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

let day = new Date().toDateString();
let used = 0;
const DAILY_CAP = Number(process.env.SERPAPI_DAILY_CAP ?? 30);

function spendSerpCall() {
  const today = new Date().toDateString();
  if (today !== day) { day = today; used = 0; }
  if (used >= DAILY_CAP) throw new Error("Google Scholar daily search limit reached");
  used++;
}

const adapters = {
  "Google Scholar": (form) => { spendSerpCall(); return googleSearch(form); },
  "Bodleian Library": bodleianSearch,
  "OpenAlex": openAlexSearch,
};
app.post('/search', searchLimiter, async (req, res) => {
  const form = req.body

  if (!form.searchStr?.trim()) {
    return res.status(400).json({ error: 'searchStr is required' })
  }

  const selected = adapters[form.source] ? [form.source] : Object.keys(adapters)

  const settled = await Promise.allSettled(
    selected.map(name => cached(makeKey(name, form), () => adapters[name](form)))
  )

  const results = settled
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value)

  const errors = settled
    .map((r, i) => r.status === 'rejected'
      ? { source: selected[i], message: r.reason.message }
      : null)
    .filter(Boolean)

  if (results.length === 0 && errors.length > 0) {
    return res.status(502).json({ error: 'All sources failed', errors })
  }

  res.json({ results, errors })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`API running on ${PORT}`))