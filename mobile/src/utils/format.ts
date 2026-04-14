export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  });
}

export function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR');
  } catch {
    return iso;
  }
}

export function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return iso;
  }
}

const statusLabels = {
  planning: 'Planejamento',
  in_progress: 'Em andamento',
  paused: 'Pausada',
  completed: 'Concluída',
  pending: 'Pendente',
} as const;

export function workStatusLabel(status: string): string {
  return (statusLabels as Record<string, string>)[status] ?? status;
}

export function riskLabel(risk: string): string {
  return { low: 'Baixo', medium: 'Médio', high: 'Alto' }[risk] ?? risk;
}
