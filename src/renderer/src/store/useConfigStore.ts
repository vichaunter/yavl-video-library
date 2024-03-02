import { create } from 'zustand';
import { Config } from '../../../main/handlers/getConfigHandler';
import { api } from '../api/apiMedia';

interface ConfigStore {
  config: Config;
  loading: boolean;
  load: () => void;
  setConfig: <K extends keyof Config>(key: K, value: Config[K]) => void;
  persist: () => Promise<boolean>;
}

const useConfigStore = create<ConfigStore>((set, get) => ({
  config: {
    trakt: {},
  },
  loading: true,
  load: async () => {
    set({ loading: true });
    const config = await api.getConfig();
    set({ config, loading: false });
  },
  setConfig: async (key, value) => {
    set({ config: { ...get().config, [key]: value } });
  },
  persist: async () => {
    const config = await api.setConfig(get().config);
    if (!config) return false;

    set({ config });

    return true;
  },
}));

useConfigStore.setState((state) => {
  state.load();
  return state;
});

export default useConfigStore;
