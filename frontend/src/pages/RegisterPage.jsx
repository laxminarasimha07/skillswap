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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Convert comma-separated strings to arrays
      const formattedData = {
        ...data,
        skillsOffered: data.skillsOffered.split(',').map(s => s.trim()).filter(s => s !== ''),
        skillsWanted: data.skillsWanted.split(',').map(s => s.trim()).filter(s => s !== ''),
      };
      
      const response = await authApi.register(formattedData);
      login(response.token, response.user);
      toast.success('Registration successful! Welcome to Skill Swap.');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-xl sm:px-10 border border-gray-100">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <Input
                label="Full Name"
                placeholder="John Doe"
                {...register('name')}
                error={errors.name?.message}
              />

              <Input
                label="College Email"
                type="email"
                placeholder="your.email@example.com"
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
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Branch"
                  placeholder="CSE"
                  {...register('branch')}
                  error={errors.branch?.message}
                />
                <Input
                  label="Year"
                  placeholder="3rd Year"
                  {...register('year')}
                  error={errors.year?.message}
                />
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

            <div className="md:col-span-2">
              <Button
                type="submit"
                className="w-full mt-4"
                size="lg"
                isLoading={isLoading}
              >
                Create Account
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
