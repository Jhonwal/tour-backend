import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { BadgeInfo, Loader2, SquareX } from 'lucide-react';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useApi from "@/services/api.js";
import { useNavigate, useParams } from 'react-router-dom';

// Define the Zod schema for form validation
const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  password_confirmation: z.string(),
}).refine(data => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ['password_confirmation'],
});

const ResetPassword = () => {
  const api = useApi();
  const { token } = useParams();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      password_confirmation: '',
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const handleResetPassword = async (data) => {
    setLoading(true);
    setServerError('');
    setSuccessMessage('');
    data.email = localStorage.getItem('email');

    try {
      const response = await api.post('/api/reset-password', {
        ...data,
        token,
      });
      setSuccessMessage('Password reset successfully.');
      //navigate to login after 30 second
      setTimeout(() => {
        navigate('/login');
        }, 30000);
      setLoading(false);
   } catch (error) {
      setLoading(false);
      if (error.response) {
        setServerError(error.response.data.message || 'Failed to reset password. Please try again.');
      } else {
        setServerError('Failed to reset password. Please try again.');
        setLoading(false);
      }
   }   
  };

  const closeError = () => {
    setServerError('');
  };

  return (
    <div className="!bg-[url('/images/maroc_gate.webp')] bg-fixed bg-cover bg-center min-h-screen p-8">
      <div className="max-w-2xl mx-auto p-8 bg-orange-100 rounded-3xl bg-opacity-75">
        <img src="/images/waguer.png" alt="logo" className="w-40 mx-auto my-3" />
        <Form {...form}>
          <form onSubmit={handleSubmit(handleResetPassword)} className="bg-white bg-opacity-45 shadow-4xl border border-orange-400 p-8 flex flex-col space-y-4">
            <h1 className="text-center font-bold text-lg text-orange-300">Reset Password</h1>
            {/* alerts */}
            {serverError && (
              <div
                id="alert-border-2"
                className="flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800"
                role="alert"
              >
                <BadgeInfo className="mr-3" />
                <div className="ms-3 text-sm font-medium">{serverError}</div>
                <SquareX
                  onClick={closeError}
                  className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 hover:text-red-600 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:cursor-pointer inline-flex items-center justify-center h-8 w-8"
                />
              </div>
            )}
            {successMessage && (
              <div
                id="alert-border-3"
                className="flex items-center p-4 mb-4 text-green-800 border-t-4 border-green-300 bg-green-50 dark:text-green-400 dark:bg-gray-800 dark:border-green-800"
                role="alert"
              >
                <BadgeInfo className="mr-3" />
                <div className="ms-3 text-sm font-medium">{successMessage}</div>
              </div>
            )}
            {/* Password Field */}
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" variant="orange" placeholder="Password" {...field} />
                  </FormControl>
                  {errors.password && <FormMessage>{errors.password.message}</FormMessage>}
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" variant="orange" placeholder="Confirm Password" {...field} />
                  </FormControl>
                  {errors.password_confirmation && <FormMessage>{errors.password_confirmation.message}</FormMessage>}
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div>
              {loading ? (
                <Button variant="waguer2" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button variant="waguer2">Reset Password</Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;