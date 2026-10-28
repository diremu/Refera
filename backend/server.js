import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { googleSearch } from './google.js'
import bodleianSearch from './bodleian.js'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

const adapters = {
  'Google Scholar': googleSearch,
  'Bodleian Library': bodleianSearch,
}

app.post('/search', async (req, res) => {
  const form = req.body

  if (!form.searchStr?.trim()) {
    return res.status(400).json({ error: 'searchStr is required' })
  }

  const selected = adapters[form.source] ? [form.source] : Object.keys(adapters)

  const settled = await Promise.allSettled(
    selected.map(name => adapters[name](form))
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