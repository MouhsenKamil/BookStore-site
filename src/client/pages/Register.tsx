import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors } 
  } = useForm<RegisterFormInputs>();

  // Watch password field to compare it with confirmPassword
  const password = watch('password', '');

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      await axios.post('/api/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Name"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}

        <input
          type="email"
          placeholder="Email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address',
            },
          })}
        />
        {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters long',
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
              message:
                'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            },
          })}
        />
        {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}

        <input
          type="password"
          placeholder="Confirm Password"
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
        />
        {errors.confirmPassword && (
          <p style={{ color: 'red' }}>{errors.confirmPassword.message}</p>
        )}

        <button type="submit">Register</button>
      </form>
      Already have an account? <a href="/login">Login</a>
    </div>
  );
};

