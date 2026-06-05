import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import clienteRoutes from './src/routes/clienteRoutes'
import documentoRoutes from './src/routes/documentoRoutes'
import enderecoRoutes from './src/routes/enderecoRoutes'
import acomodacaoRoutes from './src/routes/acomodacaoRoutes'

const app = express()
const PORT = process.env.PORT || 3333

app.use(cors())
app.use(express.json())

// Rotas
app.use('/api/clientes', clienteRoutes)
app.use('/api', documentoRoutes)
app.use('/api', enderecoRoutes)
app.use('/api/acomodacoes', acomodacaoRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', sistema: 'Atlantis' })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor Atlantis rodando na porta ${PORT}`)
})
