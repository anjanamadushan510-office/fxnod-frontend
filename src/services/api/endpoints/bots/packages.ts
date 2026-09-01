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
  BotPackage,
  ClaimBotPackageRequest,
  ClaimBotPackageResponse,
  CreateBotPackageRequest,
  CreateBotPackageResponse,
  DownloadPackageFileResponse,
  ListBotPackagesResponse,
} from '../../model';

import { customInstance } from '../../mutator/custom-instance';
import type { ErrorType, BodyType } from '../../mutator/custom-instance';

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

// ─── CREATE PACKAGE (EXPORT) ──────────────────────────────────────────────────

export const createBotPackage = (
  data: BodyType<CreateBotPackageRequest>,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal,
) => {
  return customInstance<CreateBotPackageResponse>(
    {
      url: `/api/v1/bots/packages`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data,
      signal,
    },
    options,
  );
};

export const getCreateBotPackageMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createBotPackage>>,
    TError,
    { data: BodyType<CreateBotPackageRequest> },
    TContext
  >;
  request?: SecondParameter<typeof customInstance>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof createBotPackage>>,
  TError,
  { data: BodyType<CreateBotPackageRequest> },
  TContext
> => {
  const mutationKey = ['createBotPackage'];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createBotPackage>>,
    { data: BodyType<CreateBotPackageRequest> }
  > = (props) => {
    const { data } = props ?? {};
    return createBotPackage(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export function useCreateBotPackage<TError = ErrorType<unknown>, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof createBotPackage>>,
      TError,
      { data: BodyType<CreateBotPackageRequest> },
      TContext
    >;
    request?: SecondParameter<typeof customInstance>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof createBotPackage>>,
  TError,
  { data: BodyType<CreateBotPackageRequest> },
  TContext
> {
  const mutationOptions = getCreateBotPackageMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}

// ─── LIST MY PACKAGES ─────────────────────────────────────────────────────────

export const listMyBotPackages = (
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal,
) => {
  return customInstance<ListBotPackagesResponse>(
    {
      url: `/api/v1/bots/packages/mine`,
      method: 'GET',
      signal,
    },
    options,
  );
};

export const getListMyBotPackagesQueryKey = () => {
  return [`/api/v1/bots/packages/mine`] as const;
};

export const getListMyBotPackagesQueryOptions = <
  TData = Awaited<ReturnType<typeof listMyBotPackages>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listMyBotPackages>>, TError, TData>>;
  request?: SecondParameter<typeof customInstance>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getListMyBotPackagesQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof listMyBotPackages>>> = ({ signal }) =>
    listMyBotPackages(requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listMyBotPackages>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export function useListMyBotPackages<
  TData = Awaited<ReturnType<typeof listMyBotPackages>>,
  TError = ErrorType<unknown>,
>(
  options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listMyBotPackages>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {
  const queryOptions = getListMyBotPackagesQueryOptions(options);
  const query = useQuery(queryOptions, queryClient) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };
  query.queryKey = queryOptions.queryKey;
  return query;
}

// ─── CLAIM PACKAGE (IMPORT) ───────────────────────────────────────────────────

export const claimBotPackage = (
  data: BodyType<ClaimBotPackageRequest>,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal,
) => {
  return customInstance<ClaimBotPackageResponse>(
    {
      url: `/api/v1/bots/packages/claim`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data,
      signal,
    },
    options,
  );
};

export const getClaimBotPackageMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof claimBotPackage>>,
    TError,
    { data: BodyType<ClaimBotPackageRequest> },
    TContext
  >;
  request?: SecondParameter<typeof customInstance>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof claimBotPackage>>,
  TError,
  { data: BodyType<ClaimBotPackageRequest> },
  TContext
> => {
  const mutationKey = ['claimBotPackage'];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof claimBotPackage>>,
    { data: BodyType<ClaimBotPackageRequest> }
  > = (props) => {
    const { data } = props ?? {};
    return claimBotPackage(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export function useClaimBotPackage<TError = ErrorType<unknown>, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof claimBotPackage>>,
      TError,
      { data: BodyType<ClaimBotPackageRequest> },
      TContext
    >;
    request?: SecondParameter<typeof customInstance>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof claimBotPackage>>,
  TError,
  { data: BodyType<ClaimBotPackageRequest> },
  TContext
> {
  const mutationOptions = getClaimBotPackageMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}

// ─── DOWNLOAD FILE ────────────────────────────────────────────────────────────

export const downloadPackageFile = (
  packageId: string,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal,
) => {
  return customInstance<DownloadPackageFileResponse>(
    {
      url: `/api/v1/bots/packages/${packageId}/download`,
      method: 'GET',
      signal,
    },
    options,
  );
};

// ─── REVOKE PACKAGE ───────────────────────────────────────────────────────────

export const revokeBotPackage = (
  packageId: string,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal,
) => {
  return customInstance<{ revoked: boolean }>(
    {
      url: `/api/v1/bots/packages/${packageId}`,
      method: 'DELETE',
      signal,
    },
    options,
  );
};

export const getRevokeBotPackageMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof revokeBotPackage>>,
    TError,
    { packageId: string },
    TContext
  >;
  request?: SecondParameter<typeof customInstance>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof revokeBotPackage>>,
  TError,
  { packageId: string },
  TContext
> => {
  const mutationKey = ['revokeBotPackage'];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof revokeBotPackage>>,
    { packageId: string }
  > = (props) => {
    const { packageId } = props ?? {};
    return revokeBotPackage(packageId, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export function useRevokeBotPackage<TError = ErrorType<unknown>, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof revokeBotPackage>>,
      TError,
      { packageId: string },
      TContext
    >;
    request?: SecondParameter<typeof customInstance>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof revokeBotPackage>>,
  TError,
  { packageId: string },
  TContext
> {
  const mutationOptions = getRevokeBotPackageMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}
