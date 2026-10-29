/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { FilterBar } from './components/FilterBar';
import { GoalCard } from './components/GoalCard';
import { GoalFormModal } from './components/GoalFormModal';
import { ConfirmModal } from './components/ConfirmModal';
import { EmptyState } from './components/EmptyState';
import { NotificationToast, ToastMessage } from './components/NotificationToast';
import { storageService } from './services/storageService';
import { Goal, GoalFilter, GoalFormData, GoalStatus } from './types/goal';
import { Lightbulb, Sparkles } from 'lucide-react';

export default function App() {
  const [goals, setGoals] = useState<Goal[]>(() => storageService.getGoals());
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null);

  // Filtros e ordenação
  const [filter, setFilter] = useState<GoalFilter>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'prazo_asc' | 'recentes'>('prazo_asc');

  // Notificações amigáveis (toast)
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ id: Date.now().toString(), message, type });
  };

  // Recarrega do storage ao montar para garantir sincronismo
  useEffect(() => {
    const loaded = storageService.getGoals();
    setGoals(loaded);
  }, []);

  // Estatísticas calculadas
  const stats = useMemo(() => {
    return storageService.getStats(goals);
  }, [goals]);

  // Lista filtrada e ordenada de objetivos
  const filteredGoals = useMemo(() => {
    return goals
      .filter((goal) => {
        // Filtro por status
        if (filter !== 'todos' && goal.status !== filter) {
          return false;
        }

        // Filtro por termo de busca
        if (searchTerm.trim() !== '') {
          const term = searchTerm.toLowerCase();
          const matchTitle = goal.title.toLowerCase().includes(term);
          const matchDesc = goal.description.toLowerCase().includes(term);
          if (!matchTitle && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'recentes') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        // Por padrão: prazo mais próximo primeiro
        return (a.deadline || '').localeCompare(b.deadline || '');
      });
  }, [goals, filter, searchTerm, sortBy]);

  // Abertura do modal para novo objetivo
  const handleOpenNewGoal = () => {
    setEditingGoal(null);
    setIsFormModalOpen(true);
  };

  // Abertura do modal para editar objetivo
  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsFormModalOpen(true);
  };

  // Salvar novo objetivo ou atualizar existente
  const handleSubmitForm = (formData: GoalFormData) => {
    if (editingGoal) {
      const updated = storageService.updateGoal(editingGoal.id, formData);
      if (updated) {
        setGoals(storageService.getGoals());
        showToast('Objetivo atualizado com sucesso!');
      }
    } else {
      storageService.createGoal(formData);
      setGoals(storageService.getGoals());
      showToast('Novo objetivo de estudo cadastrado!');
    }
  };

  // Mudança rápida de status diretamente pelo cartão
  const handleStatusChange = (id: string, newStatus: GoalStatus) => {
    const updated = storageService.updateGoal(id, { status: newStatus });
    if (updated) {
      setGoals(storageService.getGoals());
      if (newStatus === 'concluido') {
        showToast('Parabéns! Meta de estudo concluída!', 'success');
      } else if (newStatus === 'em_andamento') {
        showToast('Objetivo em andamento! Bons estudos!', 'info');
      } else {
        showToast('Status do objetivo atualizado.', 'info');
      }
    }
  };

  // Solicitação de exclusão (abre o modal de confirmação)
  const handleDeleteRequest = (goal: Goal) => {
    setDeletingGoal(goal);
  };

  // Confirmação definitiva de exclusão
  const handleConfirmDelete = () => {
    if (deletingGoal) {
      const success = storageService.deleteGoal(deletingGoal.id);
      if (success) {
        setGoals(storageService.getGoals());
        showToast('Objetivo excluído com sucesso.', 'info');
      }
      setDeletingGoal(null);
    }
  };

  // Carregar exemplos educativos
  const handleLoadSamples = () => {
    const sampleItems = storageService.resetToSamples();
    setGoals(sampleItems);
    setFilter('todos');
    setSearchTerm('');
    showToast('Exemplos de estudo carregados com sucesso!', 'info');
  };

  const isFiltered = filter !== 'todos' || searchTerm.trim() !== '';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Cabeçalho */}
      <Header onOpenNewGoalModal={handleOpenNewGoal} totalGoals={stats.total} />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Painel de Estatísticas e Contagem */}
        <StatsBar stats={stats} />

        {/* Barra de Filtros, Pesquisa e Ordenação */}
        {goals.length > 0 && (
          <FilterBar
            currentFilter={filter}
            onFilterChange={setFilter}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            stats={stats}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        )}

        {/* Listagem de Cartões ou Estado Vazio */}
        {goals.length === 0 ? (
          <EmptyState
            isFiltered={false}
            onOpenNewGoalModal={handleOpenNewGoal}
            onLoadSamples={handleLoadSamples}
          />
        ) : filteredGoals.length === 0 ? (
          <EmptyState
            isFiltered={isFiltered}
            onOpenNewGoalModal={handleOpenNewGoal}
            onResetFilters={() => {
              setFilter('todos');
              setSearchTerm('');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleEditGoal}
                onDeleteRequest={handleDeleteRequest}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}

        {/* Dica Pedagógica Acolhedora para Iniciantes */}
        <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 flex items-start gap-3 mt-8">
          <div className="p-2 rounded-xl bg-white text-indigo-600 shadow-2xs shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-900 block font-semibold mb-0.5">
              Dica StudyFlow para quem está começando:
            </strong>
            Em vez de metas muito amplas como "Aprender Matemática", divida em objetivos menores com
            prazos definidos, como "Revisar tabuada do 7" ou "Resolver 5 exercícios de frações".
            Assim você constrói ritmo sem se cansar!
          </div>
        </div>
      </main>

      {/* Rodapé Simples e Acolhedor */}
      <footer className="border-t border-slate-200/70 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <span>StudyFlow</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500 font-normal">
              Seus objetivos de estudo salvos localmente
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Total de {stats.total} metas registradas</span>
            <span aria-hidden="true">·</span>
            <span>Versão 1.0 (MVP)</span>
          </div>
        </div>
      </footer>

      {/* Modal de Cadastro e Edição */}
      <GoalFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={handleSubmitForm}
        editingGoal={editingGoal}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={deletingGoal !== null}
        goal={deletingGoal}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingGoal(null)}
      />

      {/* Notificação Toast */}
      <NotificationToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
