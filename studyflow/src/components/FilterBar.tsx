/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { GoalFilter, GoalStats } from '../types/goal';

interface FilterBarProps {
  currentFilter: GoalFilter;
  onFilterChange: (filter: GoalFilter) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  stats: GoalStats;
  sortBy: 'prazo_asc' | 'recentes';
  onSortChange: (sort: 'prazo_asc' | 'recentes') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentFilter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  stats,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Abas funcionais de filtro por Status */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-xl overflow-x-auto">
        <button
          type="button"
          onClick={() => onFilterChange('todos')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            currentFilter === 'todos'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Todos ({stats.total})
        </button>

        <button
          type="button"
          onClick={() => onFilterChange('nao_iniciado')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            currentFilter === 'nao_iniciado'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Não iniciados ({stats.naoIniciado})
        </button>

        <button
          type="button"
          onClick={() => onFilterChange('em_andamento')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            currentFilter === 'em_andamento'
              ? 'bg-white text-amber-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Em andamento ({stats.emAndamento})
        </button>

        <button
          type="button"
          onClick={() => onFilterChange('concluido')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            currentFilter === 'concluido'
              ? 'bg-white text-emerald-800 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Concluídos ({stats.concluido})
        </button>
      </div>

      {/* Busca e Ordenação */}
      <div className="flex items-center gap-2">
        {/* Campo de Busca */}
        <div className="relative flex-1 sm:w-56">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por objetivo..."
            className="w-full pl-9 pr-8 py-1.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Seletor de Ordenação */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'prazo_asc' | 'recentes')}
            className="text-xs font-medium text-slate-700 bg-white border border-slate-200/90 rounded-xl px-2.5 py-1.5 outline-none cursor-pointer hover:bg-slate-50 transition-colors"
            title="Ordenar objetivos"
          >
            <option value="prazo_asc">Prazo mais próximo</option>
            <option value="recentes">Mais recentes primeiro</option>
          </select>
        </div>
      </div>
    </div>
  );
};
