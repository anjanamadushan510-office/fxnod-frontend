import {
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import type {
  BotPreset,
  CreateBotPresetRequest,
  ListBotPresets200,
  UpdateBotPresetRequest,
} from '../../model';

import { customInstance } from '../../mutator/custom-instance';
import type { ErrorType, BodyType } from '../../mutator/custom-instance';

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

// ─── LIST PRESETS ─────────────────────────────────────────────────────────────

export const listBotPresets = (
  strategyId?: string,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal,
) => {
  return customInstance<ListBotPresets200>(
    {
      url: `/api/v1/bots/presets`,
      method: 'GET',
      params: strategyId ? { strategy_id: strategyId } : undefined,
      signal,
    },
    options,
  );
};

export const getListBotPresetsQueryKey = (strategyId?: string) => {
  return [`/api/v1/bots/presets`, ...(strategyId ? [{ strategy_id: strategyId }] : [])] as const;
};

export const getListBotPresetsQueryOptions = <
  TData = Awaited<ReturnType<typeof listBotPresets>>,
  TError = ErrorType<unknown>,
>(
  strategyId?: string,
  options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listBotPresets>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getListBotPresetsQueryKey(strategyId);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof listBotPresets>>> = ({ signal }) =>
    listBotPresets(strategyId, requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listBotPresets>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export function useListBotPresets<
  TData = Awaited<ReturnType<typeof listBotPresets>>,
  TError = ErrorType<unknown>,
>(
  strategyId?: string,
  options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listBotPresets>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {
  const queryOptions = getListBotPresetsQueryOptions(strategyId, options);
  const query = useQuery(queryOptions, queryClient) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };
  query.queryKey = queryOptions.queryKey;
  return query;
}

// ─── CREATE PRESET ────────────────────────────────────────────────────────────

export const createBotPreset = (
  createBotPresetRequest: BodyType<CreateBotPresetRequest>,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal,
) => {
  return customInstance<BotPreset>(
    {
      url: `/api/v1/bots/presets`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: createBotPresetRequest,
      signal,
    },
    options,
  );
};

export const getCreateBotPresetMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createBotPreset>>,
    TError,
    { data: BodyType<CreateBotPresetRequest> },
    TContext
  >;
  request?: SecondParameter<typeof customInstance>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof createBotPreset>>,
  TError,
  { data: BodyType<CreateBotPresetRequest> },
  TContext
> => {
  const mutationKey = ['createBotPreset'];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createBotPreset>>,
    { data: BodyType<CreateBotPresetRequest> }
  > = (props) => {
    const { data } = props ?? {};
    return createBotPreset(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export function useCreateBotPreset<TError = ErrorType<unknown>, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof createBotPreset>>,
      TError,
      { data: BodyType<CreateBotPresetRequest> },
      TContext
    >;
    request?: SecondParameter<typeof customInstance>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof createBotPreset>>,
  TError,
  { data: BodyType<CreateBotPresetRequest> },
  TContext
> {
  const mutationOptions = getCreateBotPresetMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}

// ─── UPDATE PRESET ────────────────────────────────────────────────────────────

export const updateBotPreset = (
  presetId: string,
  updateBotPresetRequest: BodyType<UpdateBotPresetRequest>,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal,
) => {
  return customInstance<BotPreset>(
    {
      url: `/api/v1/bots/presets/${presetId}`,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      data: updateBotPresetRequest,
      signal,
    },
    options,
  );
};

export const getUpdateBotPresetMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updateBotPreset>>,
    TError,
    { presetId: string; data: BodyType<UpdateBotPresetRequest> },
    TContext
  >;
  request?: SecondParameter<typeof customInstance>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof updateBotPreset>>,
  TError,
  { presetId: string; data: BodyType<UpdateBotPresetRequest> },
  TContext
> => {
  const mutationKey = ['updateBotPreset'];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof updateBotPreset>>,
    { presetId: string; data: BodyType<UpdateBotPresetRequest> }
  > = (props) => {
    const { presetId, data } = props ?? {};
    return updateBotPreset(presetId, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export function useUpdateBotPreset<TError = ErrorType<unknown>, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof updateBotPreset>>,
      TError,
      { presetId: string; data: BodyType<UpdateBotPresetRequest> },
      TContext
    >;
    request?: SecondParameter<typeof customInstance>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof updateBotPreset>>,
  TError,
  { presetId: string; data: BodyType<UpdateBotPresetRequest> },
  TContext
> {
  const mutationOptions = getUpdateBotPresetMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}

// ─── DELETE PRESET ────────────────────────────────────────────────────────────

export const deleteBotPreset = (
  presetId: string,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal,
) => {
  return customInstance<{ deleted: boolean }>(
    {
      url: `/api/v1/bots/presets/${presetId}`,
      method: 'DELETE',
      signal,
    },
    options,
  );
};

export const getDeleteBotPresetMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteBotPreset>>,
    TError,
    { presetId: string },
    TContext
  >;
  request?: SecondParameter<typeof customInstance>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteBotPreset>>,
  TError,
  { presetId: string },
  TContext
> => {
  const mutationKey = ['deleteBotPreset'];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteBotPreset>>,
    { presetId: string }
  > = (props) => {
    const { presetId } = props ?? {};
    return deleteBotPreset(presetId, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export function useDeleteBotPreset<TError = ErrorType<unknown>, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof deleteBotPreset>>,
      TError,
      { presetId: string },
      TContext
    >;
    request?: SecondParameter<typeof customInstance>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof deleteBotPreset>>,
  TError,
  { presetId: string },
  TContext
> {
  const mutationOptions = getDeleteBotPresetMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}
