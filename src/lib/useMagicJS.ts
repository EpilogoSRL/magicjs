import { z, ZodType } from 'zod';
import stringify from 'fast-json-stable-stringify';
import { magicJS, magicJSContext, MagicJSParams } from './magicJS';
import { UndefinedOptional } from '../Types';

export type UseMagicJS = {
  initialize: (params: UndefinedOptional<typeof magicJSContext>) => void;

  <Data, Zod extends ZodType = ZodType>(...params: MagicJSParams<Data, Zod>): [
    z.infer<Zod> | null,
    boolean,
    Error | null,
  ];
};

export const useMagicJS = (<Data, Zod extends ZodType = ZodType>(
  ...params: MagicJSParams<Data, Zod>
) => {
  const [what, zod, data] = params;

  if (!magicJSContext.React) {
    throw new Error(
      'You forgot to initialize magicJS.React by calling magicJS.initialize() and passing the React instance',
    );
  }

  const [loading, setLoading] = magicJSContext.React.useState(true);
  const [result, setResult] = magicJSContext.React.useState(null);
  const [error, setError] = magicJSContext.React.useState(null);

  magicJSContext.React.useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await magicJS<any>(what, zod, data);
        setResult(result);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [stringify([what, data]), setLoading, setResult, setError]);

  return [
    result,
    loading,
    error,
  ];
}) as UseMagicJS;

useMagicJS.initialize = magicJS.initialize;
