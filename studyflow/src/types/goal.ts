/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GoalStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: string; // formato YYYY-MM-DD
  status: GoalStatus;
  createdAt: string; // ISO String
  updatedAt?: string;
}

export interface GoalFormData {
  title: string;
  description: string;
  deadline: string;
  status: GoalStatus;
}

export type GoalFilter = 'todos' | GoalStatus;

export interface GoalStats {
  total: number;
  naoIniciado: number;
  emAndamento: number;
  concluido: number;
  percentualConcluido: number;
}

export const STATUS_CONFIG: Record<
  GoalStatus,
  {
    label: string;
    description: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    dotColor: string;
  }
> = {
  nao_iniciado: {
    label: 'Não iniciado',
    description: 'Ainda aguardando para começar',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-200',
    dotColor: 'bg-slate-400',
  },
  em_andamento: {
    label: 'Em andamento',
    description: 'Você está estudando este tópico',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    dotColor: 'bg-amber-500',
  },
  concluido: {
    label: 'Concluído',
    description: 'Objetivo finalizado com sucesso!',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-200',
    dotColor: 'bg-emerald-500',
  },
};
