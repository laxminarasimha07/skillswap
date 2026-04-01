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
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(registerSchema) });

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
    <div className="min-h-screen bg-white flex flex-col justify-center items-center py-20 px-6">
      <Link to="/" className="absolute top-10 left-10 hidden sm:block">
        <div className="h-10 w-10 bg-[#111111] rounded-full flex items-center justify-center">
          <div className="h-4 w-4 bg-white rounded-full" />
        </div>
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[500px]">
        <h1 className="text-4xl font-bold font-['Manrope'] tracking-tight text-[#111111] mb-2">Join the network.</h1>
        <p className="text-[#666666] mb-10 text-lg">Already a member? <Link to="/login" className="text-[#111111] underline underline-offset-4 font-semibold hover:text-[#333333]">Log in</Link></p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input label="Full Name" placeholder="Jane Doe" {...register('name')} error={errors.name?.message} />
          <Input label="College Email" type="email" placeholder="jane@college.edu" {...register('email')} error={errors.email?.message} />
          <Input label="Password" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Branch" placeholder="CS, Art, etc." {...register('branch')} error={errors.branch?.message} />
            <Input label="Year" placeholder="Sophomore" {...register('year')} error={errors.year?.message} />
          </div>

          <Input label="I can teach..." placeholder="e.g. Python, Calculus, Guitar" {...register('skillsOffered')} error={errors.skillsOffered?.message} />
          <Input label="I want to learn..." placeholder="e.g. French, React, Baking" {...register('skillsWanted')} error={errors.skillsWanted?.message} />

          <Button type="submit" className="w-full h-12 text-base mt-2" isLoading={isLoading}>Create Account</Button>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
