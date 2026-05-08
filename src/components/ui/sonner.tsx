import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-right"
      richColors
      closeButton
      duration={3500}
      className="toaster group"
      {...props}
    />
  );
};

export { Toaster };
export { toast } from 'sonner';
