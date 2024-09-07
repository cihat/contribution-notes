import { writable } from "svelte/store";
import type { UserContributions, UserContributionStore } from "./types";

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
    setUserContributions: (userContributions: UserContributions) => {
      store.update((state) => {
        state.userContributions = userContributions;
        return state;
      });
    },
    //TODO: refactor it these getting functions
    getUserName: () => {
      let userName = "";
      store.subscribe((state) => {
        userName = state.userName;
      });
      return userName;
    },
    getUserContributions: () => {
      let userContributions: UserContributions = {
        years: {},
        contributions: {}
      };
      store.subscribe((state) => {
        userContributions = state.userContributions;
      });
      return userContributions;
    }
  }
}

export const userStore = createUserContributionStore();
