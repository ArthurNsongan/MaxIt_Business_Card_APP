import React, { useEffect, useState } from 'react'
import { useAppBar } from '../contexts/appbar_context';
import { useRef } from 'react';
import { Facebook, LinkedinIcon, Mail, MailIcon, MapPin, PhoneCallIcon, Plus, X } from 'lucide-react';

function EditCard() {

  const { setTitle, setShowBackButton, setActions } = useAppBar();

  const [formData, setFormData] = useState({
    phone_number: '',
    first_name: '',
    last_name: '',
    job_title: '',
    company: '',
    address: '',
    city: '',
    country: '',
    email: '',
    website_url: '',
    bio: '',
    linkedin_url: '',
    twitter_url: '',
    instagram_url: '',
    facebook_url: '',
    other_socials: '',
    profile_photo_url: '',
    company_logo_url: '',
    cover_image_url: '',
    background_color: '#4361ee',
    text_color: '#1e1e24',
    font_family: "'Inter', sans-serif"
  });

  // Color and font options
  const colorOptions = [
    '#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0', '#4895ef'
  ];
  
  const fontOptions = [
    { value: "'Inter', sans-serif", label: "Inter (modern)" },
    { value: "'Helvetica Neue', sans-serif", label: "Helvetica (classic)" },
    { value: "Georgia, serif", label: "Georgia (elegant)" },
    { value: "'Courier New', monospace", label: "Courier (technical)" }
  ];
  

  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    setTitle('EditCard');
    setShowBackButton(true);
    
    return () => {
      setActions(null);
    };
  }, [setTitle, setShowBackButton, setActions]);

  const FormSteps = [
    {
        name: "Mes informations",
        title: "Donnez nous vos informations personnelles",
        id: 1
    },
    {
        name: "Contact",
        title: "Contact",
        id: 2
    },
    {
        name: "Réseaux sociaux",
        title: "Réseaux sociaux",
        id: 3
    },
    {
        name: "Personnalisation",
        title: "Personnalisation",
        id: 4
    }
  ]

  const [currentStep, setCurrentStep] = useState(1);

  const getStepLabel = (step) => {
    return FormSteps.find(t => t.id == step);
  }

  const nextStep = () => {
    if(currentStep < 4) {
        setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if(currentStep > 1) {
        setCurrentStep(currentStep - 1)
    }
  }

  // Form validation
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
      if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    }
    
    if (step === 2) {
      if (!formData.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
      if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle file uploads
  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, [field]: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      console.log('Form data to submit:', formData);
      // Here you would typically send data to your backend API
      alert('Profile saved successfully!');
    }
  };

  const [socialLinks, setSocialLinks] = useState([
    { platform: 'Facebook', username: 'fready_oyono' },
    { platform: 'LinkedIn', username: 'fready_oyono' }
  ]);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newPlatform, setNewPlatform] = useState('');
  const [newUsername, setNewUsername] = useState('');

  const handleAddSocial = () => {
    if (newPlatform && newUsername) {
      setSocialLinks([...socialLinks, { platform: newPlatform, username: newUsername }]);
      setNewPlatform('');
      setNewUsername('');
      setIsAdding(false);
    }
  };

  const removeSocial = (index) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };


  return (
    <>
        <div className='w-full min-h-[calc(100dvh-60px)]'>
            <div className='flex flex-col items-center'>
                <div className='flex items-center justify-center w-[80%] h-[60px] text-xl my-2 font-bold'>
                    <span className='text-center'>{getStepLabel(currentStep)?.title}</span>
                </div>
            </div>
            <div className='flex items-center mt-2 mb-12 mx-3'>
                <div className={`w-full rounded-xs mx-1 h-[10px] ${(currentStep > 1 ? "bg-primary" : "bg-secondary")}`}></div>
                <div className={`w-full rounded-xs mx-1 h-[10px] ${(currentStep > 2 ? "bg-primary" : "bg-secondary")}`}></div>
                <div className={`w-full rounded-xs mx-1 h-[10px] ${(currentStep > 3 ? "bg-primary" : "bg-secondary")}`}></div>
                <div className={`w-full rounded-xs mx-1 h-[10px] ${(currentStep > 4 ? "bg-primary" : "bg-secondary")}`}></div>
            </div>
            <form onSubmit={handleSubmit} className='min-h-full'>
                {/* Step 1: Basic Info */}

                <div className="mx-4 pb-15">
                    {currentStep === 1 && (
                    <div className="animate-fadeIn">

                        <div className="flex flex-col md:flex-row gap-6 mb-6">
                        <div className="flex-1">
                            <label htmlFor="first_name" className={`block mb-2 font-medium ${!formData.first_name ? "after:content-['_*'] after:text-red-500" : ""}`}>
                            First Name
                            </label>
                            <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg border ${errors.first_name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent`}
                            required
                            />
                            {errors.first_name && <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>}
                        </div>
                        
                        <div className="flex-1">
                            <label htmlFor="last_name" className={`block mb-2 font-medium ${!formData.last_name ? "after:content-['_*'] after:text-red-500" : ""}`}>
                            Last Name
                            </label>
                            <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg border ${errors.last_name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent`}
                            required
                            />
                            {errors.last_name && <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>}
                        </div>
                        </div>

                        <div className="mb-6">
                        <label htmlFor="job_title" className="block mb-2 font-medium">Job Title</label>
                        <input
                            type="text"
                            id="job_title"
                            name="job_title"
                            value={formData.job_title}
                            onChange={handleChange}
                            placeholder="e.g., Full Stack Developer"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent"
                        />
                        </div>

                        <div className="mb-6">
                        <label htmlFor="company" className="block mb-2 font-medium">Company</label>
                        <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent"
                        />
                        </div>

                        <div className="mb-6">
                        <label htmlFor="bio" className="block mb-2 font-medium">Biography</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Describe yourself in a few words..."
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent min-h-[120px]"
                        />
                        </div>
                    </div>
                    )}
                    
                    {/* Step 2: Contact Info */}
                    {/* Step 2: Contact Information */}
                    {currentStep === 2 && (
                    <div className="animate-fadeIn">
                        <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
                        <p className="text-gray-600 mb-6">How can people contact you?</p>

                        <div className="mb-6">
                        <label htmlFor="phone_number" className={`block mb-2 font-medium ${!formData.phone_number ? "after:content-['_*'] after:text-red-500" : ""}`}>
                            Phone Number
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            <PhoneCallIcon />
                            </div>
                            <input
                            type="tel"
                            id="phone_number"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.phone_number ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent`}
                            required
                            placeholder="+1 234 567 8900"
                            />
                        </div>
                        {errors.phone_number && <p className="mt-1 text-sm text-red-500">{errors.phone_number}</p>}
                        </div>

                        <div className="mb-6">
                        <label htmlFor="email" className="block mb-2 font-medium">Email</label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            <MailIcon />
                            </div>
                            <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent`}
                            placeholder="your@email.com"
                            />
                        </div>
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>

                        <div className="mb-6">
                            <label htmlFor="address" className="block mb-2 font-medium">Address</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <MapPin />
                                </div>
                                <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent"
                                placeholder="123 Main Street"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 mb-6">
                            <div className="flex-1">
                                <label htmlFor="city" className="block mb-2 font-medium">City</label>
                                <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent"
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="country" className="block mb-2 font-medium">Country</label>
                                <input
                                type="text"
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="website_url" className="block mb-2 font-medium">Website</label>
                            <input
                                type="url"
                                id="website_url"
                                name="website_url"
                                value={formData.website_url}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent"
                                placeholder="https://yourwebsite.com"
                            />
                        </div>
                    </div>
                    )}

                    {/* Step 3: Social Media */}
                    {currentStep === 3 && (
                    <div className="animate-fadeIn">
                        <div className="max-w-md mx-auto p-6">
                            <h2 className="text-2xl font-bold mb-6 text-center">Modifier la carte de visite digitale</h2>
                            
                            <div className="mb-8">
                                <h3 className="text-lg font-medium mb-4">Liens vers vos réseaux sociaux</h3>
                                
                                <div className="space-y-3 mb-6">
                                {socialLinks.map((social, index) => (
                                    <div 
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md"
                                    >
                                    <div className="flex items-center">
                                        {social.platform === 'Facebook' ? (
                                        <Facebook className="text-blue-600 mr-3" size={20} />
                                        ) : (
                                        <LinkedinIcon className="text-blue-500 mr-3" size={20} />
                                        )}
                                        <div>
                                        <p className="font-medium">{social.platform}</p>
                                        <p className="text-gray-500 text-sm">@{social.username}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => removeSocial(index)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                    </div>
                                ))}
                                </div>

                                {isAdding ? (
                                <div className="mb-4 p-3 bg-gray-50 rounded-lg animate-fadeIn">
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                    <input
                                        type="text"
                                        value={newPlatform}
                                        onChange={(e) => setNewPlatform(e.target.value)}
                                        placeholder="Réseau social"
                                        className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <input
                                        type="text"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        placeholder="Nom d'utilisateur"
                                        className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                    <button 
                                        onClick={() => setIsAdding(false)}
                                        className="px-3 py-1 text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button 
                                        onClick={handleAddSocial}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    >
                                        Ajouter
                                    </button>
                                    </div>
                                </div>
                                ) : (
                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="flex items-center text-blue-500 hover:text-blue-600 mb-6 transition-colors"
                                >
                                    <Plus className="mr-2" size={18} />
                                    Ajouter un réseau social
                                </button>
                                )}
                            </div>
                        </div>
                    </div>
                    )}

                    {/* Step 4: Customization */}
                    {currentStep === 4 && (
                    <div className="animate-fadeIn">
                        <div className="mb-6">
                            <label className="block mb-3 font-medium">Background Color</label>
                            <div className="flex gap-4">
                                {colorOptions.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    className={`w-10 h-10 rounded-lg ${color.value} ${formData.background_color === color.value ? 'ring-2 ring-offset-2 ring-[#4361ee]' : ''} transition-all`}
                                    onClick={() => setFormData(prev => ({ ...prev, background_color: color.value }))}
                                    aria-label={color.label}
                                />
                                ))}
                            </div>
                        </div>

                        {/* More customization options... */}
                    </div>
                    )}

                </div>


            </form>
            <div className='flex items-center bg-white py-2 rounded-t-lg inset-shadow-sm w-full sticky z-50 bottom-0 justify-between'>
                <button onClick={prevStep} disabled={currentStep == 1} className="w-full m-1 rounded-lg text-white bg-black disabled:bg-secondary py-2 px-1">Précédent</button>
                <button onClick={nextStep} disabled={currentStep == 4} className="w-full m-1 rounded-lg text-white bg-primary py-2 px-1">Suivant</button>
            </div>
        </div>
    </>
  )
}

export default EditCard