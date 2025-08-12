// Minimal app reducer to satisfy TypeScript isolatedModules and root reducer typing
export interface AppStateShape {
  hasViewedOnboarding: boolean;
  isSignedIn: boolean;
  id: string;
  linkToken: string;
  isVisible: boolean;
}

const initialState: AppStateShape = {
  hasViewedOnboarding: false,
  isSignedIn: false,
  id: '',
  linkToken: '',
  isVisible: true,
};

type AppAction = { type: string; payload?: unknown };

const appReducer = (
  state: AppStateShape = initialState,
  _action: AppAction,
): AppStateShape => {
  // No-op reducer for now. Extend with real actions as needed.
  return state;
};

export default appReducer;
