import { Router } from 'express'
import { listarDocumentosCliente, cadastrarDocumento, excluirDocumento, editarDocumento } from '../controllers/documentoController'

const router = Router()

router.get('/clientes/:clienteId/documentos', listarDocumentosCliente)
router.put('/documentos/:id',editarDocumento)
router.post('/clientes/:clienteId/documentos', cadastrarDocumento)
router.delete('/documentos/:id', excluirDocumento)

export default router
