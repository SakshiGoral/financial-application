'use server';

/**
 * @fileOverview Provides automated budget advice based on spending habits.
 *
 * - provideAutomatedBudgetAdvice - A function that provides automated budget advice.
 * - ProvideAutomatedBudgetAdviceInput - The input type for the provideAutomatedBudgetAdvice function.
 * - ProvideAutomatedBudgetAdviceOutput - The return type for the provideAutomatedBudgetAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideAutomatedBudgetAdviceInputSchema = z.object({
  transactions: z
    .array(
      z.object({
        category: z.string(),
        amount: z.number(),
        description: z.string(),
      })
    )
    .describe('An array of transactions, including the category and amount.'),
  budgets: z
    .array(
      z.object({
        category: z.string(),
        amount: z.number(),
      })
    )
    .describe('An array of budgets, including the category and amount.'),
  income: z.number().describe('The total income.'),
  balance: z.number().describe('The current balance.'),
});
export type ProvideAutomatedBudgetAdviceInput = z.infer<typeof ProvideAutomatedBudgetAdviceInputSchema>;

const ProvideAutomatedBudgetAdviceOutputSchema = z.object({
  advice: z.string().describe('Automated advice on how to improve the budget.'),
});
export type ProvideAutomatedBudgetAdviceOutput = z.infer<typeof ProvideAutomatedBudgetAdviceOutputSchema>;

export async function provideAutomatedBudgetAdvice(input: ProvideAutomatedBudgetAdviceInput): Promise<ProvideAutomatedBudgetAdviceOutput> {
  return provideAutomatedBudgetAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideAutomatedBudgetAdvicePrompt',
  input: {schema: ProvideAutomatedBudgetAdviceInputSchema},
  output: {schema: ProvideAutomatedBudgetAdviceOutputSchema},
  prompt: `You are a financial advisor providing advice to users based on their transactions and budgets.

  Analyze the following data to provide personalized advice on how they can improve their budget.

  Transactions: {{{JSON.stringify(transactions)}}
  Budgets: {{{JSON.stringify(budgets)}}}
  Income: {{{income}}}
  Balance: {{{balance}}}

  Focus on areas where they can cut costs, optimize spending, and achieve their financial goals. Suggest specific categories to look at.
  Give the response a friendly and encouraging tone.
  Be concise - the response should be under 100 words.
  `,
});

const provideAutomatedBudgetAdviceFlow = ai.defineFlow(
  {
    name: 'provideAutomatedBudgetAdviceFlow',
    inputSchema: ProvideAutomatedBudgetAdviceInputSchema,
    outputSchema: ProvideAutomatedBudgetAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
