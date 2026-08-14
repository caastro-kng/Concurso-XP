import { PlanoEstudoCompleto, UserProfile } from '../types';

const USER_KEY = 'concurso_mentor_user';
const PLANS_KEY = 'concurso_mentor_plans';
const ACTIVE_PLAN_ID_KEY = 'concurso_mentor_active_plan_id';

export function getStoredUser(): UserProfile | null {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveStoredUser(user: UserProfile): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Erro ao salvar usuário no localStorage', e);
  }
}

export function getStoredPlans(): PlanoEstudoCompleto[] {
  try {
    const data = localStorage.getItem(PLANS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function savePlan(plan: PlanoEstudoCompleto): void {
  try {
    const plans = getStoredPlans();
    const existingIndex = plans.findIndex((p) => p.id === plan.id);
    if (existingIndex >= 0) {
      plans[existingIndex] = plan;
    } else {
      plans.unshift(plan);
    }
    localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
    localStorage.setItem(ACTIVE_PLAN_ID_KEY, plan.id);
  } catch (e) {
    console.error('Erro ao salvar plano no localStorage', e);
  }
}

export function getActivePlanId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_PLAN_ID_KEY);
  } catch {
    return null;
  }
}

export function setActivePlanId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PLAN_ID_KEY, id);
  } catch (e) {
    console.error('Erro ao setar plano ativo', e);
  }
}

export function deletePlan(id: string): void {
  try {
    const plans = getStoredPlans().filter((p) => p.id !== id);
    localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
  } catch (e) {
    console.error('Erro ao deletar plano', e);
  }
}
