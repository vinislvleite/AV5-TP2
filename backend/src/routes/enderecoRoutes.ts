import { Router } from 'express'
import { buscarEndereco, salvarEndereco } from '../controllers/enderecoController'

const router = Router()

router.get('/clientes/:clienteId/endereco', buscarEndereco)
router.post('/clientes/:clienteId/endereco', salvarEndereco)

export default router
