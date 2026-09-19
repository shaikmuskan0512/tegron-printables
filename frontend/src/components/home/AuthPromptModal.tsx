import { Link } from 'react-router-dom';
import { Sparkle, SunFace } from '@/components/brand/Doodles';
import { buttonClass } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  text: string;
  returnTo: string;
}

/** Shown when a visitor tries to submit without an account. */
export function AuthPromptModal({ open, onClose, title, text, returnTo }: Props) {
  const redirect = encodeURIComponent(returnTo);
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm" hideTitle>
      <div className="flex flex-col items-center pt-2 text-center">
        <div className="relative">
          <SunFace className="h-24 w-24" />
          <Sparkle className="absolute -right-3 top-2 h-5 w-5 text-coral-400" />
        </div>
        <h2 className="mt-3 font-display text-2xl font-semibold">{title}</h2>
        <p className="mt-2 text-ink-500">{text}</p>
        <div className="mt-6 grid w-full gap-2.5">
          <Link to={`/?redirect=${redirect}`} className={buttonClass('teal', 'lg')}>Login</Link>
          <Link to={`/signup?redirect=${redirect}`} className={buttonClass('primary', 'lg')}>Create Account</Link>
        </div>
        <p className="mt-4 text-xs text-ink-500">We'll keep what you've written so far.</p>
      </div>
    </Modal>
  );
}