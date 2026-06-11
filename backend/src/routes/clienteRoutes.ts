import { Router } from 'express'
import {
  listarTitulares, buscarTitular, cadastrarTitular, editarTitular, excluirTitular,
  listarTodosDependentes, listarDependentesPorTitular, buscarTitularPorDependente,
  cadastrarDependente, editarDependente, excluirDependente,
  listarAcomodados,
} from '../controllers/clienteController'

const router = Router()

router.get('/titulares', listarTitulares)
router.get('/titulares/:id', buscarTitular)
router.post('/titulares', cadastrarTitular)
router.put('/titulares/:id', editarTitular)
router.delete('/titulares/:id', excluirTitular)

router.get('/dependentes', listarTodosDependentes)
router.get('/titulares/:titularId/dependentes', listarDependentesPorTitular)
router.get('/dependentes/:dependenteId/titular', buscarTitularPorDependente)
router.post('/titulares/:titularId/dependentes', cadastrarDependente)
router.put('/titulares/:titularId/dependentes/:dependenteId', editarDependente)
router.delete('/titulares/:titularId/dependentes/:dependenteId', excluirDependente)

router.get('/acomodados', listarAcomodados)

export default router
