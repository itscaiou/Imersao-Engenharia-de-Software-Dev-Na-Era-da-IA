/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle, Sparkles, Check, Bookmark } from 'lucide-react';
import { Goal, GoalFormData, GoalStatus } from '../types/goal';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GoalFormData) => void;
  editingGoal?: Goal | null;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingGoal,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<GoalStatus>('nao_iniciado');
  const [error, setError] = useState<string | null>(null);

  // Inicializa o formulário com dados existentes na edição ou limpos para novo
  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title);
      setDescription(editingGoal.description);
      setDeadline(editingGoal.deadline);
      setStatus(editingGoal.status);
    } else {
      setTitle('');
      setDescription('');
      // Sugere uma data padrão (daqui a 7 dias)
      const defaultDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      setDeadline(defaultDate);
      setStatus('nao_iniciado');
    }
    setError(null);
  }, [editingGoal, isOpen]);

  // Fechar com tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Por favor, informe o título do seu objetivo de estudo.');
      return;
    }

    if (!deadline) {
      setError('Por favor, escolha uma data limite para o seu prazo.');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
    });
    onClose();
  };

  // Atalhos de prazo para facilitar a rotina do estudante
  const handleQuickDeadline = (daysToAdd: number) => {
    const targetDate = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);
    setDeadline(targetDate.toISOString().split('T')[0]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Cabeçalho do modal */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-slate-900">
              {editingGoal ? 'Editar Objetivo de Estudo' : 'Cadastrar Novo Objetivo'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {editingGoal
                ? 'Atualize os dados e o andamento da sua meta'
                : 'Defina o que você quer aprender e estabeleça um prazo claro'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Campo: Título */}
          <div>
            <label htmlFor="goal-title" className="block text-xs font-semibold text-slate-700 mb-1">
              Título do Objetivo <span className="text-rose-500">*</span>
            </label>
            <input
              id="goal-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Ex: Revisar funções de 1º grau para a prova"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-slate-900 placeholder:text-slate-400 transition-all"
              autoFocus
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Dica: Seja específico no que deseja aprender (ex.: matéria + tópico).
            </span>
          </div>

          {/* Campo: Descrição */}
          <div>
            <label htmlFor="goal-desc" className="block text-xs font-semibold text-slate-700 mb-1">
              Descrição e Anotações <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <textarea
              id="goal-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Assistir videoaula, resumir tópicos no caderno e fazer os exercícios 1 a 10 da lista."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-slate-900 placeholder:text-slate-400 transition-all resize-none"
            />
          </div>

          {/* Campo: Prazo */}
          <div>
            <label htmlFor="goal-deadline" className="block text-xs font-semibold text-slate-700 mb-1">
              Prazo de Conclusão <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="goal-deadline"
                type="date"
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-slate-900 transition-all"
              />
            </div>

            {/* Atalhos rápidos de prazo */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400">Atalhos rápidos:</span>
              <button
                type="button"
                onClick={() => handleQuickDeadline(0)}
                className="text-[11px] px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
              >
                Hoje
              </button>
              <button
                type="button"
                onClick={() => handleQuickDeadline(1)}
                className="text-[11px] px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
              >
                Amanhã
              </button>
              <button
                type="button"
                onClick={() => handleQuickDeadline(7)}
                className="text-[11px] px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
              >
                Em 7 dias
              </button>
              <button
                type="button"
                onClick={() => handleQuickDeadline(15)}
                className="text-[11px] px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
              >
                Em 15 dias
              </button>
            </div>
          </div>

          {/* Campo: Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Status do Objetivo
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('nao_iniciado')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  status === 'nao_iniciado'
                    ? 'border-slate-800 bg-slate-50 text-slate-900 ring-1 ring-slate-800'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  {status === 'nao_iniciado' && <Check className="w-3.5 h-3.5 text-slate-900" />}
                </div>
                <span className="text-xs font-semibold block">Não iniciado</span>
                <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">
                  Ainda não começou
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('em_andamento')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  status === 'em_andamento'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 ring-1 ring-amber-500'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {status === 'em_andamento' && <Check className="w-3.5 h-3.5 text-amber-700" />}
                </div>
                <span className="text-xs font-semibold block">Em andamento</span>
                <span className="text-[10px] text-amber-700/80 leading-tight block mt-0.5">
                  Estudando agora
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('concluido')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  status === 'concluido'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {status === 'concluido' && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                </div>
                <span className="text-xs font-semibold block">Concluído</span>
                <span className="text-[10px] text-emerald-700/80 leading-tight block mt-0.5">
                  Meta cumprida!
                </span>
              </button>
            </div>
          </div>

          {/* Rodapé com botões de ação */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all hover:shadow active:scale-[0.98] cursor-pointer"
            >
              {editingGoal ? 'Salvar Alterações' : 'Salvar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
