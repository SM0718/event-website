import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tabs,
  Tab,
  Divider,
} from '@nextui-org/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

function Login() {
  const [authMode, setAuthMode] = useState('login');
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const { setIsLoggedIn, setUserInfo } = useAuthStore();
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    // console.log(data);
    try {
      if (authMode === 'login') {
        // console.log('login');
        const response = await fetch("http://localhost:4000/api/v1/users/login", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'  // Add this header
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            
        }),
        credentials: "include",
        });
    
        if (!response.ok) {
          throw new Error('Registration failed');
        }
    
        const result = await response.json();
        // console.log(result)
        if (result.statusCode === 200) {
          setIsLoggedIn(true);
          setUserInfo(result.data.user);
          toast.success("Login Successful, Redirecting...", {
            position: "top-right",
            autoClose: 3000,
            theme: "dark",
          });

          setTimeout(() => {
            navigate("/"); // Redirect after showing the toast
          }, 2000); // Match the `autoClose` duration
        }
      } else {
        const response = await fetch("http://localhost:4000/api/v1/users/register", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'  // Add this header
          },
          body: JSON.stringify({
            username: data.username,
            email: data.email,
            password: data.password,
            isGuest: false
        }),
        });
    
        if (!response.ok) {
          throw new Error('Registration failed');
        }
    
        const result = await response.json();
        if(result.statusCode === 200) {
          setAuthMode('login')
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
      <Card className="w-full max-w-md shadow-lg rounded-lg border border-gray-200">
        {/* Card Header */}
        <CardHeader className="flex flex-col px-6 py-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-t-lg">
          <h4 className="text-2xl font-bold">
            {authMode === 'login' ? 'Login' : 'Register'}
          </h4>
          <p className="text-sm text-gray-100 mt-2">
            {authMode === 'login'
              ? 'Welcome back! Please login to continue.'
              : 'Create a new account to get started.'}
          </p>
        </CardHeader>

        {/* Card Body */}
        <CardBody className="px-6 py-6 bg-white">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Input (only for Register mode) */}
            {authMode === 'register' && (
              <div className="space-y-1">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  className="focus:ring-indigo-500 focus:border-indigo-500 w-full"
                  {...register('username', { required: 'Username is required' })}
                />
                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="focus:ring-indigo-500 focus:border-indigo-500 w-full"
                {...register('email', { 
                  required: 'Email is required', 
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                    message: 'Please enter a valid email address',
                  }
                })}
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="focus:ring-indigo-500 focus:border-indigo-500 w-full"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              color="primary"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              {authMode === 'login' ? 'Login' : 'Register'}
            </Button>
          </form>
        </CardBody>

        {/* Card Footer */}
        <CardFooter className="px-6 py-4 bg-gray-50 rounded-b-lg flex flex-col gap-3">
          <Button
            variant="light"
            className="text-indigo-600 hover:text-indigo-800"
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
          >
            {authMode === 'login'
              ? "Don't have an account? Register"
              : 'Already have an account? Login'}
          </Button>
          <Divider className="border-gray-300" />
          <Button
            variant="flat"
            color="secondary"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg"
            // onClick={() => setIsLoggedIn(true)}
          >
            Continue as Guest
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
