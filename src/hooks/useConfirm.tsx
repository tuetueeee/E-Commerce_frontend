import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type Variant = 'default' | 'danger';

interface ConfirmOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: Variant;
}

interface PromptOptions {
  title?: string;
  description?: string;
  placeholder?: string;
  defaultValue?: string;
  confirmText?: string;
  cancelText?: string;
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  prompt: (options: PromptOptions) => Promise<string | null>;
}

interface DialogState {
  kind: 'confirm' | 'prompt';
  options: ConfirmOptions & PromptOptions;
  resolve: (value: any) => void;
  inputValue?: string;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DialogState | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setState({ kind: 'confirm', options, resolve });
    });
  }, []);

  const prompt = useCallback(
    (options: PromptOptions): Promise<string | null> => {
      return new Promise<string | null>((resolve) => {
        setState({
          kind: 'prompt',
          options,
          resolve,
          inputValue: options.defaultValue ?? '',
        });
      });
    },
    [],
  );

  const close = (value: any) => {
    state?.resolve(value);
    setState(null);
  };

  const handleCancel = () => {
    close(state?.kind === 'prompt' ? null : false);
  };

  const handleConfirm = () => {
    if (state?.kind === 'prompt') {
      close(state.inputValue ?? '');
    } else {
      close(true);
    }
  };

  const isDanger = state?.options.variant === 'danger';
  const confirmBtnClass = isDanger
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : 'bg-black hover:bg-gray-800 text-white';

  const value: ConfirmContextValue = { confirm, prompt };

  return createElement(
    ConfirmContext.Provider,
    { value },
    children,
    state &&
      createElement(
        'div',
        {
          className:
            'fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4',
          onClick: (e: any) => {
            if (e.target === e.currentTarget) handleCancel();
          },
        },
        createElement(
          'div',
          {
            className:
              'bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150',
            onKeyDown: (e: any) => {
              if (e.key === 'Escape') handleCancel();
              if (e.key === 'Enter' && state.kind === 'prompt') handleConfirm();
            },
          },
          state.options.title &&
            createElement(
              'h3',
              { className: 'text-lg font-semibold text-gray-900 mb-2' },
              state.options.title,
            ),
          state.options.description &&
            createElement(
              'p',
              { className: 'text-sm text-gray-600 mb-4' },
              state.options.description,
            ),
          state.kind === 'prompt' &&
            createElement('input', {
              ref: (el: HTMLInputElement | null) => {
                inputRef.current = el;
                if (el) setTimeout(() => el.focus(), 50);
              },
              type: 'text',
              value: state.inputValue ?? '',
              placeholder: state.options.placeholder,
              onChange: (e: any) =>
                setState((prev) =>
                  prev
                    ? { ...prev, inputValue: e.target.value }
                    : prev,
                ),
              onKeyDown: (e: any) => {
                if (e.key === 'Enter') handleConfirm();
              },
              className:
                'w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black mb-4',
            }),
          createElement(
            'div',
            { className: 'flex justify-end gap-2 mt-2' },
            createElement(
              'button',
              {
                onClick: handleCancel,
                className:
                  'px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium',
              },
              state.options.cancelText || 'Hủy',
            ),
            createElement(
              'button',
              {
                onClick: handleConfirm,
                className: `px-4 py-2 rounded-lg transition-colors text-sm font-medium ${confirmBtnClass}`,
              },
              state.options.confirmText ||
                (state.kind === 'prompt' ? 'Lưu' : 'Xác nhận'),
            ),
          ),
        ),
      ),
  );
}

export function useConfirm(): ConfirmContextValue {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirm must be used within a <ConfirmProvider>');
  }
  return ctx;
}
