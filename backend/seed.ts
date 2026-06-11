import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed...')

  await prisma.acomodacao.deleteMany()

  await prisma.acomodacao.createMany({
    data: [
      { nome: 'CASAL_SIMPLES',   camaSolteiro: 0, camaCasal: 1, suite: 1, climatizacao: true, garagem: 1 },
      { nome: 'FAMILIA_SIMPLES', camaSolteiro: 2, camaCasal: 1, suite: 1, climatizacao: true, garagem: 1 },
      { nome: 'FAMILIA_MAIS',    camaSolteiro: 5, camaCasal: 1, suite: 2, climatizacao: true, garagem: 2 },
      { nome: 'FAMILIA_SUPER',   camaSolteiro: 6, camaCasal: 2, suite: 3, climatizacao: true, garagem: 2 },
      { nome: 'SOLTEIRO_SIMPLES',camaSolteiro: 1, camaCasal: 0, suite: 1, climatizacao: true, garagem: 0 },
      { nome: 'SOLTEIRO_MAIS',   camaSolteiro: 0, camaCasal: 1, suite: 1, climatizacao: true, garagem: 1 },
    ],
  })

  console.log('6 acomodações criadas!')
  console.log('Seed concluído!')
}

main()
  .catch(e => { console.error('Erro no seed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())