/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Goal, GoalFormData, GoalStats } from '../types/goal';

const STORAGE_KEY = 'studyflow_goals_v1';
const INITIALIZED_FLAG_KEY = 'studyflow_has_initialized_v1';

/**
 * Exemplos acolhedores e realistas para estudantes iniciantes
 * carregados na primeira visita para orientar o uso.
 */
export const SAMPLE_GOALS: Goal[] = [
  {
    id: 'sample-1',
    title: 'Aprender variáveis e funções básicas',
    description: 'Assistir aos vídeos introdutórios e resolver 5 exercícios práticos de lógica.',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Daqui a 2 dias
    status: 'em_andamento',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Fazer mapa mental de Biologia Celular',
    description: 'Resumir as funções da mitocôndria, complexo de Golgi e retículo endoplasmático.',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Daqui a 5 dias
    status: 'nao_iniciado',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-3',
    title: 'Revisar fórmulas de Física (Cinemática)',
    description: 'Compreender a diferença entre velocidade média e aceleração com exemplos reais.',
    deadline: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Concluído ontem
    status: 'concluido',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
  },
];

export const storageService = {
  /**
   * Obtém a lista de objetivos armazenados no localStorage.
   * Se for o primeiro acesso, carrega exemplos educativos iniciais.
   */
  getGoals(): Goal[] {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      const hasInitialized = localStorage.getItem(INITIALIZED_FLAG_KEY);

      if (rawData === null) {
        // Primeiro acesso: inicializar com exemplos para demonstração
        if (!hasInitialized) {
          this.saveGoals(SAMPLE_GOALS);
          localStorage.setItem(INITIALIZED_FLAG_KEY, 'true');
          return SAMPLE_GOALS;
        }
        return [];
      }

      const parsed = JSON.parse(rawData);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.error('Erro ao ler objetivos do localStorage:', error);
      return [];
    }
  },

  /**
   * Salva a lista de objetivos no localStorage.
   */
  saveGoals(goals: Goal[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
      localStorage.setItem(INITIALIZED_FLAG_KEY, 'true');
    } catch (error) {
      console.error('Erro ao salvar objetivos no localStorage:', error);
    }
  },

  /**
   * Cadastra um novo objetivo de estudo.
   */
  createGoal(data: GoalFormData): Goal {
    const newGoal: Goal = {
      id: 'goal_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline,
      status: data.status,
      createdAt: new Date().toISOString(),
    };

    const currentGoals = this.getGoals();
    const updatedGoals = [newGoal, ...currentGoals];
    this.saveGoals(updatedGoals);
    return newGoal;
  },

  /**
   * Edita um objetivo existente por ID.
   */
  updateGoal(id: string, data: Partial<GoalFormData>): Goal | null {
    const currentGoals = this.getGoals();
    const index = currentGoals.findIndex((g) => g.id === id);

    if (index === -1) {
      return null;
    }

    const updatedGoal: Goal = {
      ...currentGoals[index],
      ...data,
      title: data.title !== undefined ? data.title.trim() : currentGoals[index].title,
      description: data.description !== undefined ? data.description.trim() : currentGoals[index].description,
      updatedAt: new Date().toISOString(),
    };

    currentGoals[index] = updatedGoal;
    this.saveGoals(currentGoals);
    return updatedGoal;
  },

  /**
   * Exclui um objetivo por ID.
   */
  deleteGoal(id: string): boolean {
    const currentGoals = this.getGoals();
    const filtered = currentGoals.filter((g) => g.id !== id);

    if (filtered.length === currentGoals.length) {
      return false;
    }

    this.saveGoals(filtered);
    return true;
  },

  /**
   * Calcula estatísticas dos objetivos cadastrados.
   */
  getStats(goals?: Goal[]): GoalStats {
    const items = goals ?? this.getGoals();
    const total = items.length;
    const naoIniciado = items.filter((g) => g.status === 'nao_iniciado').length;
    const emAndamento = items.filter((g) => g.status === 'em_andamento').length;
    const concluido = items.filter((g) => g.status === 'concluido').length;
    const percentualConcluido = total > 0 ? Math.round((concluido / total) * 100) : 0;

    return {
      total,
      naoIniciado,
      emAndamento,
      concluido,
      percentualConcluido,
    };
  },

  /**
   * Restaura os exemplos de demonstração.
   */
  resetToSamples(): Goal[] {
    this.saveGoals(SAMPLE_GOALS);
    return SAMPLE_GOALS;
  },

  /**
   * Remove todos os objetivos (limpeza completa).
   */
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(INITIALIZED_FLAG_KEY, 'true');
  },
};
