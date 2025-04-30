import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, Save } from 'lucide-react';

export default function LoadingPage() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  
  const formSteps = [
    { id: 1, name: 'Personal Info', status: 'completed' },
    { id: 2, name: 'Contact Details', status: 'completed' },
    { id: 3, name: 'Preferences', status: 'completed' },
    { id: 4, name: 'Review', status: 'completed' },
    { id: 5, name: 'Saving Data', status: 'in-progress' }
  ];

  // Messages to show during the final saving process
  const savingMessages = [
    'Initializing data submission',
    'Processing your information',
    'Securing your data',
    'Finalizing your submission',
    'Almost there'
  ];

  useEffect(() => {
    // Simulate saving progress
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = Math.min(oldProgress + Math.random() * 8, 100);
        
        // Update current message based on progress
        const messageIndex = Math.min(
          Math.floor(newProgress / 20),
          savingMessages.length - 1
        );
        setCurrentStep(messageIndex);
        
        if (newProgress === 100) {
          clearInterval(interval);
          setTimeout(() => setCompleted(true), 500);
        }
        
        return newProgress;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex z-[5000] top-0 sticky flex-col justify-center items-center w-screen max-h-[100dvh] bg-white p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-orange-500 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ff7900' }}>
            {completed ? (
              <CheckCircle className="text-white" size={32} />
            ) : (
              <Save className="text-white" size={32} />
            )}
          </div>
          
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            {completed ? 'Submission Complete!' : 'Saving Your Information'}
          </h1>
          
          {!completed && (
            <p className="text-sm text-gray-500 mt-1">Step {currentStep} of 5: {savingMessages[currentStep]}</p>
          )}
          
          {completed && (
            <p className="text-sm text-green-600 mt-1">All steps completed successfully</p>
          )}
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-between mb-6">
          {formSteps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                  index < 4 ? 'bg-green-100 text-green-600' : 
                  completed ? 'bg-green-100 text-green-600' : 'text-white'
                }`}
                style={{ backgroundColor: index === 4 && !completed ? '#ff7900' : '' }}
              >
                {index < 4 ? (
                  <CheckCircle size={16} />
                ) : completed ? (
                  <CheckCircle size={16} />
                ) : (
                  <Loader2 className="animate-spin" size={16} />
                )}
              </div>
              <span className="text-xs mt-1 hidden md:block">{step.name}</span>
            </div>
          ))}
        </div>
        
        {/* Progress indicator */}
        {!completed && (
          <div className="mb-8">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progress}%`, backgroundColor: '#ff7900' }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">{Math.round(progress)}% complete</span>
              <span className="text-xs text-gray-500">{savingMessages[currentStep]}</span>
            </div>
          </div>
        )}
        
        {/* Success message when completed */}
        {completed && (
          <div className="text-center p-6 bg-green-50 rounded-lg border border-green-100 mb-8">
            <CheckCircle className="text-green-500 mx-auto mb-2" size={32} />
            <h2 className="text-lg font-medium text-gray-800 mb-1">Data Saved Successfully</h2>
            <p className="text-sm text-gray-600">Your information has been securely saved to our system.</p>
            
            <button 
              className="mt-4 px-6 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: '#ff7900' }}
            >
              Prévisualiser ma carte
            </button>
          </div>
        )}
        
        {/* Tips or information */}
        {!completed && (
          <div className="p-4 bg-blue-50 rounded-lg text-sm text-center text-gray-600">
            <p className="font-medium text-gray-700 mb-1">While we save your information:</p>
            <p>Your data is encrypted and stored securely according to our privacy policy.</p>
          </div>
        )}
      </div>
    </div>
  );
}