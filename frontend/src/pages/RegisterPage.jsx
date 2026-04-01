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

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  branch: z.string().min(2, 'Branch is required'),
  year: z.string().min(1, 'Year is required'),
  skillsOffered: z.string().min(1, 'Please list at least one skill'),
  skillsWanted: z.string().min(1, 'Please list at least one skill'),
});

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formatted = {
        ...data,
        skillsOffered: data.skillsOffered.split(',').map(s => s.trim()).filter(Boolean),
        skillsWanted: data.skillsWanted.split(',').map(s => s.trim()).filter(Boolean),
      };
      const res = await authApi.register(formatted);
      login(res.token, res.user);
      navigate('/feed');
    } catch {
      toast.error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-16 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <Link to="/" className="mb-6 flex items-center justify-center p-3 rounded-2xl hover:bg-slate-900 transition-colors z-10 group">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-lg flex items-center justify-center">
          <svg viewBox="0 0 16 16" fill="none" className="h-5 w-5">
            <path d="M3 8l4-5 3 3.5L12 3l1 5-5 5-5-5z" fill="white" />
          </svg>
        </div>
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[480px] z-10"
      >
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white tracking-tight">Create your account</h1>
          <p className="text-sm text-slate-400 mt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors">
              Log in
            </Link>
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-[24px] p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Full Name" placeholder="Jane Doe" {...register('name')} error={errors.name?.message} />
            <Input label="College Email" type="email" placeholder="jane@college.edu" {...register('email')} error={errors.email?.message} />
            <Input label="Password" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />

            <div className="grid grid-cols-2 gap-4">
              <Input label="Branch" placeholder="CS, Art, EE..." {...register('branch')} error={errors.branch?.message} />
              <Input label="Year" placeholder="Sophomore" {...register('year')} error={errors.year?.message} />
            </div>

            <div className="pt-2 space-y-4">
              <Input
                label="I can teach..."
                placeholder="Python, Guitar, Calculus"
                hint="Comma separated"
                {...register('skillsOffered')}
                error={errors.skillsOffered?.message}
              />
              <Input
                label="I want to learn..."
                placeholder="French, React, Design"
                hint="Comma separated"
                {...register('skillsWanted')}
                error={errors.skillsWanted?.message}
              />
            </div>

            <Button type="submit" className="w-full h-11 text-base mt-2 shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)]" isLoading={isLoading}>
              Create Account
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
