import { useState } from 'react';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'; // Import the zodResolver
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

// Define the Zod schema for form validation
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const Login = () => {
  const api = useApi();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const handleLogin = async (data) => {
    setLoading(true);
    setServerError('');
  
    try {
      const response = await api.post('/api/login', data);
  
      // Set token with expiration
      const token = response.data.token;
      const ttl = 3600000;
      const now = new Date();
  
      const tokenWithExpiry = {
        value: token,
        expiry: now.getTime() + ttl,
      };
  
      localStorage.setItem('token', JSON.stringify(tokenWithExpiry));
  
      navigate('/admin');
    } catch (error) {
      setServerError('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
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
        <form onSubmit={handleSubmit(handleLogin)} className="bg-white bg-opacity-45 shadow-4xl border border-orange-400 p-8 flex flex-col space-y-4">
          <h1 className="text-center font-bold text-lg text-orange-300">Login</h1>
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
          {/* Email Field */}
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="text" variant="orange" placeholder="Email" {...field} />
                  {/* <input type="email" placeholder="Email" {...field} /> */}
                </FormControl>
                {errors.email && <FormMessage>{errors.email.message}</FormMessage>}
              </FormItem>
            )}
          />

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

          {/* Submit Button */}
          <div>
            {loading ? (
              <Button variant="waguer2" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button variant="waguer2">Login</Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  </div>
  );
};

export default Login;
