import express from 'express'
import fs from 'fs/promises'

const app = express()
const PORT = 3000

app.use(express.json())

const FACTURES_FILE = './factures.json'


app.get('/api/factures', async (req, res) => {
    const data = await fs.readFile(FACTURES_FILE, 'utf-8')
    res.json(JSON.parse(data))
})

app.get('/api/factures/:id', async (req, res) => {
    const factures = JSON.parse(await fs.readFile(FACTURES_FILE, 'utf-8'))
    const facture = factures.find(f => f.id == req.params.id)
    if (!facture) return res.status(404).json({ error: 'Facture non trouvée' })
    res.json(facture)
})

app.post('/api/factures', async (req, res) => {
    const factures = JSON.parse(await fs.readFile(FACTURES_FILE, 'utf-8'))
    const newFacture = { id: Date.now(), ...req.body }
    factures.push(newFacture)
    await fs.writeFile(FACTURES_FILE, JSON.stringify(factures, null, 2))
    res.status(201).json(newFacture)
})

app.put('/api/factures/:id', async (req, res) => {
    try {
        const factures = JSON.parse(await fs.readFile(FACTURES_FILE, 'utf-8'))
        const id = parseInt(req.params.id)
        const idx = factures.findIndex(f => f.id === id)
        if (idx === -1) {
            return res.status(404).json({ error: 'Facture non trouvée' })
        }
        factures[idx] = { ...factures[idx], ...req.body }
        await fs.writeFile(FACTURES_FILE, JSON.stringify(factures, null, 2))
        res.json(factures[idx])
    } catch (e) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la facture' })
    }
})

app.delete('/api/factures/:id', async (req, res) => {
    const factures = JSON.parse(await fs.readFile(FACTURES_FILE, 'utf-8'))
    const idx = factures.findIndex(f => f.id == req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Facture non trouvée' })
    const deleted = factures.splice(idx, 1)
    await fs.writeFile(FACTURES_FILE, JSON.stringify(factures, null, 2))
    res.json({ message: 'Facture supprimée', deleted })
})

app.listen(PORT, () => {
    console.log(`Serveur prêt sur http://localhost:${PORT}`)
})
