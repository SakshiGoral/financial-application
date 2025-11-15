import LoginForm from '@/components/auth/login-form';
import Card3D from '@/components/shared/card-3d';
import { TrendingUp } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card3D>
          <div className="relative z-10 w-full rounded-2xl border border-border bg-card/80 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-8 text-center">
              <TrendingUp className="mx-auto mb-4 h-16 w-16 text-primary" />
              <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-4xl font-extrabold text-transparent">
                FinTrack Pro
              </h1>
            </div>
            <LoginForm />
          </div>
        </Card3D>
      </div>
    </div>
  );
}
