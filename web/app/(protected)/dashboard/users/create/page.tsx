'use client';

import { useState } from 'react';
import { Mail, Lock, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { validators, validationMessages } from '@/lib/utils/validators';
import { toast } from 'sonner';
import type { ApiError } from '@/lib/api/types';

export default function CreateUserPage() {
  const { createUser } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!form.email) {
      newErrors.email = validationMessages.email.required;
    } else if (!validators.email(form.email)) {
      newErrors.email = validationMessages.email.invalid;
    }

    if (!form.password) {
      newErrors.password = validationMessages.password.required;
    } else if (!validators.password(form.password, 8)) {
      newErrors.password = validationMessages.password.tooShort(8);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      await createUser(form);
      toast.success('User created successfully!');
      setForm({ email: '', password: '' });
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New User</h1>
            <p className="text-gray-600">Add a new user to the system</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="user@example.com"
            icon={Mail}
            error={errors.email}
            disabled={loading}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            icon={Lock}
            error={errors.password}
            disabled={loading}
          />

          <Button type="submit" loading={loading} loadingText="Creating..." icon={UserPlus}>
            Create User
          </Button>
        </form>
      </div>
    </div>
  );
}
