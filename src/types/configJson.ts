import type { Config, Action, ExtractorCustom } from './config';
import type { Modify } from './utils';

export type FunctionAsString = {
  __type: 'function';
  source: string;
};

export type ExtractorCustomAsString = Modify<
  ExtractorCustom,
  {
    params: {
      method: FunctionAsString;
    };
  }
>;

export type ActionAsString = Modify<
  Action,
  {
    recordExtractor?: FunctionAsString;
    extractors?: ExtractorCustomAsString[];
  }
>;

export type ConfigJson = Modify<
  Config,
  {
    linkExtractor?: FunctionAsString;
    actions: ActionAsString[];
  }
>;
