import { STORAGE } from '../../config/storage.js';
import { SEED_CRM } from '../../data/demo.js';
import { normalizeEnvelope } from '../../lib/validation.js';

/** Storage is resolved when used so importing this module is safe outside a browser. */
export function createWorkspaceRepository(getStorage = () => globalThis.localStorage) {
  return {
    read() {
      let raw = null;
      try {
        raw = getStorage().getItem(STORAGE);
        const workspace =
          raw === null
            ? { data: SEED_CRM(), demo: true, createdAt: new Date().toISOString() }
            : normalizeEnvelope(JSON.parse(raw));
        return { workspace, error: null, raw };
      } catch (error) {
        return {
          workspace: null,
          error:
            raw === null
              ? 'Browser storage could not be read.'
              : `The saved workspace could not be opened. ${error.message}`,
          raw,
        };
      }
    },

    load() {
      const result = this.read();
      if (result.error) throw Error(result.error);
      return result.workspace;
    },

    save(workspace) {
      // Propagate write failures; the React persistence hook owns the user notification.
      getStorage().setItem(STORAGE, JSON.stringify(workspace));
    },
  };
}

export const workspaceRepository = createWorkspaceRepository();
