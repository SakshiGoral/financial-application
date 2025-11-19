'use server';

/**
 * @fileOverview An AI agent to answer financial questions.
 *
 * - answerFinancialQuestions - A function that answers questions about the user's financial status.
 * - AnswerFinancialQuestionsInput - The input type for the answerFinancialQuestions function.
 * - AnswerFinancialQuestionsOutput - The return type for the answerFinancialQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerFinancialQuestionsInputSchema = z.object({
  question: z.string().describe('The user question about their financial situation.'),
  balance: z.number().describe('The current account balance.'),
  income: z.number().describe('The total income.'),
  expenses: z.number().describe('The total expenses.'),
  budgets: z.array(
    z.object({
      category: z.string(),
      amount: z.number(),
    })
  ).describe('The list of budgets.'),
  goals: z.array(
    z.object({
      name: z.string(),
      targetAmount: z.number(),
      currentAmount: z.number(),
    })
  ).describe('The list of financial goals.'),
});
export type AnswerFinancialQuestionsInput = z.infer<typeof AnswerFinancialQuestionsInputSchema>;

const AnswerFinancialQuestionsOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question.'),
});
export type AnswerFinancialQuestionsOutput = z.infer<typeof AnswerFinancialQuestionsOutputSchema>;

export async function answerFinancialQuestions(input: AnswerFinancialQuestionsInput): Promise<AnswerFinancialQuestionsOutput> {
  return answerFinancialQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerFinancialQuestionsPrompt',
  input: {schema: AnswerFinancialQuestionsInputSchema},
  output: {schema: AnswerFinancialQuestionsOutputSchema},
  prompt: `You are a helpful AI assistant that answers questions about a user's financial situation.

  Use the following information to answer the user's question:

  Current Balance: {{balance}}
  Total Income: {{income}}
  Total Expenses: {{expenses}}
  
  Budgets:
  {{#each budgets}}
  - {{this.category}}: {{this.amount}}
  {{/each}}

  Goals:
  {{#each goals}}
  - {{this.name}}: Target {{this.targetAmount}}, Current {{this.currentAmount}}
  {{/each}}

  Question: {{question}}`,
});

const answerFinancialQuestionsFlow = ai.defineFlow(
  {
    name: 'answerFinancialQuestionsFlow',
    inputSchema: AnswerFinancialQuestionsInputSchema,
    outputSchema: AnswerFinancialQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
