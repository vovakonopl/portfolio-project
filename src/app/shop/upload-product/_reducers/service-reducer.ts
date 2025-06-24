import {
  AdditionalService,
  TServiceMap,
} from '@/app/shop/upload-product/_utils/structures/additional-service';
import { MAX_SERVICES } from '@/app/shop/upload-product/_utils/constants';

export enum ServiceStateActions {
  AddService,
  RemoveService,
  UpdateService,
  Reorder,
}

export type TAction =
  | {
      type: ServiceStateActions.AddService;
      payload: { service: AdditionalService };
    }
  | {
      type: ServiceStateActions.RemoveService;
      payload: {
        name: string;
      };
    }
  | {
      type: ServiceStateActions.Reorder;
      payload: {
        newOrder: string[];
      };
    }
  | {
      type: ServiceStateActions.UpdateService;
      payload: { originalName: string; service: AdditionalService };
    };

export function serviceReducer(
  state: TServiceMap,
  action: TAction,
): TServiceMap {
  switch (action.type) {
    case ServiceStateActions.AddService: {
      if (state.size >= MAX_SERVICES) return state;

      const { service } = action.payload;
      // Service with specified name already exist
      if (state.has(service.name)) return state;

      const newState = new Map(state);
      newState.set(service.name, service);

      return newState;
    }

    case ServiceStateActions.RemoveService: {
      const { name } = action.payload;
      if (!state.has(name)) return state; // no service with specified name

      const newState = new Map(state);
      newState.delete(name);

      return newState;
    }

    case ServiceStateActions.UpdateService: {
      const { originalName, service } = action.payload;
      if (!state.has(originalName)) return state; // no service with specified name

      const newState = new Map();
      for (const serviceName of state.keys()) {
        if (serviceName === originalName) {
          newState.set(service.name, service);
          continue;
        }

        newState.set(serviceName, state.get(serviceName));
      }

      return newState;
    }

    case ServiceStateActions.Reorder: {
      const { newOrder } = action.payload;
      if (newOrder.length !== state.size) {
        return state; // The number of services does not match
      }

      const newState: TServiceMap = new Map();
      for (const serviceName of newOrder) {
        if (!state.has(serviceName)) {
          return state; // One of the services does not exist
        }

        newState.set(serviceName, state.get(serviceName)!);
      }

      return newState;
    }

    default:
      return state;
  }
}
