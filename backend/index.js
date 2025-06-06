import express from 'express'
import fs from 'fs/promises'
import cors from 'cors'

const app = express()
const PORT = 3000

app.use(express.json())
app.use(cors())

const FACTURES_FILE = './factures.json'
const CLIENTS_FILE = './clients.json'

// ============= ROUTES FACTURES =============
app.get('/api/factures', async (req, res) => {
    try {
        const data = await fs.readFile(FACTURES_FILE, 'utf-8')
        res.json(JSON.parse(data))
    } catch (error) {
        res.json([])
    }
})

app.get('/api/factures/:id', async (req, res) => {
    try {
        const factures = JSON.parse(await fs.readFile(FACTURES_FILE, 'utf-8'))
        const facture = factures.find(f => f.id == req.params.id)
        if (!facture) return res.status(404).json({ error: 'Facture non trouvée' })
        res.json(facture)
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

app.post('/api/factures', async (req, res) => {
    try {
        const factures = JSON.parse(await fs.readFile(FACTURES_FILE, 'utf-8').catch(() => '[]'))
        const newFacture = { id: Date.now(), ...req.body }
        factures.push(newFacture)
        await fs.writeFile(FACTURES_FILE, JSON.stringify(factures, null, 2))
        res.status(201).json(newFacture)
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création' })
    }
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
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour' })
    }
})

app.delete('/api/factures/:id', async (req, res) => {
    try {
        const factures = JSON.parse(await fs.readFile(FACTURES_FILE, 'utf-8'))
        const idx = factures.findIndex(f => f.id == req.params.id)
        if (idx === -1) return res.status(404).json({ error: 'Facture non trouvée' })
        factures.splice(idx, 1)
        await fs.writeFile(FACTURES_FILE, JSON.stringify(factures, null, 2))
        res.json({ message: 'Facture supprimée' })
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression' })
    }
})


// Routes clients (ajout simple)
app.get('/api/clients', async (req, res) => {
    try {
        const data = await fs.readFile(CLIENTS_FILE, 'utf-8')
        res.json(JSON.parse(data))
    } catch (error) {
        console.log('Fichier clients.json non trouvé, création avec données vides')
        res.json([])
    }
})












app.post('/api/clients', async (req, res) => {
    try {
        const clients = JSON.parse(await fs.readFile(CLIENTS_FILE, 'utf-8').catch(() => '[]'))


        const newClient = {
            id: Date.now(),
            ...req.body,
            dateCreation: req.body.dateCreation || new Date().toISOString()
        }
        clients.push(newClient)
        await fs.writeFile(CLIENTS_FILE, JSON.stringify(clients, null, 2))
        res.status(201).json(newClient)
    } catch (error) {
        console.error('Erreur création client:', error)
        res.status(500).json({ error: 'Erreur lors de la création du client' })
    }
})
































// Route de test
app.get('/api/test', (req, res) => {
    res.json({ message: 'API fonctionnelle', timestamp: new Date().toISOString() })
})


app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`)
    console.log(`📋 API Factures: http://localhost:${PORT}/api/factures`)
    console.log(`👥 API Clients: http://localhost:${PORT}/api/clients`)
})
