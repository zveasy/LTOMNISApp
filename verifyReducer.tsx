// Minimal verify reducer to satisfy root reducer import
export interface VerifyState {
  status: 'idle' | 'pending' | 'verified' | 'failed';
}

const initialState: VerifyState = {
  status: 'idle',
};

type VerifyAction = { type: string; payload?: unknown };

export default function verifyReducer(
  state: VerifyState = initialState,
  _action: VerifyAction,
): VerifyState {
  // No-op for now. Extend with real actions later.
  return state;
}
