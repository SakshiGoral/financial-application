'use server';

/**
 * @fileOverview A flow that answers user questions about their financial data.
 *
 * - answerFinancialQuestions - A function that returns a string answer.
 */

import { ai } from '@/ai/genkit';
import {
  AnswerFinancialQuestionsInputSchema,
  AnswerFinancialQuestionsOutputSchema,
  type AnswerFinancialQuestionsInput,
  type AnswerFinancialQuestionsOutput,
} from '@/ai/definitions';

export async function answerFinancialQuestions(
  input: AnswerFinancialQuestionsInput
): Promise<AnswerFinancialQuestionsOutput> {
  return answerFinancialQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerFinancialQuestionsPrompt',
  input: { schema: AnswerFinancialQuestionsInputSchema },
  output: { schema: AnswerFinancialQuestionsOutputSchema },
  prompt: `You are a friendly and helpful AI financial assistant for an app called FinTrack Pro.

Your goal is to answer the user's question based on the financial data provided. Be conversational and clear in your response.

Today's date is ${new Date().toDateString()}.

Here is the user's financial data:

**Budgets:**
{{#each budgets}}
- **{{category}}**: {{amount}} limit per month
{{else}}
- No budgets have been set.
{{/each}}

**Savings Goals:**
{{#each goals}}
- **{{name}}**: Saved {{currentAmount}} out of {{targetAmount}} (Deadline: {{deadline}})
{{else}}
- No savings goals have been set.
{{/each}}

**All Transactions (recent first):**
{{#each transactions}}
- **{{description}}** ({{category}}): {{amount}}
{{else}}
- No transactions have been recorded.
{{/each}}

Now, please answer this question: "{{question}}"`,
});

const answerFinancialQuestionsFlow = ai.defineFlow(
  {
    name: 'answerFinancialQuestionsFlow',
    inputSchema: AnswerFinancialQuestionsInputSchema,
    outputSchema: AnswerFinancialQuestionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
