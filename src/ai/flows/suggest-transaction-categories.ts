'use server';

/**
 * @fileOverview A flow that suggests transaction categories based on the transaction description.
 *
 * - suggestTransactionCategories - A function that suggests categories for a given transaction description.
 * - SuggestTransactionCategoriesInput - The input type for the suggestTransactionCategories function.
 * - SuggestTransactionCategoriesOutput - The return type for the suggestTransactionCategories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTransactionCategoriesInputSchema = z.object({
  description: z.string().optional().describe('The description of the transaction.'),
  pythonMode: z.boolean().optional().describe('If true, the output will include a Python list of categories.'),
});
export type SuggestTransactionCategoriesInput = z.infer<typeof SuggestTransactionCategoriesInputSchema>;

const SuggestTransactionCategoriesOutputSchema = z.object({
  categories: z
    .array(z.string())
    .describe('An array of suggested categories for the transaction.'),
    pythonCategories: z.string().optional().describe('A Python list of the suggested categories as a string.'),
});
export type SuggestTransactionCategoriesOutput = z.infer<typeof SuggestTransactionCategoriesOutputSchema>;

export async function suggestTransactionCategories(
  input: SuggestTransactionCategoriesInput
): Promise<SuggestTransactionCategoriesOutput> {
  return suggestTransactionCategoriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTransactionCategoriesPrompt',
  input: {schema: SuggestTransactionCategoriesInputSchema},
  output: {schema: SuggestTransactionCategoriesOutputSchema},
  prompt: `Given the following transaction description, suggest up to 3 categories that would be appropriate for this transaction. Return only the names of the categories.
{{#if description}}
Description: {{{description}}}
{{/if}}

{{#if pythonMode}}
You are in Python mode. Also provide the categories as a Python list string in the pythonCategories field.
{{/if}}

Categories:`,
});

const suggestTransactionCategoriesFlow = ai.defineFlow(
  {
    name: 'suggestTransactionCategoriesFlow',
    inputSchema: SuggestTransactionCategoriesInputSchema,
    outputSchema: SuggestTransactionCategoriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (output && input.pythonMode) {
      output.pythonCategories = `[${output.categories.map(c => `"${c}"`).join(', ')}]`;
    }
    return output!;
  }
);
