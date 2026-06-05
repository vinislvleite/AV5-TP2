import { Router } from 'express'
import { listarDocumentosCliente, cadastrarDocumento, excluirDocumento } from '../controllers/documentoController'

const router = Router()

router.get('/clientes/:clienteId/documentos', listarDocumentosCliente)
router.post('/clientes/:clienteId/documentos', cadastrarDocumento)
router.delete('/documentos/:id', excluirDocumento)

export default router
