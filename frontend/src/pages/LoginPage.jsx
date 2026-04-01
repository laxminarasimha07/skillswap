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
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(data);
      login(response.token, response.user);
      navigate('/feed');
    } catch {
      toast.error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-6">
      <Link to="/" className="absolute top-10 left-10">
        <div className="h-10 w-10 bg-[#111111] rounded-full flex items-center justify-center">
          <div className="h-4 w-4 bg-white rounded-full" />
        </div>
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[400px]">
        <h1 className="text-4xl font-bold font-['Manrope'] tracking-tight text-[#111111] mb-2">Welcome back.</h1>
        <p className="text-[#666666] mb-10 text-lg">Don't have an account? <Link to="/register" className="text-[#111111] underline underline-offset-4 font-semibold hover:text-[#333333]">Sign up</Link></p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input label="Email address" type="email" placeholder="name@college.edu" {...register('email')} error={errors.email?.message} />
          <Input label="Password" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />
          <Button type="submit" className="w-full h-12 text-base" isLoading={isLoading}>Log In</Button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
