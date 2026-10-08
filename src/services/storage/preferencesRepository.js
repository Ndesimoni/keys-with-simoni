import { PREFERENCE } from '../../config/storage.js';
import { isObject } from '../../lib/validation.js';

export function createPreferencesRepository(getStorage = () => globalThis.localStorage) {
  return {
    load() {
      try {
        const saved = JSON.parse(getStorage().getItem(PREFERENCE));
        if (!isObject(saved)) return { targets: {}, theme: 'dark' };
        return {
          ...saved,
          targets: isObject(saved.targets) ? saved.targets : {},
          theme: saved.theme === 'light' ? 'light' : 'dark',
        };
      } catch {
        return { targets: {}, theme: 'dark' };
      }
    },

    save(preferences) {
      getStorage().setItem(PREFERENCE, JSON.stringify(preferences));
    },
  };
}

export const preferencesRepository = createPreferencesRepository();
