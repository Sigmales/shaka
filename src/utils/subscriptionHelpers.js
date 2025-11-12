export const PLAN_DETAILS = {
  free: {
    name: 'Gratuit',
    limit: '1-2 pronostics / jour',
    stats: 'Statistiques limitées'
  },
  standard: {
    name: 'Standard',
    limit: '5-7 pronostics / jour',
    stats: 'Statistiques de base'
  },
  vip: {
    name: 'VIP',
    limit: 'Accès illimité',
    stats: 'Statistiques avancées'
  },
  admin: {
    name: 'Admin',
    limit: 'Accès complet',
    stats: 'Statistiques avancées'
  }
}

export function getPlanLabel(type) {
  return PLAN_DETAILS[type]?.name ?? 'Gratuit'
}

export function getPlanBenefits(type) {
  return PLAN_DETAILS[type] ?? PLAN_DETAILS.free
}

