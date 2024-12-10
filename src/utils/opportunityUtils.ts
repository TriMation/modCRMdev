export function getStageColor(stage: string) {
  switch (stage.toLowerCase()) {
    case 'prospecting':
      return 'bg-blue-200 dark:bg-blue-900/50';
    case 'qualification':
      return 'bg-yellow-200 dark:bg-yellow-900/50';
    case 'proposal':
      return 'bg-orange-200 dark:bg-orange-900/50';
    case 'negotiation':
      return 'bg-purple-200 dark:bg-purple-900/50';
    case 'closed won':
      return 'bg-emerald-200 dark:bg-emerald-900/50';
    case 'closed lost':
      return 'bg-red-200 dark:bg-red-900/50';
    default:
      return 'bg-gray-200 dark:bg-gray-900/50';
  }
}

export function getStageColors() {
  return {
    'Prospecting': 'bg-blue-200 dark:bg-blue-900/50',
    'Qualification': 'bg-yellow-200 dark:bg-yellow-900/50',
    'Proposal': 'bg-orange-200 dark:bg-orange-900/50',
    'Negotiation': 'bg-purple-200 dark:bg-purple-900/50',
    'Closed Won': 'bg-emerald-200 dark:bg-emerald-900/50',
    'Closed Lost': 'bg-red-200 dark:bg-red-900/50'
  };
}