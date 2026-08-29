import React, { useState } from 'react';
import { useForm as useRHForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { Input, Button, Card } from '../components/ui';
import { login as authLogin, loginWithGoogle } from '../services/authService';
import { useStore } from '../lib/store';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useRHForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const user = await authLogin(data);
      login(user);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      setIsGoogleLoading(false);
      toast.error(error instanceof Error ? error.message : 'Google sign-in failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-blue-900">
          <ShieldCheck className="w-12 h-12" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-center gap-3 border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-xs font-bold text-blue-600">
                G
              </span>
            )}
            Continue with Google
          </Button>

          <div className="my-6 flex items-center">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="px-3 text-xs font-medium uppercase tracking-wide text-gray-500">
              or
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <Input
                type="email"
                {...register('email')}
                className={errors.email ? 'border-red-500 focus:ring-red-500' : ''}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                type="password"
                {...register('password')}
                className={errors.password ? 'border-red-500 focus:ring-red-500' : ''}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => toast('Password reset coming soon', { icon: 'ℹ️' })}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            <div>
              <Button 
                type="submit" 
                className="w-full bg-blue-900 hover:bg-blue-800 text-white flex justify-center py-2.5"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
