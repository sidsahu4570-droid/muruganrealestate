import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { ChevronLeft } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await api.post('/auth/forgot-password', { email: data.email });
      showToast('Password reset link sent if account exists', 'success');
      setEmailSent(true);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error processing request';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-gray-100 font-serif mb-2">
        Recover Password
      </h3>

      {!emailSent ? (
        <>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Enter your account email below. We'll dispatch a link to reset your security credentials.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />

            <Button
              type="submit"
              variant="accent"
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              Send Reset Link
            </Button>
          </form>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
            An email with recovery instructions has been dispatched to your mailbox. Please check your spam folder if it doesn't arrive within 5 minutes.
          </p>
        </div>
      )}

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
