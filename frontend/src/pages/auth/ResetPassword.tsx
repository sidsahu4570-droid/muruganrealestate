import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: any) => {
    if (!token) {
      showToast('Reset token is missing or invalid', 'error');
      return;
    }
    if (data.password !== data.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/auth/reset-password', { token, password: data.password });
      showToast('Password reset successfully. Please log in.', 'success');
      navigate('/login');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to reset password';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-gray-100 font-serif mb-2">
          Invalid Request
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          The password reset token is missing. Please initiate a new recovery request.
        </p>
        <Link
          to="/forgot-password"
          className="inline-flex items-center gap-1 text-sm text-accent hover:underline font-semibold"
        >
          Request new reset link
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-gray-100 font-serif mb-2">
        Reset Password
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Please enter and confirm your new password below.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <Input
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
          })}
        />

        <Button
          type="submit"
          variant="accent"
          className="w-full mt-2"
          isLoading={isSubmitting}
        >
          Update Password
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-950 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};
