import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MergeRequestStoreState {
  apiUrl: string;
  mergeRequestLink: string;
  apiToken: string;
  setApiUrl: (val: string) => void;
  setMergeRequestLink: (val: string) => void;
  setApiToken: (val: string) => void;
}

export const useMergeRequestStore = create<MergeRequestStoreState>()(
  persist(
    (set) => ({
      apiUrl: '',
      mergeRequestLink: '',
      apiToken: '',

      setApiUrl: (val) => {
        set({ apiUrl: val });
      },
      setMergeRequestLink: (val) => {
        set({ mergeRequestLink: val });
      },
      setApiToken: (val) => {
        set({ apiToken: val });
      }
    }),
    {
      name: 'merge-request-store'
    }
  )
);
