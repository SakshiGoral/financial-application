'use client';

import AddGoal from '@/components/goals/add-goal';
import GoalsGrid from '@/components/goals/goals-grid';
import { useData } from '@/contexts/data-context';

export default function GoalsPage() {
  const { goals, addGoal, deleteGoal, updateGoal } = useData();

  return (
    <div className="space-y-6">
      <AddGoal addGoal={addGoal} />
      <GoalsGrid goals={goals} deleteGoal={deleteGoal} updateGoal={updateGoal} />
    </div>
  );
}
