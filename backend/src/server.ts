import express from 'express'
import cors from 'cors'
import 'dotenv/config'

//erick santos champions

import clienteRoutes from './routes/clienteRoutes'
import documentoRoutes from './routes/documentoRoutes'
import enderecoRoutes from './routes/enderecoRoutes'
import acomodacaoRoutes from './routes/acomodacaoRoutes'

const app = express()
const PORT = process.env.PORT || 3333

app.use(cors())
app.use(express.json())

app.use('/api/clientes', clienteRoutes)
app.use('/api', documentoRoutes)
app.use('/api', enderecoRoutes)
app.use('/api/acomodacoes', acomodacaoRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', sistema: 'Atlantis' })
})

app.listen(PORT, () => {
  console.log(`Servidor Atlantis rodando na porta ${PORT}`)
})
