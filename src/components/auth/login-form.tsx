'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function LoginForm() {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const { login, signup, getPassword } = useAuth();
  const { toast } = useToast();

  const resetForm = () => {
    setName('');
    setEmail('');
    setPass('');
    setMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    setTimeout(() => {
      if (mode === 'signup') {
        if (!name || !email || !pass) {
          setMsg('All fields are required for signup.');
        } else if (signup(name, email, pass)) {
          // Success handled by context
        } else {
          setMsg('An account with this email already exists.');
        }
      } else if (mode === 'login') {
        if (!login(email, pass)) {
          setMsg('Invalid credentials. Please try again.');
        }
      } else { // forgot
        const recoveredPass = getPassword(email);
        setMsg(recoveredPass ? `Hint: Your password is "${recoveredPass}"` : 'Email not found.');
      }
      setLoading(false);
    }, 800);
  };

  const renderMessage = () => {
    if (!msg) return null;
    const isSuccess = msg.includes('Hint:');
    return (
      <div className={`mb-4 rounded-xl p-3 text-sm font-medium ${isSuccess ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
        {msg}
      </div>
    );
  };

  return (
    <>
      <p className="mb-4 text-center text-muted-foreground">
        {mode === 'signup' ? 'Create a new account' : mode === 'login' ? 'Welcome back' : 'Recover your password'}
      </p>
      {renderMessage()}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full name" />
        )}
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" />
        {mode !== 'forgot' && (
          <div className="relative">
            <Input
              type={showPass ? 'text' : 'password'}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
              placeholder="Password"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:bg-secondary"
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        )}
        {mode === 'login' && (
          <Button type="button" variant="link" className="h-auto p-0 text-sm text-primary" onClick={() => { setMode('forgot'); resetForm(); }}>
            Forgot Password?
          </Button>
        )}
        <Button type="submit" disabled={loading} className="w-full font-bold">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (mode === 'signup' ? 'Create Account' : mode === 'login' ? 'Sign In' : 'Get Password')}
        </Button>
      </form>
      <div className="mt-6 text-center text-sm text-muted-foreground">
        {mode === 'login' ? (
          <span>
            No account?{' '}
            <Button variant="link" className="p-0 h-auto font-semibold text-primary" onClick={() => { setMode('signup'); resetForm(); }}>
              Sign Up
            </Button>
          </span>
        ) : mode === 'signup' ? (
          <span>
            Have an account?{' '}
            <Button variant="link" className="p-0 h-auto font-semibold text-primary" onClick={() => { setMode('login'); resetForm(); }}>
              Sign In
            </Button>
          </span>
        ) : (
          <span>
            Remembered?{' '}
            <Button variant="link" className="p-0 h-auto font-semibold text-primary" onClick={() => { setMode('login'); resetForm(); }}>
              Sign In
            </Button>
          </span>
        )}
      </div>
    </>
  );
}
