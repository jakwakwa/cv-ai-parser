'use client';

// Inspired by react-hot-toast library
import * as React from 'react';

import type { ToastActionElement, ToastProps } from '@/src/components/ui/toast';

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType['ADD_TOAST'];
      toast: ToasterToast;
    }
  | {
      type: ActionType['UPDATE_TOAST'];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType['DISMISS_TOAST'];
      toastId?: ToasterToast['id'];
    }
  | {
      type: ActionType['REMOVE_TOAST'];
      toastId?: ToasterToast['id'];
    };

interface State {
  toasts: ToasterToast[];
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case 'DISMISS_TOAST': {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        // Calls addToRemoveQueue through the context's dispatch
        // The actual logic is now in ToastProvider
        return {
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === toastId || toastId === undefined
              ? {
                  ...t,
                  open: false,
                }
              : t
          ),
        };
      }

      // If no toastId, dismiss all
      return {
        ...state,
        toasts: state.toasts.map((t) => ({
          ...t,
          open: false,
        })),
      };
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

type Toast = Omit<ToasterToast, 'id'>;

interface ToastContextType extends State {
  toast: (props: Toast) => {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
  };
  dismiss: (toastId?: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, { toasts: [] });

  const toastTimeouts = React.useRef(
    new Map<string, ReturnType<typeof setTimeout>>()
  );

  const addToRemoveQueue = React.useCallback((toastId: string) => {
    if (toastTimeouts.current.has(toastId)) {
      return;
    }

    const timeout = setTimeout(() => {
      toastTimeouts.current.delete(toastId);
      dispatch({
        type: 'REMOVE_TOAST',
        toastId: toastId,
      });
    }, TOAST_REMOVE_DELAY);

    toastTimeouts.current.set(toastId, timeout);
  }, []);

  const toast = React.useCallback((props: Toast) => {
    const id = genId();

    const update = (newProps: ToasterToast) =>
      dispatch({
        type: 'UPDATE_TOAST',
        toast: { ...newProps, id },
      });
    const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });

    dispatch({
      type: 'ADD_TOAST',
      toast: {
        ...props,
        id,
        open: true,
        onOpenChange: (open) => {
          if (!open) dismiss();
        },
      },
    });

    return {
      id: id,
      dismiss,
      update,
    };
  }, []);

  const dismissAllToasts = React.useCallback((toastId?: string) => {
    if (toastId) {
      dispatch({ type: 'DISMISS_TOAST', toastId });
    } else {
      dispatch({ type: 'DISMISS_TOAST' }); // Dismiss all if no ID
    }
  }, []);

  React.useEffect(() => {
    state.toasts.forEach((t) => {
      if (t.open) {
        addToRemoveQueue(t.id);
      }
    });
  }, [state.toasts, addToRemoveQueue]);

  return (
    <ToastContext.Provider
      value={{
        ...state,
        toast,
        dismiss: dismissAllToasts,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
