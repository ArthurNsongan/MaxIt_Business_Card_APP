import React, { useEffect, useState } from 'react'
import { useAppBar } from '../contexts/appbar_context';
import { useRef } from 'react';
import { ArrowLeft, ArrowRight, Eye, Home, Image, ImageIcon, InfoIcon, Landmark, Loader, Loader2, Mail, MailIcon, MapPin, PhoneCallIcon, Plus, Save, User, X } from 'lucide-react';
import { 
    Facebook, 
    Twitter, 
    Instagram, 
    Linkedin as LinkedinIcon, 
    Youtube,
    Globe 
  } from 'lucide-react'; // or your preferred icon library
import EditPreviewCard from './EditPreviewCard';
import { useUser } from '../contexts/user_context';
import useApi from '../hooks/useApi';
import userService from '../services/user_service';
import LoadingPage from '../components/loading_page';
import { Frame } from '../components/icons';
import { apiAddress } from '../services/client';
import { Link } from 'react-router-dom'
import ColorPicker from '../components/color_picker';
import FontSelector from '../components/font-selector';

export const formatSocialMedia = (p) => {
    switch(p) {
        case "facebook": return "Facebook";
        case "twitter": return "X";
        case "instagram": return "Instagram";
        case "linkedin": return "LinkedIn";
    }
}

function goToTop() {
    // Do whatever "Next" functionality you have here
    window.scrollTo({ top: 0 }); // Scrolls to the top smoothly
}

const MAX_FILE_SIZE = 2 * 1024 * 1024;


function EditCard() {

  const { setTitle, setShowBackButton, setActions, setVisible } = useAppBar();

  const [loadingSaveData, setLoadingSaveData] = useState(false);

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
    other_socials: "",
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

  const textColorOptions = [
    { value: '#1e1e24', label: 'Dark' },
    { value: '#ffffff', label: 'White' },
    { value: '#cccccc', label: 'Light' }
  ];
  
  const fontOptions = [
    { value: "'Inter', sans-serif", label: "Inter (modern)" },
    { value: "'Helvetica Neue', sans-serif", label: "Helvetica (classic)" },
    { value: "Georgia, serif", label: "Georgia (elegant)" },
    { value: "'Courier New', monospace", label: "Courier (technical)" }
  ];
  

  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const companyLogoRef = useRef(null);
  const coverImageRef = useRef(null);

  const { user_card, user, setUserCard } = useUser();
  const phoneNumber = user?.phoneNumber.replace("237", "") || null;

  const gatherUserCardData = async (user_card_datas) => {
    await setUserCard(user_card_datas);
 }
 
 const [currentStep, setCurrentStep] = useState(1);

useEffect(() => {
    console.log("currentStep :", currentStep)

}, [currentStep])


  useEffect(() => {
    setTitle('EditCard');
    setShowBackButton(true);
    setVisible(true);
    console.log("phoneNumber", phoneNumber)
    setFormData(prev => ({ ...prev, phone_number: phoneNumber }));
    return () => {
      setActions(null);
    };
  }, [setTitle, setShowBackButton, setActions, setVisible]);

  let userCreateUpdateService = null

  if(user_card) {
    userCreateUpdateService = (userService.update_user_card_route);
  }
  else {
    userCreateUpdateService = (userService.create_user_card_route);
  }

  const { execute: saveData, loadingSave, errorSave} = useApi(userCreateUpdateService);
  const { execute: uploadCover, loadingCover, errorCover} = useApi(userService.upload_cover_image);
  const { execute: uploadLogo, loadingLogo, errorLogo} = useApi(userService.upload_company_logo);
  const { execute: uploadProfile, loadingProfile, errorProfile} = useApi(userService.upload_profile_photo);


  useEffect(() => {
    if (user_card) {
        console.log("currentuser", user , user_card);

      setFormData(prev => ({
        ...prev,
        ...user_card,
        profile_photo_url: user_card.profile_photo_url == null ? "" : apiAddress + user_card.profile_photo_url,
        company_logo_url: user_card.company_logo_url == null ? "" :apiAddress + user_card.company_logo_url,
        cover_image_url: user_card.cover_image_url == null ? "" :apiAddress + user_card.cover_image_url,
      }));
    } else if(user?.phoneNumber){
        console.log("currentuser", user , user_card);
        // const response = saveData({
        //     ...formData,
        //     phone_number: phoneNumber,
        // });
        // console.log("response", response)
    }
  }, [user_card, user]);

  const FormSteps = [
    {
        name: "Mes informations",
        title: "Donnez nous vos informations personnelles",
        id: 1
    },
    {
        name: "Coordonnées",
        title: "Donnez-vous des moyens de vous contacter",
        id: 2
    },
    {
        name: "Réseaux sociaux",
        title: "Connectons nous et échangeons sur les réseaux sociaux",
        id: 3
    },
    {
        name: "Images",
        title: "Enrichissez votre carte digitale par des images",
        id: 4
    },
    {
        name: "Personnalisation",
        title: "Donnez vie à une carte digitale qui vous ressemble",
        id: 5
    }
  ]


  const getStepLabel = (step) => {
    return FormSteps.find(t => t.id == step);
  }

  const nextStep = () => {
    // Validate the current step before proceeding
    if(validateStep(currentStep)) {
        if(currentStep) {
            setCurrentStep(currentStep + 1)
        }
        goToTop();
    }

    console.log(currentStep, "is step");
    
  }

  const prevStep = () => {
    if(currentStep > 1) {
        setCurrentStep(currentStep - 1)
    }
    goToTop();
  }

  // Form validation
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
      if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    }
    
    if (step === 2) {
    //   if (!formData.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
      if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    }

    if(step === 3) {
        // if (formData.linkedin_url && !/^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+$/.test(formData.linkedin_url)) {
        //     newErrors.linkedin_url = 'Please enter a valid LinkedIn URL';
        // }
        // if (formData.twitter_url && !/^(https?:\/\/)?(www\.)?twitter\.com\/[a-zA-Z0-9_]+$/.test(formData.twitter_url)) {
        //     newErrors.twitter_url = 'Please enter a valid Twitter URL';
        // }
        // if (formData.instagram_url && !/^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.]+$/.test(formData.instagram_url)) {
        //     newErrors.instagram_url = 'Please enter a valid Instagram URL';
        // }
        // if (formData.facebook_url && !/^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9_.]+$/.test(formData.facebook_url)) {
        //     newErrors.facebook_url = 'Please enter a valid Facebook URL';
        // }
    }

    if(step === 4) {
        let fields = Object.keys(files);
        fields.forEach((field) => {
            if (files[field] && files[field].size > MAX_FILE_SIZE) {
                newErrors[field] = "L'image doit faire moins de 2 Mo";
            }
        });
    }

    setErrors(newErrors);
    console.log("newErrors", newErrors);
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

    console.log("formData", formData)
  };

//   const fileUploads = ["profile_photo_url", "company_logo_url", "cover_image_url"];

  const [files, setFiles] = useState({
    profile_photo_url: null,
    company_logo_url: null,
    cover_image_url: null
  });


  // Handle file uploads
  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        e.preventDefault();
        e.stopPropagation();

        setFiles(prev => ({ ...prev, [field]: file }));
        setFormData(prev => ({ ...prev, [field]: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const [saveRequestStep, setsaveRequestStep] = useState(0);

  // Handle form submission
  const handleSubmit = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    console.log('Form data to submit:', formData);
    
    nextStep();

    await setLoadingSaveData(true);

    if (!user_card) {
      console.log('Form data to submit 2:', formData);
      setsaveRequestStep("SAVE_DATA");
      const response = await saveData({
            ...formData,
            phone_number: phoneNumber,
        });
        console.log("response", response.data)
        setLoadingSaveData(false);
        // if(errorSave != false)
            gatherUserCardData(response.data);
        
        await saveImages();
    }
    else if(user_card) {

        await saveImages();

        console.log('Form data to submit 3:', formData);
        setsaveRequestStep("SAVE_DATA");
        const response = await saveData(phoneNumber,{
            ...formData,
            phone_number: phoneNumber,
        });
        console.log("response", response.data);
        setLoadingSaveData(false);
        // if(errorSave != false)
            gatherUserCardData(response.data);
    }
      

    setCurrentStep(7)
  };

  const saveImages = async () => {

    console.log(files)

    var file = null;
    file = files?.profile_photo_url;
    // if (!file) return alert("No file selected");

    if(file) {
        setsaveRequestStep("PROFILE_PHOTO");
        let formData = new FormData();
        formData.append("file", file);
        let response = await uploadProfile(phoneNumber, formData);
        console.log("profile_photo_url", response.data);
        gatherUserCardData(response.data)
    }

    file = files?.cover_image_url;
    // if (!file) return alert("No file selected");

    if(file) {
        setsaveRequestStep("COMPANY_LOGO");
        let formData = new FormData();
        formData.append("file", file);
        let response = await uploadCover(phoneNumber, formData);
        console.log("company_logo_url", response.data);
        gatherUserCardData(response.data)
    }


    file = files?.company_logo_url;
    // if (!file) return alert("No file selected");

    if(file) {
        setsaveRequestStep("COVER_IMAGE");
        let formData = new FormData();
        formData.append("file", file);
        let response = await uploadLogo(phoneNumber, formData);
        console.log("cover_image_url", response.data);
        gatherUserCardData(response.data)
    }


  }

  const [socialLinks, setSocialLinks] = useState([

  ]);

  useEffect(() => {
    
  }, [user_card])
  
  
  const [isAdding, setIsAdding] = useState(false);
  const [newPlatform, setNewPlatform] = useState('');
  const [newUsername, setNewUsername] = useState('');

  const handleAddSocial = () => {
    if (newPlatform && newUsername) {
      var socialLinksTemp = [...socialLinks, { platform: newPlatform, username: newUsername }]
      setSocialLinks(socialLinksTemp);
      setNewPlatform('');
      setNewUsername('');
      setIsAdding(false);
      setFormData({...formData, ...updateSocialMediaLinks(socialLinksTemp)})
      console.log(formData);
    }
  };

  const updateSocialMediaLinks = (temp) => {
    let formDataTemp = {
        linkedin_url: "",
        twitter_url: "",
        facebook_url: "",
        instagram_url: ""
    }
    console.log("socialLinks", temp)
    temp.forEach((platformTemp) => {
        if(platformTemp.platform == "linkedin") {
            formDataTemp.linkedin_url = platformTemp.username
        }
        else if(platformTemp.platform == "facebook") {
            formDataTemp.facebook_url = platformTemp.username
        }
        else if(platformTemp.platform == "twitter") {
            formDataTemp.twitter_url = platformTemp.username
        }
        else if(platformTemp.platform == "instagram") {
            formDataTemp.instagram_url = platformTemp.username
        }
    });
    return formDataTemp;
  }

  const removeSocial = (index) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  useEffect(() => {
    var socialLinksTemp = [];
    var linksTemp = {}
    if(user_card?.linkedin_url?.length > 0) {
        socialLinksTemp.push({ platform: "linkedin", username: user_card.linkedin_url })
    } else if(user_card?.linkedin_url == null) {
        linksTemp.linkedin_url = "";
    }
    if(user_card?.facebook_url?.length > 0) {
        socialLinksTemp.push({ platform: "facebook", username: user_card.facebook_url })
    } else if(user_card?.facebook_url == null) {
        linksTemp.facebook_url = "";
    }
    if(user_card?.twitter_url?.length > 0) {
        socialLinksTemp.push({ platform: "twitter", username: user_card.twitter_url })
    } else if(user_card?.twitter_url == null) {
        linksTemp.twitter_url = "";
    }
    if(user_card?.instagram_url?.length > 0) {
        socialLinksTemp.push({ platform: "instagram", username: user_card.instagram_url })
    } else if(user_card?.instagram_url == null) {
        linksTemp.instagram_url = "";
    }
    console.log("socialLinksTemp", socialLinksTemp)
    setSocialLinks([...socialLinksTemp])
  }, [user_card]);


  return (
    <>
        {/* {
            (
                <LoadingPage loading={loadingSaveData} />
            )
        } */}
        {
            currentStep == 7 ?
            (
                <>
                    {/* <EditPreviewCard card_type={cardType} preview_data={formData}/> */}
                    <div className='w-full min-h-[calc(100dvh-60px)] flex flex-col items-center justify-center'>
                        <div className='flex items-center flex-col w-full'>
                            <Frame />
                            <p className='mt-4 mb-4 text-xl font-bold text-center'>Votre carte de digitale enregistrée avec succès !</p>

                            <div className='w-full flex items-center flex-col p-3'>
                                <Link to="/subscription-plans" className='bg-black flex items-center justify-between text-white text-sm rounded text-primary pt-1 pb-1 font-bold tracking-wide text-center m-2 w-full'>
                                    <span className='block m-2'></span>
                                    <span className='pl-2 pr-2'>Prévisualiser</span>
                                    <span className='block m-2'><ArrowRight /></span>
                                </Link>
                                <Link to="/" className='bg-primary/15 border-2 border-primary flex items-center justify-between text-sm rounded text-primary font-bold text-center pt-1 pb-1 m-2 w-full'>
                                    <span className='block m-2'><ArrowLeft /></span>
                                    <span className='flex items-center pl-2 pr-2'><Home className='mr-2' size={18}/> Retour à l'accueil</span>
                                    <span className='block m-2'></span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </> 
            ) 
            : currentStep == 6 ? 
            (
                <div className="w-full min-h-[calc(100dvh-60px)] flex flex-col items-center justify-between">
                    <span></span>
                    <div className='flex items-center flex-col'>
                        <Loader className="animate-spin duration-2000 text-primary" size={80}></Loader>
                        {
                            saveRequestStep == "COMPANY_LOGO" ?
                            <p className='text-center text-sm font-bold mt-2'>Enregistrement de votre logo d'entreprise</p> :
                            saveRequestStep == "COVER_IMAGE" ?
                            <p className='text-center text-sm font-bold mt-2'>Enregistrement de votre image de couverture</p> :
                            saveRequestStep == "PROFILE_PHOTO" ?
                            <p className='text-center text-sm font-bold mt-2'>Enregistrement de votre photo de profil</p> :
                            saveRequestStep == "SAVE_DATA" ?
                            <p className='text-center text-sm font-bold mt-2'>Enregistrement de vos données personnelles</p> :
                            <></>
                        }
                    </div>
                    <span></span>
                </div>
            )
            :
            (
                <div className='w-full min-h-[calc(100dvh-60px)] mt-[30px]'>
            <div className='flex flex-col items-center'>
                <div className='flex items-center flex-col justify-center w-[80%] h-[60px] text-xl my-2 font-bold'>
                    {/* <span className='text-center'>{getStepLabel(currentStep)?.title}</span> */}
                    <h2 className="text-2xl font-bold mb-2">{getStepLabel(currentStep)?.name}</h2>
                    <span className="text-gray-600 text-[18px] leading-5 mb-6 text-center scheme-light-dark">{getStepLabel(currentStep)?.title}</span>

                </div>
            </div>
            <div className='flex items-center mt-2 mb-12 mx-3'>
                <div className={`w-full rounded-xs mx-1 h-[10px] ${(currentStep > 1 ? "bg-primary" : "bg-secondary")}`}></div>
                <div className={`w-full rounded-xs mx-1 h-[10px] ${(currentStep > 2 ? "bg-primary" : "bg-secondary")}`}></div>
                <div className={`w-full rounded-xs mx-1 h-[10px] ${(currentStep > 3 ? "bg-primary" : "bg-secondary")}`}></div>
                <div className={`w-full rounded-xs mx-1 h-[10px] ${(currentStep > 4 ? "bg-primary" : "bg-secondary")}`}></div>
                <div className={`w-full rounded-xs mx-1 h-[10px] ${(currentStep > 5 ? "bg-primary" : "bg-secondary")}`}></div>
            </div>
            <form className='min-h-full'>
                {/* Step 1: Basic Info */}

                <div className="mx-4 pb-15">
                    {currentStep === 1 && (
                    <div className="animate-fadeIn">

                        <div className="flex flex-col md:flex-row gap-6 mb-6">
                        <div className="flex-1">
                            <label htmlFor="first_name" className={`block mb-2 font-medium ${!formData.first_name ? "after:content-['_*'] after:text-red-500" : ""}`}>
                            Prénom
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
                            Nom
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
                        <label htmlFor="job_title" className="block mb-2 font-medium">Votre Poste Actuel</label>
                        <input
                            type="text"
                            id="job_title"
                            name="job_title"
                            value={formData.job_title}
                            onChange={handleChange}
                            placeholder="e.g., Full Stack Developer"
                            className={`w-full px-4 py-3 rounded-lg border ${errors.job_title ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent`}
                        />
                        {errors.job_title && <p className="mt-1 text-sm text-red-500">{errors.job_title}</p>}
                        </div>

                        <div className="mb-6">
                        <label htmlFor="company" className="block mb-2 font-medium">Entreprise</label>
                        <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg border ${errors.company ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent`}
                        />
                        {errors.company && <p className="mt-1 text-sm text-red-500">{errors.company}</p>}
                        </div>

                        <div className="mb-6">
                        <label htmlFor="bio" className="block mb-2 font-medium">Parlez-nous de vous</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Decrivez vous en quelques mots..."
                            className={`w-full px-4 py-3 rounded-lg border ${errors.bio ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent min-h-[120px]`}
                        />
                        {errors.bio && <p className="mt-1 text-sm text-red-500">{errors.bio}</p>}
                        </div>
                    </div>
                    )}
                    
                    {/* Step 2: Contact Info */}
                    {/* Step 2: Contact Information */}
                    {currentStep === 2 && (
                    <div className="animate-fadeIn">
                        <div className="mb-6">
                        <label htmlFor="phone_number" className={`block mb-2 font-medium ${!formData.phone_number ? "after:content-['_*'] after:text-red-500" : ""}`}>
                            Numéro de téléphone
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <PhoneCallIcon />
                            </div>
                            <input
                            type="tel"
                            id="phone_number"
                            name="phone_number"
                            value={phoneNumber}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.phone_number ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent`}
                            required
                            disabled="trues"
                            placeholder="6 99 98 97 96"
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
                            <label htmlFor="address" className="block mb-2 font-medium">Adresse</label>
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
                                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.address ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent`}
                                placeholder="123 Main Street"
                                />
                                {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 mb-6">
                            <div className="flex-1">
                                <label htmlFor="city" className="block mb-2 font-medium">Ville</label>
                                <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.city ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent`}
                                />
                                {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                            </div>
                            <div className="flex-1">
                                <label htmlFor="country" className="block mb-2 font-medium">Pays</label>
                                <input
                                type="text"
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.country ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent`}
                                />
                                {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="website_url" className="block mb-2 font-medium">Site Web</label>
                            <input
                                type="url"
                                id="website_url"
                                name="website_url"
                                value={formData.website_url}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.website_url ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent`}
                                placeholder="www.votre_siteweb.com"
                            />
                            {errors.website_url && <p className="mt-1 text-sm text-red-500">{errors.website_url}</p>}
                        </div>
                    </div>
                    )}

                    {/* Step 3: Social Media */}
                    {currentStep === 3 && (
                    <div className="animate-fadeIn">
                        <div className="max-w-md mx-auto min-h-[70dvh] p-6">                            
                            <div className="mb-8">                                
                                <div className="space-y-3 mb-6">
                                {socialLinks.map((social, index) => (
                                    <div 
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md"
                                    >
                                    <div className="flex items-center">
                                        {social.platform === 'facebook' ? (
                                        <Facebook className="text-blue-600 mr-3" size={20} />
                                        ) : social.platform === 'instagram' ? (
                                        <Instagram className="text-pink-600 mr-3" size={20} />
                                        ) : social.platform === 'linkedin' ? (
                                        <LinkedinIcon className="text-blue-500 mr-3" size={20} />
                                        ) : social.platform === 'youtube' ? (
                                        <Youtube className="text-red-600 mr-3" size={20} />
                                        ) : (
                                         <Globe className="text-gray-500 mr-3" size={20} /> // Default icon
                                        )}
                                        <div>
                                        <p className="font-medium">{formatSocialMedia(social.platform)}</p>
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
                                    <div className="flex flex-col gap-3 mb-3">
                                    <select
                                        value={newPlatform}
                                        onChange={(e) => setNewPlatform(e.target.value)}
                                        className="block w-full p-2 pr-8 border border-gray-300 rounded appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    >
                                        <option>Sélectionner le réseau</option>
                                        {(formData.facebook_url?.length == 0 || formData.facebook_url == null) ? <option value="facebook">Facebook</option> : <></>}
                                        {(formData.twitter_url?.length == 0 || formData.twitter_url == null) ? <option value="twitter">Twitter</option> : <></>}
                                        {(formData.instagram_url?.length == 0 || formData.instagram_url == null) ? <option value="instagram">Instagram</option> : <></>}
                                        {(formData.linkedin_url?.length == 0 || formData.linkedin_url == null) ? <option value="linkedin">LinkedIn</option> : <></>}
                                        {/* {formData.linked_url?.length > 0 ? <option value="youtube">YouTube</option> : <></>} */}
                                    </select>
                                    <input
                                        type="text"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        placeholder="Lien vers votre page"
                                        className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    </div>
                                    <div className="flex justify-center space-x-2">
                                    <button type='button'
                                        onClick={() => setIsAdding(false)}
                                        className="w-full border border-gray rounded px-3 py-1 text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button type='button'
                                        onClick={() => handleAddSocial()}
                                        className="w-full border bg-primary px-3 py-1 text-white rounded transition-colors"
                                    >
                                        Ajouter
                                    </button>
                                    </div>
                                </div>
                                ) : (
                                <button type='button'
                                    onClick={() => setIsAdding(true)}
                                    className="flex w-full items-center justify-center py-2 rounded bg-primary hover:bg-primary text-white text-center mb-6 transition-colors"
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
                        <label className="block mb-3 font-medium">Photo de Profil</label>
                        <div className="flex items-center gap-4">
                            {formData.profile_photo_url ? (
                            <img 
                                src={formData.profile_photo_url} 
                                alt="Profile" 
                                className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                            />
                            ) : (
                            <div className="w-20 h-20 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center">
                                <User className="text-gray-400 w-8 h-8" />
                            </div>
                            )}
                            <input
                            type="file"
                            id="profile_photo_url"
                            name="profile_photo_url"
                            onChange={(e) => handleFileUpload(e, 'profile_photo_url')}
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            />
                            <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className={`px-4 py-2 rounded-lg border ${errors.profile_photo_url ? 'border-red-500' : 'border-gray-300'} hover:bg-gray-50 transition-colors`}
                            >
                            {formData.profile_photo_url ? 'Modifier votre photo de profil' : 'Charger votre photo de profil'}
                            </button>
                            {errors.profile_photo_url && <p className="mt-1 text-sm text-red-500">{errors.profile_photo_url}</p>}
                        </div>
                        </div>

                        {/* Company Logo Upload */}
                        <div className="mb-6">
                        <label className="block mb-3 font-medium">Logo de votre entreprise</label>
                        <div className="flex items-center gap-4">
                            {formData.company_logo_url ? (
                            <img 
                                src={formData.company_logo_url} 
                                alt="Company Logo" 
                                className="w-20 h-20 object-contain border-2 border-gray-300 bg-white p-2 rounded-lg"
                            />
                            ) : (
                            <div className="w-20 h-20 bg-gray-200 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                                <Landmark className="text-gray-400 w-8 h-8" />
                            </div>
                            )}
                            <input
                            type="file"
                            id="company_logo_url"
                            name="company_logo_url"
                            onChange={(e) => handleFileUpload(e, 'company_logo_url')}
                            accept="image/*"
                            className="hidden"
                            ref={companyLogoRef}
                            />
                            <button
                            type="button"
                            onClick={() => companyLogoRef.current?.click()}
                            className={`px-4 py-2 rounded-lg border ${errors.company_logo_url ? 'border-red-500' : 'border-gray-300'} hover:bg-gray-50 transition-colors`}
                            >
                            {formData.company_logo_url ? 'Modifier le logo' : 'Charger le logo'}
                            </button>
                            {errors.company_logo_url && <p className="mt-1 text-sm text-red-500">{errors.company_logo_url}</p>}
                        </div>
                        </div>

                            {/* Cover Image Upload */}
                            <div className="mb-6">
                            <label className="block mb-3 font-medium">Image de couverture</label>
                            <span className='bg-primary/15 text-center text-bold text-xs mb-2 text-primary p-2 flex items-center justify-center rounded'><InfoIcon size={20} className='mr-2'/> Non disponible pour les cartes &laquo; Basique &raquo; </span>
                            <div className="flex flex-col gap-4">
                                {formData.cover_image_url ? (
                                <img 
                                    src={formData.cover_image_url} 
                                    alt="Image de couverture" 
                                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
                                />
                                ) : (
                                <div className="w-full h-32 bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                    <ImageIcon className="text-gray-400 w-8 h-8" />
                                </div>
                                )}
                                <input
                                type="file"
                                id="cover_image_url"
                                name="cover_image_url"
                                onChange={(e) => handleFileUpload(e, 'cover_image_url')}
                                accept="image/*"
                                className="hidden"
                                ref={coverImageRef}
                                />
                                <button
                                type="button"
                                onClick={() => coverImageRef.current?.click()}
                                className={`px-4 py-2 rounded-lg border ${errors.cover_image_url ? 'border-red-500' : 'border-gray-300'} hover:bg-gray-50 transition-colors self-start`}
                                >
                                {formData.cover_image_url ? 'Modifier l\'image' : 'Charger l\'image'}
                                </button>
                                {errors.cover_image_url && <p className="mt-1 text-sm text-red-500">{errors.cover_image_url}</p>}
                            </div>
                            </div>
                        
                    </div>
                    )}

                    {/* Step 5: Customization */}
                    {currentStep === 5 && (
                    <div className="animate-fadeIn">

                        <div className="mb-6">
                        <label className="block mb-3 font-medium">Couleur d'arrière-plan</label>
                        <div className="flex flex-wrap gap-3">
                            {/* {colorOptions.map((color, colorIndex) => (
                            <button
                                key={"cb_" + colorIndex}
                                type="button"
                                style={{backgroundColor: color}}
                                className={`w-10 h-10 rounded-lg ${
                                formData.background_color === color 
                                    ? 'ring-2 ring-offset-2 ring-[var(--primary)]' 
                                    : ''
                                } transition-all hover:scale-105`}
                                onClick={() => setFormData(prev => ({ ...prev, background_color: color }))}
                                title={color}
                                aria-label={color}
                            />
                            ))} */}
                            <ColorPicker 
                                color={formData.background_color == "" || formData.background_color == null ? "#ff7900" : formData.background_color}
                                onChange={(color) => {
                                    console.log("Color changed:", color)
                                    setFormData({ ...formData, background_color: color })
                                }}
                                value={formData.background_color}
                                label="Couleur d'arrière-plan"
                            />
                        </div>
                        </div>

                        <div className="mb-6">
                        <label className="block mb-3 font-medium">Couleur du texte</label>
                        <div className="flex flex-wrap gap-3 w-full">
                            {textColorOptions.map((color) => (
                            <button
                                key={color.value}
                                type="button"
                                style={{backgroundColor: color.value}}
                                className={`w-10 h-10 rounded-lg ${
                                formData.text_color === color.value
                                    ? 'ring-2 ring-offset-2 ring-[var(--primary)]' 
                                    : ''
                                } border border-gray-300 transition-all hover:scale-105`}
                                onClick={() => setFormData(prev => ({ ...prev, text_color: color.value }))}
                                title={color.value}
                                aria-label={color.value}
                            />
                            ))}
                            {/* <ColorPicker 
                                color={formData.text_color == "" || formData.text_color == null ? "#ff7900" : formData.text_color}
                                onChange={(color) => {
                                    console.log("Color changed:", color)
                                    setFormData({ ...formData, text_color: color })
                                }}
                                value={formData.text_color}
                                label="Couleur du texte"
                            /> */}
                        </div>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="font_family" className="block mb-2 font-medium">Sélectionnez la police de votre choix</label>
                            {/* <select
                                id="font_family"
                                name="font_family"
                                value={formData.font_family}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent"
                            >
                                {fontOptions.map((font) => (
                                <option key={font.value} value={font.value}>{font.label}</option>
                                ))}
                            </select> */}
                            <FontSelector 
                                id="font_family"
                                name="font_family"
                                initialValue={formData.font_family}
                                onChange={(value) => setFormData(prev => ({ ...prev, font_family: value }))} />

                        </div>

                        
                    </div>
                    )}

                </div>


            </form>
            {
                currentStep != 6 ? 
                <div className='flex items-center bg-white py-2 rounded-t-lg inset-shadow-sm w-full sticky z-50 bottom-0 justify-between'>
                    <button onClick={prevStep} disabled={currentStep == 1} className="w-full m-1 rounded-lg text-white bg-black disabled:bg-secondary py-2 px-1">Précédent</button>
                    {
                        (
                            <button onClick={currentStep == 5 ? handleSubmit : nextStep}
                                className="w-full m-1 flex items-center justify-center 
                                rounded-lg text-white bg-primary py-2 px-1">
                                { currentStep == 6 ? <Loader2 size={20} className="animate-spin"/> : <Save size={20} className=""/> } Suivant</button>
                        )
                    }
                </div>
                : <></>
            }
        </div>
            )
        }
    </>
  )
}

export default EditCard