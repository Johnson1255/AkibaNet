import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '@/services/authService';
import { validateEmail, validatePassword, validatePhone } from '@/utils/validations';

export const useSignUpForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.name) {
      setError('Please enter your full name.');
      setIsLoading(false);
      return;
    }

    if (!formData.email || !validateEmail(formData.email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    if (!formData.password || !validatePassword(formData.password)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      setIsLoading(false);
      return;
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      setError('Please enter a valid 10-digit phone number.');
      setIsLoading(false);
      return;
    }

    try {
      await register(formData);
      setError('Registration successful. Please log in manually.');
      setTimeout(() => {
        navigate('/login', { state: { email: formData.email } });
      }, 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error creating account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    error,
    isLoading,
    handleSubmit
  };
};
