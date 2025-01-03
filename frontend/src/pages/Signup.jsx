import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    referral: '',
    mentalCondition: '',
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    ageGroup: '',
    gender: '',
    country: '',
    goals: '',
    preferences: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const referralOptions = [
    'Social Media',
    'Friend/Family Recommendation',
    'Healthcare Provider',
    'Online Search',
    'Advertisement',
    'Other'
  ];

  const mentalConditionOptions = [
    'Anxiety',
    'Depression',
    'PTSD',
    'Bipolar Disorder',
    'OCD',
    'Prefer not to say',
    'Other'
  ];

  const ageGroupOptions = [
    'Under 18',
    '18-24',
    '25-34',
    '35-44',
    '45-54',
    '55+',
  ];

  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

  const goalOptions = [
    'Improve mental health',
    'Manage stress',
    'Build resilience',
    'Enhance relationships',
    'Boost productivity',
    'Other',
  ];

  const preferenceOptions = [
    'Text-based communication',
    'Video calls',
    'In-person sessions',
    'No preference'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOptionSelect = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const nextStep = () => {
    const requiredFields = {
      1: 'referral',
      2: 'mentalCondition',
      3: 'ageGroup',
      4: 'gender',
      5: 'country',
      6: 'goals',
      7: 'preferences',
    };

    if (requiredFields[currentStep] && !formData[requiredFields[currentStep]]) {
      setError(`Please select your ${requiredFields[currentStep]}`);
      return;
    }

    setError(null);
    setCurrentStep(currentStep + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/signup', formData);
      if (response.status === 201) {
        setSuccess('You joined our community!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const renderOptionButtons = (options, field, title) => (
    <div className="space-y-4">
      <h3 className="text-2xl font-medium mb-6" style={{ color: '#4D6A6D' }}>
        {title}
      </h3>
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleOptionSelect(field, option)}
            className="w-full p-4 text-left rounded-xl transition-all duration-300 hover:shadow-md"
            style={{ 
              backgroundColor: formData[field] === option ? '#4D6A6D' : 'white',
              color: formData[field] === option ? 'white' : '#4C5B61',
              border: `1px solid ${formData[field] === option ? '#4D6A6D' : '#829191'}`
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderOptionButtons(referralOptions, 'referral', 'How did you find us?');
      case 2:
        return renderOptionButtons(mentalConditionOptions, 'mentalCondition', 'What best describes your condition?');
      case 3:
        return renderOptionButtons(ageGroupOptions, 'ageGroup', 'What is your age group?');
      case 4:
        return renderOptionButtons(genderOptions, 'gender', 'What is your gender?');
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-medium mb-6" style={{ color: '#4D6A6D' }}>
              What country are you from?
            </h3>
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2"
              style={{ 
                border: '1px solid #829191',
                backgroundColor: 'white'
              }}
            />
          </div>
        );
      case 6:
        return renderOptionButtons(goalOptions, 'goals', 'What are your goals?');
      case 7:
        return renderOptionButtons(preferenceOptions, 'preferences', 'What are your preferences?');
      case 8:
        return (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {[
              { name: 'name', placeholder: 'Full Name' },
              { name: 'username', placeholder: 'Pseudo Name' },
              { name: 'email', placeholder: 'Email', type: 'email' },
              { name: 'password', placeholder: 'Password', type: 'password' },
              { name: 'confirmPassword', placeholder: 'Confirm Password', type: 'password' }
            ].map((field) => (
              <input
                key={field.name}
                type={field.type || 'text'}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2"
                style={{ 
                  border: '1px solid #829191',
                  backgroundColor: 'white'
                }}
              />
            ))}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-medium mt-8 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              style={{ 
                backgroundColor: '#4D6A6D',
                color: 'white'
              }}
            >
              Create Account
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: '#C5C5C5' }}>
      <div className="max-w-md w-full space-y-8 p-10 rounded-2xl shadow-xl" style={{ backgroundColor: 'white' }}>
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#4D6A6D' }}>
          Join Our Community
        </h2>

        <div className="mb-8">
          {renderStep()}
        </div>

        {error && (
          <div className="p-3 rounded-lg text-center mb-4" style={{ backgroundColor: '#ffebee', color: '#c62828' }}>
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 rounded-lg text-center mb-4" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
            {success}
          </div>
        )}

        {currentStep < 8 && (
          <button
            onClick={nextStep}
            className="w-full py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            style={{ 
              backgroundColor: '#4D6A6D',
              color: 'white'
            }}
          >
            Continue
          </button>
        )}

        <div className="flex justify-center space-x-3 mt-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
            <div
              key={step}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentStep === step ? 'w-4' : ''
              }`}
              style={{ 
                backgroundColor: currentStep === step ? '#4D6A6D' : '#829191'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Signup;
