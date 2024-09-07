import { writable } from "svelte/store";
import type { responseType, UserContributionStore } from "./types";

function createUserContributionStore() {
  const store = writable<UserContributionStore>({
    userName: "",
    userContributions: {
      years: {},
      contributions: {}
    }
  });

  return {
    subscribe: store.subscribe,
    setUserName: (userName: string) => {
      store.update((state) => {
        state.userName = userName;
        return state;
      });
    },
    setUserContributions: (userContributions: responseType) => {
      store.update((state) => {
        state.userContributions = userContributions;
        return state;
      });
    }
  }
}

export const userStore = createUserContributionStore();
