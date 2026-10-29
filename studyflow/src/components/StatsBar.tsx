/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GoalStats } from '../types/goal';
import { CheckCircle2, Clock, PlayCircle, Target } from 'lucide-react';

interface StatsBarProps {
  stats: GoalStats;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  return (
    <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            Visão Geral dos Estudos
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Acompanhe seu ritmo de aprendizado e comemore cada meta concluída
          </p>
        </div>

        {/* Progresso Geral */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-500">Progresso Geral</span>
            <p className="text-sm font-bold text-slate-800">{stats.percentualConcluido}% concluído</p>
          </div>
          <div className="w-24 sm:w-32 bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${stats.percentualConcluido}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grade de estatísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
        {/* Total */}
        <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-100/80 text-indigo-700 flex items-center justify-center shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Total</span>
            <span className="text-lg font-bold text-slate-900">{stats.total}</span>
            <span className="text-[11px] text-slate-400 block -mt-0.5">
              {stats.total === 1 ? 'objetivo' : 'objetivos'}
            </span>
          </div>
        </div>

        {/* Não Iniciados */}
        <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-200/80 text-slate-700 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Não iniciados</span>
            <span className="text-lg font-bold text-slate-800">{stats.naoIniciado}</span>
            <span className="text-[11px] text-slate-400 block -mt-0.5">a começar</span>
          </div>
        </div>

        {/* Em Andamento */}
        <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0">
            <PlayCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Em andamento</span>
            <span className="text-lg font-bold text-amber-700">{stats.emAndamento}</span>
            <span className="text-[11px] text-slate-400 block -mt-0.5">estudando agora</span>
          </div>
        </div>

        {/* Concluídos */}
        <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Concluídos</span>
            <span className="text-lg font-bold text-emerald-700">{stats.concluido}</span>
            <span className="text-[11px] text-slate-400 block -mt-0.5">metas batidas</span>
          </div>
        </div>
      </div>
    </section>
  );
};
