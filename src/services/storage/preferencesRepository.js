import { PREFERENCE } from '../../config/storage.js';
import { isObject } from '../../lib/validation.js';

export function createPreferencesRepository(getStorage = () => globalThis.localStorage) {
  return {
    load() {
      try {
        const saved = JSON.parse(getStorage().getItem(PREFERENCE));
        if (!isObject(saved)) return { targets: {} };
        return { ...saved, targets: isObject(saved.targets) ? saved.targets : {} };
      } catch {
        return { targets: {} };
      }
    },

    save(preferences) {
      getStorage().setItem(PREFERENCE, JSON.stringify(preferences));
    },
  };
}

export const preferencesRepository = createPreferencesRepository();
