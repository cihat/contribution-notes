import { writable } from "svelte/store";
import { Status, TabEntryEnum, type State as StoreState, type UserContributions } from "./types";
import { toast } from "svelte-sonner";

const initialState: StoreState = {
  userName: "",
  repoName: "",
  repoData: {},
  requestType: TabEntryEnum.Contributions,
  userContributions: null,
  status: {
    type: Status.Idle,
    message: "",
  }
};

function createUserContributionStore() {
  const { subscribe, update, set } = writable<StoreState>(initialState);

  return {
    subscribe,
    set,
    setUserName: (userName: string) => {
      update((state) => ({
        ...state,
        userName,
      }));
    },
    setRepoName: (repoName: string) => {
      update((state) => ({
        ...state,
        repoName,
      }));
    },
    setUserContributions: (userContributions: UserContributions) => {
      update((state) => {
        if (userContributions.years.length == 0 || userContributions.contributions.length == 0) {
          return {
            ...initialState,
            status: Status.Error,
          };
        }

        toast.success('User found successfully 🚀', {
          description: "User's contributions are fetched successfully!"
        });
        return {
          ...state,
          userContributions,
          status: {
            type: Status.Success,
          }
        };
      });
    },
    setRequestType: (requestType: TabEntryEnum) => {
      update((state) => ({
        ...state,
        requestType,
      }))
    },
    setRepoData: (repoData: object) => {
      update((state) => ({
        ...state,
        repoData,
        status: {
          type: Status.Success,
          message: "Repository data fetched successfully!"
        }
      }));
    },
    setStatus: ({ type, message }: { type: Status, message: string }) => {
      update((state) => ({
        ...state,
        status: {
          ...state.status,
          type,
          message

        }
      }));
    },
    reset: () => {
      set(initialState);
    },
  };
}

export const userStore = createUserContributionStore();
