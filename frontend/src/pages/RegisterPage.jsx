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
import { Zap } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  branch: z.string().min(2, 'Branch is required'),
  year: z.string().min(1, 'Year is required'),
  skillsOffered: z.string().min(1, 'Please list at least one skill you offer'),
  skillsWanted: z.string().min(1, 'Please list at least one skill you want'),
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
      const formattedData = {
        ...data,
        skillsOffered: data.skillsOffered.split(',').map(s => s.trim()).filter(s => s !== ''),
        skillsWanted: data.skillsWanted.split(',').map(s => s.trim()).filter(s => s !== ''),
      };
      const response = await authApi.register(formattedData);
      login(response.token, response.user);
      toast.success('Welcome to SkillSwap!');
      navigate('/feed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-cyan-500/8 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-2xl"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent" style={{ fontFamily: 'Poppins, sans-serif' }}>
              SkillSwap
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-[#E5E7EB]" style={{ fontFamily: 'Poppins, sans-serif' }}>Create your account</h1>
          <p className="text-[#6B7280] text-sm mt-1">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-8">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <Input label="Full Name" placeholder="Laxmi Narasimha" {...register('name')} error={errors.name?.message} />
              <Input label="College Email" type="email" placeholder="you@example.com" {...register('email')} error={errors.email?.message} />
              <Input label="Password" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <Input label="Branch" placeholder="CSE" {...register('branch')} error={errors.branch?.message} />
                <Input label="Year" placeholder="3rd Year" {...register('year')} error={errors.year?.message} />
              </div>
              <Input
                label="Skills You Offer"
                placeholder="Java, Python, UI Design"
                {...register('skillsOffered')}
                error={errors.skillsOffered?.message}
              />
              <Input
                label="Skills You Want"
                placeholder="React, AWS, Figma"
                {...register('skillsWanted')}
                error={errors.skillsWanted?.message}
              />
            </div>
            <div className="md:col-span-2 pt-2">
              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Create Account
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
