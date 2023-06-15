import { z, ZodType } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { UndefinedOptional } from '../Types';

const __ZOD_KEY = 'params' as const;

export type MagicJSParams<Data, Zod extends ZodType = ZodType> = Data extends number | string | object
  ? [what: string, zod: Zod, data: Data]
  : [what: string, zod: Zod];

export type MagicJS = {
  initialize: (params: UndefinedOptional<typeof magicJSContext>) => void;

  <Data, Zod extends ZodType = ZodType>(...params: MagicJSParams<Data, Zod>): Promise<z.infer<Zod>>;
};

export const magicJSContext = {
  fetch: null,
  openAIApiKey: null as string,
  model: undefined as ('gpt-3.5-turbo-0613' | 'gpt-4-0613' | undefined),
  React: null as (undefined | {
    useState: any;
    useEffect: any;
    useMemo: any;
  }),
};

export function initializeMagicJS(ctx: typeof magicJSContext) {
  magicJSContext.fetch = ctx.fetch;
  magicJSContext.openAIApiKey = ctx.openAIApiKey;
  magicJSContext.model = ctx.model;
  magicJSContext.React = ctx.React;
}

export const magicJS = (async <Data, Zod extends ZodType = ZodType>(
  ...params: MagicJSParams<Data, Zod>
): Promise<z.infer<Zod>> => {
  const [what, zod, data] = params;
  if (!magicJSContext.openAIApiKey) {
    throw new Error('You forgot to initialize magicJS by calling magicJS.initialize()');
  }

  const schema = zodToJsonSchema(z.object({ [__ZOD_KEY]: zod }));

  const response = await magicJSContext.fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${magicJSContext.openAIApiKey}`,
    },
    body: JSON.stringify({
      // Deterministic results
      temperature: 0,
      model: magicJSContext.model ?? 'gpt-3.5-turbo-0613',
      function_call: { 'name': 'callback' },
      functions: [{
        name: 'callback',
        description: '',
        parameters: schema,
      }],
      messages: [
        {
          'role': 'system',
          'content': `You my assistant.\n\nI want you to ${what} and call "callback" with the result.`,
        },
        ...data
          ? [{
            'role': 'user',
            'content': JSON.stringify(data),
          }]
          : [],
      ],
    }),
  });

  const json = await response.json() as ({
    error?: {
      code: 'context_length_exceeded';
    };
    choices: [{
      message: {
        function_call: {
          name: 'callback';
          arguments: string;
        };
      };
    }];
  });

  if (json.error) {
    throw new Error(JSON.stringify(json.error));
  }

  const parsedArgs = JSON.parse(json.choices[0].message.function_call.arguments) as {
    [__ZOD_KEY]: z.infer<Zod>;
  };

  const result = zod.parse(parsedArgs[__ZOD_KEY]);

  return result;
}) as MagicJS;

magicJS.initialize = initializeMagicJS;
