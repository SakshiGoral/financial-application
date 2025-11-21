'use server';

/**
 * @fileOverview A flow that provides automated budget advice based on transactions and budgets.
 *
 * - provideAutomatedBudgetAdvice - A function that returns a string of budget advice.
 */

import { ai } from '@/ai/genkit';
import {
  ProvideAutomatedBudgetAdviceInputSchema,
  ProvideAutomatedBudgetAdviceOutputSchema,
  type ProvideAutomatedBudgetAdviceInput,
  type ProvideAutomatedBudgetAdviceOutput,
} from '@/ai/definitions';

export async function provideAutomatedBudgetAdvice(
  input: ProvideAutomatedBudgetAdviceInput
): Promise<ProvideAutomatedBudgetAdviceOutput> {
  return provideAutomatedBudgetAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideAutomatedBudgetAdvicePrompt',
  input: { schema: ProvideAutomatedBudgetAdviceInputSchema },
  output: { schema: ProvideAutomatedBudgetAdviceOutputSchema },
  prompt: `You are a friendly and helpful financial assistant. Your goal is to provide a single, actionable insight based on the user's recent spending.

Analyze the provided transactions and budgets. Identify one key trend or area for improvement. Frame your advice as a single, concise sentence.

Do not greet the user or use any preamble. Just provide the advice directly.

Here is the user's data:

Budgets:
{{#each budgets}}
- {{category}}: {{amount}} limit
{{/each}}

Recent Transactions:
{{#each transactions}}
- {{description}} ({{category}}): {{amount}}
{{/each}}

Example of good advice: "You've spent a lot on 'Food' recently. Consider setting a budget for that category to manage your expenses."
Example of good advice: "You're close to your 'Shopping' budget limit for this month. Be mindful of your spending."
Example of good advice: "Great job staying under your 'Transport' budget this month!"

Generate one piece of advice now.`,
});

const provideAutomatedBudgetAdviceFlow = ai.defineFlow(
  {
    name: 'provideAutomatedBudgetAdviceFlow',
    inputSchema: ProvideAutomatedBudgetAdviceInputSchema,
    outputSchema: ProvideAutomatedBudgetAdviceOutputSchema,
  },
  async (input) => {
    if (input.transactions.length === 0) {
      return { advice: "You don't have any recent transactions. Add some to get personalized advice!" };
    }
    
    const { output } = await prompt(input);
    return output!;
  }
);
