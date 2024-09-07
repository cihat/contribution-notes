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
    //getting user name
    getUserName: () => {
      let userName = "";
      store.subscribe((state) => {
        userName = state.userName;
      });
      return userName;
    },
  }
}

export const userStore = createUserContributionStore();
