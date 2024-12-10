export function getStageColor(color: string) {
  switch (color) {
    case 'blue':
      return 'text-blue-600 dark:text-blue-400';
    case 'yellow':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'orange':
      return 'text-orange-600 dark:text-orange-400';
    case 'green':
      return 'text-emerald-600 dark:text-emerald-400';
    case 'red':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
}