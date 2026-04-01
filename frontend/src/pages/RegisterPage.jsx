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
      toast.success('Account created successfully');
      navigate('/feed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-12 px-4">
      <Link to="/" className="mb-6 flex items-center justify-center p-3 rounded-xl hover:bg-slate-900 transition-colors group">
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
        className="w-full max-w-[440px]"
      >
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-white tracking-tight">Create your account</h1>
          <p className="text-sm text-slate-400 mt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 hover:underline">
              Log in
            </Link>
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Full Name" placeholder="Jane Doe" {...register('name')} error={errors.name?.message} />
            <Input label="Email address" type="email" placeholder="jane@college.edu" {...register('email')} error={errors.email?.message} />
            <Input label="Password" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />

            <div className="grid grid-cols-2 gap-4">
              <Input label="Branch" placeholder="CS, EE, etc." {...register('branch')} error={errors.branch?.message} />
              <Input label="Year" placeholder="Freshman, Senior" {...register('year')} error={errors.year?.message} />
            </div>

            <div className="space-y-4 pt-2">
              <Input
                label="Skills you can teach"
                placeholder="Python, React, Guitar..."
                hint="Comma separated"
                {...register('skillsOffered')}
                error={errors.skillsOffered?.message}
              />
              <Input
                label="Skills you want to learn"
                placeholder="Machine Learning, French..."
                hint="Comma separated"
                {...register('skillsWanted')}
                error={errors.skillsWanted?.message}
              />
            </div>

            <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
              Create account
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
