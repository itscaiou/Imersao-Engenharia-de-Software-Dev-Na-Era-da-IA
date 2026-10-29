/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  PlayCircle,
  Pencil,
  Trash2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { Goal, GoalStatus, STATUS_CONFIG } from '../types/goal';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDeleteRequest: (goal: Goal) => void;
  onStatusChange: (id: string, newStatus: GoalStatus) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDeleteRequest,
  onStatusChange,
}) => {
  const statusInfo = STATUS_CONFIG[goal.status];

  // Cálculo da situação do prazo
  const getDeadlineStatus = () => {
    if (!goal.deadline) return null;

    // Normaliza datas para meia-noite para comparação exata de dias
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [year, month, day] = goal.deadline.split('-').map(Number);
    const deadlineDate = new Date(year, month - 1, day);
    deadlineDate.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Formatação em português
    const formattedDate = deadlineDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    if (goal.status === 'concluido') {
      return {
        label: `Prazo: ${formattedDate}`,
        urgent: false,
        badgeText: 'Concluído no prazo',
      };
    }

    if (diffDays < 0) {
      return {
        label: `Venceu em ${formattedDate}`,
        urgent: true,
        badgeText: `${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? 'dia' : 'dias'} em atraso`,
        overdue: true,
      };
    }

    if (diffDays === 0) {
      return {
        label: `Vence hoje (${formattedDate})`,
        urgent: true,
        badgeText: 'Vence hoje!',
        today: true,
      };
    }

    if (diffDays <= 3) {
      return {
        label: `Prazo: ${formattedDate}`,
        urgent: false,
        badgeText: `Faltam ${diffDays} dias`,
      };
    }

    return {
      label: `Prazo: ${formattedDate}`,
      urgent: false,
      badgeText: null,
    };
  };

  const deadlineInfo = getDeadlineStatus();

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between ${
        goal.status === 'concluido'
          ? 'border-emerald-200/90 bg-emerald-50/15 shadow-2xs'
          : 'border-slate-200/90 hover:border-indigo-200 hover:shadow-sm'
      }`}
    >
      <div>
        {/* Barra superior do card: Status e Troca Rápida */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${statusInfo.badgeBg} ${statusInfo.badgeText} ${statusInfo.badgeBorder}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`} />
              {statusInfo.label}
            </span>

            {/* Aviso de Prazo Atrasado ou Vence Hoje */}
            {deadlineInfo?.overdue && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-lg">
                <AlertTriangle className="w-3 h-3 text-rose-500" />
                {deadlineInfo.badgeText}
              </span>
            )}
            {deadlineInfo?.today && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                <Clock className="w-3 h-3 text-amber-600" />
                {deadlineInfo.badgeText}
              </span>
            )}
          </div>

          {/* Seletor rápido de Status */}
          <div className="relative">
            <select
              value={goal.status}
              onChange={(e) => onStatusChange(goal.id, e.target.value as GoalStatus)}
              className="text-[11px] font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 outline-none cursor-pointer transition-colors"
              title="Alterar status deste objetivo"
            >
              <option value="nao_iniciado">Não iniciado</option>
              <option value="em_andamento">Em andamento</option>
              <option value="concluido">Concluído</option>
            </select>
          </div>
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`text-base font-bold text-slate-900 leading-snug break-words ${
            goal.status === 'concluido' ? 'line-through text-slate-500' : ''
          }`}
        >
          {goal.title}
        </h3>

        {/* Descrição do Objetivo */}
        {goal.description ? (
          <p
            className={`mt-2 text-xs leading-relaxed break-words line-clamp-4 ${
              goal.status === 'concluido' ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {goal.description}
          </p>
        ) : (
          <p className="mt-2 text-xs italic text-slate-400">Sem descrição adicional informada.</p>
        )}
      </div>

      {/* Rodapé do Card: Prazo e Botões de Ação */}
      <div className="mt-5 pt-3.5 border-t border-slate-100/90 flex flex-wrap items-center justify-between gap-3">
        {/* Prazo */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{deadlineInfo?.label}</span>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center gap-1">
          {/* Ação rápida de concluir / reabrir */}
          {goal.status !== 'concluido' ? (
            <button
              type="button"
              onClick={() => onStatusChange(goal.id, 'concluido')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
              title="Marcar como concluído"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Concluir</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onStatusChange(goal.id, 'em_andamento')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Reabrir meta para em andamento"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reabrir</span>
            </button>
          )}

          {/* Editar */}
          <button
            type="button"
            onClick={() => onEdit(goal)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Editar objetivo"
            title="Editar objetivo"
          >
            <Pencil className="w-4 h-4" />
          </button>

          {/* Excluir (chama a confirmação) */}
          <button
            type="button"
            onClick={() => onDeleteRequest(goal)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            aria-label="Excluir objetivo"
            title="Excluir objetivo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
