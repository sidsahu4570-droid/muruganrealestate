import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useToast } from '../../context/ToastContext';

export const ChangePassword: React.FC = () => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = async (data: any) => {
    if (data.newPassword !== data.confirmNewPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      showToast('Password updated successfully', 'success');
      reset();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to change password';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">Security Settings</h1>
        <p className="text-sm text-slate-500">Modify your security access credentials below.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            error={errors.currentPassword?.message}
            {...register('currentPassword', { required: 'Current password is required' })}
          />

          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            error={errors.newPassword?.message}
            {...register('newPassword', {
              required: 'New password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmNewPassword?.message}
            {...register('confirmNewPassword', { required: 'Please confirm new password' })}
          />

          <Button type="submit" variant="accent" className="w-full mt-2" isLoading={isSubmitting}>
            Update Password
          </Button>
        </form>
      </Card>
    </div>
  );
};
