import { Router } from 'express'
import {
  listarAcomodacoes, buscarAcomodacao, criarAcomodacao,
  vincularAcomodacao, cancelarAcomodacao, excluirAcomodacao,
} from '../controllers/acomodacaoController'

const router = Router()

router.get('/', listarAcomodacoes)
router.get('/:id', buscarAcomodacao)
router.post('/', criarAcomodacao)
router.patch('/vincular', vincularAcomodacao)
router.patch('/cancelar', cancelarAcomodacao)
router.delete('/:id', excluirAcomodacao)

export default router
