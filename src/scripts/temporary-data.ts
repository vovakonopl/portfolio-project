import { TemporaryData } from '@/types/temporary-data';

function isTemporaryData(val: any): val is TemporaryData<unknown> {
  const classKeys: (keyof TemporaryData<unknown>)[] = ['data', 'storedAt'];
  return classKeys.every((key) => key in val);
}

function isFreshData(
  value: TemporaryData<unknown>,
  storedFor: number,
): boolean {
  return Date.now() - value.storedAt < storedFor;
}

type TStoreListParams<T> = {
  filter?: (item: T) => boolean; // Filter values before storing them
  key: string;
  maxCount?: number;
  storeFor: number;
  value: T;
};

// Stores temporary data to local storage in array for specified time in milliseconds.
export function storeTemporaryList<T>(params: TStoreListParams<T>) {
  let values: TemporaryData<unknown>[] = getTemporaryList(
    params.key,
    params.storeFor,
  );

  if (params.filter) {
    values = values.filter((item: TemporaryData<unknown>) => {
      // wrap in try-catch block in case the type of the item is different
      try {
        return params.filter!(item.data as T);
      } catch {
        return false;
      }
    });
  }

  values.unshift(new TemporaryData(params.value));
  localStorage.setItem(
    params.key,
    JSON.stringify(values.splice(0, params.maxCount)),
  );
}

// Gets data from local storage, filters out outdated values and returns result
export function getTemporaryList(
  key: string,
  storedFor: number, // in milliseconds
): TemporaryData<unknown>[] {
  const json: string | null = localStorage.getItem(key);
  if (!json) return [];

  const data = JSON.parse(json);
  if (!Array.isArray(data)) {
    console.error('Local storage: wrong type of data.');
    return [];
  }
  if (data.length === 0) return [];

  return data.filter((value) => {
    if (!isTemporaryData(value)) {
      console.error('Local storage: Wrong type of value inside the array.');
      return false;
    }

    return isFreshData(value, storedFor);
  });
}

// Stores temporary data to local storage for specified time in milliseconds.
export function setTemporaryData<T>(key: string, value: T) {
  localStorage.set(key, JSON.stringify(new TemporaryData(value)));
}

// Gets data from local storage and returns it if it's "fresh"
export function getTemporaryData(
  key: string,
  storedFor: number,
): unknown | null {
  const json: string | null = localStorage.getItem(key);
  if (!json) return null;

  const data: unknown = JSON.parse(json);
  if (!isTemporaryData(data)) return null;

  return isFreshData(data, storedFor) ? data.data : null;
}
