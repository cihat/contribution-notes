import { writable } from "svelte/store";
import { Status, type State, type UserContributions } from "./types";

const initialState: State = {
  userName: "",
  userContributions: null,
  status: Status.Idle,
};

function createUserContributionStore() {
  const { subscribe, update, set } = writable<State>(initialState);

  return {
    subscribe,
    setUserName: (userName: string) => {
      update((state) => ({
        ...state,
        userName,
      }));
    },
    setUserContributions: (userContributions: UserContributions) => {
      update((state) => {
        if (!userContributions.years.length || !Object.keys(userContributions.contributions).length) {
          return {
            ...state,
            status: Status.Error,
          };
        }
        return {
          ...state,
          userContributions,
          status: Status.Success,
        };
      });
    },
    setStatus: (status: Status) => {
      update((state) => ({
        ...state,
        status,
      }));
    },
    reset: () => {
      set(initialState);
    },
  };
}

export const userStore = createUserContributionStore();
