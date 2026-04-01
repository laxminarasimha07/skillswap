import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api/authApi';
import Input from '../components/shared/Input';
import Button from '../components/shared/Button';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(data);
      login(response.token, response.user);
      toast.success('Welcome back');
      navigate('/feed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <Link to="/" className="mb-8 flex items-center justify-center p-3 rounded-xl hover:bg-slate-900 transition-colors group">
        <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
          <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
            <path d="M3 8l4-5 3 3.5L12 3l1 5-5 5-5-5z" fill="white" />
          </svg>
        </div>
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[360px]"
      >
        <div className="mb-8 text-center bg-transparent">
          <h1 className="text-xl font-semibold text-white tracking-tight">Log in to SkillSwap</h1>
          <p className="text-sm text-slate-400 mt-2">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              placeholder="you@college.edu"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />
            
            <div className="flex justify-between items-center mt-1">
              <span />
              <Link to="#" className="text-xs text-slate-400 hover:text-slate-200">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
              Continue
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
