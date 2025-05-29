import { ArrowRight, Globe, Linkedin, Loader, Mail, MapPin, Phone } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useUser } from '../contexts/user_context';
import { Link, useNavigate } from 'react-router-dom';
import { useAppBar } from '../contexts/appbar_context';
import HomeCardPage from './home_pages/home_card_page';
import HomeQRPage from './home_pages/home_qr_page';
import HomeNoSubscription from './home_pages/home_no_subscription';

export default function Home() {

  const { setTitle, setShowBackButton, setActions, setVisible } = useAppBar();
  
  useEffect(() => { 
    setShowBackButton(false);
    setVisible(false);
  }, [setTitle, setShowBackButton, setActions, setVisible]);

  const navigate = useNavigate();
  // const location = useLocation();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [Error, setError] = useState('');

  const { user, login, validatePhoneNumber, loading } = useUser();

  useEffect(() => {
    console.log("user", loading)
  }, [loading]);

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Numéro de téléphone invalide. Utilisez le format: 6XXXXXXXX');
      return;
    }

    try {
      login({
        phoneNumber,
        name: 'User',
        region: 'Douala',
        registeredOn: new Date().toISOString()
      });
      navigate('/edit');
    } catch (error) {
      setError(error.message);
    }
  };

  const [activeSection, setActiveSection] = useState('Card');

  return (
    (((loading.checked == null && loading.authenticated == null) ||  
      (loading.authenticated == true && loading.checked == null) ||
    (loading.authenticated == false && loading.checked == null)) && loading.hasSubscription == null) ? 
      <div className="w-full min-h-[calc(100dvh-60px)] flex flex-col items-center justify-center">
        <Loader className="animate-spin duration-2000 text-primary" size={120}></Loader>
      </div>
    : (loading.authenticated == true && loading.checked == true && loading.hasSubscription == true) ?
      <>
        <div className="w-full relative translate-y-[-25px] min-h-[calc(100dvh-60px)] flex flex-col">
          <div className='bg-black -mb-12 relative tracking-wide text-white pl-[32px] pr-[32px] pb-[60px] pt-[60px] h-[200px] rounded-b-2xl'>
            <h2 className='text-2xl font-bold'>Bienvenue</h2>
            <p className='leading-5 text-sm'>Interface de gestion de votre carte de visite digitale</p>
          </div>

          
          <div className='flex items-center justify-center px-4 pt-4 pb-2'>
            <div className='flex w-64 items-center justify-between px-4 pt-4 pb-2'>
                <div className="relative bg-white rounded-lg p-1 shadow-lg border border-gray-200">
                  {/* Indicateur glissant */}
                  <div
                    className={`absolute top-1 bottom-1 bg-primary rounded-md transition-all duration-300 ease-in-out ${
                      activeSection === 'Card' 
                        ? 'left-1 right-1/2 mr-0.5' 
                        : 'left-1/2 right-1 ml-0.5'
                    }`}
                  />
                  
                  {/* Boutons */}
                  <div className="relative flex">
                    <button
                      onClick={() => setActiveSection('Card')}
                      className={`px-8 py-3 rounded-md font-medium transition-colors duration-300 relative z-10 ${
                        activeSection === 'Card'
                          ? 'text-white'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Card
                    </button>
                    
                    <button
                      onClick={() => setActiveSection('QR')}
                      className={`px-8 py-3 rounded-md font-medium transition-colors duration-300 relative z-10 ${
                        activeSection === 'QR'
                          ? 'text-white'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      QR
                    </button>
                  </div>
                </div>
              </div>
          </div>

          {
            activeSection == 'Card' ? <HomeCardPage /> : <HomeQRPage />
          }

        </div>
        
      </>
    : (loading.authenticated == true && loading.checked == true && loading.hasSubscription == false) ?
      <HomeNoSubscription />
    : ((loading.authenticated == false && loading.checked == false) ||
      (loading.authenticated == false && loading.checked == true) ||
      (loading.authenticated == true && loading.checked == false)) ?
    <>
      <div className="w-full min-h-[calc(100dvh-60px)] flex flex-col items-center justify-center">
        <h1 className='text-3xl text-black text-center font-bold mb-12'>Bienvenue sur <br/>
          <span className='font-bold text-primary'>MaxIt Business Cards</span>
        </h1>

        {
          user == null ?
          (<form onSubmit={handlePhoneSubmit}>
            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">+237</span>
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="pl-16 block w-full rounded-md border border-gray-300 py-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                  placeholder="6XXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
                {Error?.length > 0 ? <span className='text-red-500'>{Error}</span> : <></>}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Format: 6XXXXXXXX ou +237 6XXXXXXXX
              </p>
            </div>
            <button disabled={!validatePhoneNumber(phoneNumber)} type="submit" className='bg-primary disabled:bg-gray-500 rounded-xl h-[56px] flex items-center justify-between text-white text-center'>
              <span>&nbsp;</span>
              <span className='text-bold mx-4 px-12 tracking-wider'>Commencer</span> 
              <ArrowRight size={30} className='mr-4'/>
            </button>
          </form>)
          :
          (
            <Link to='/edit' type="button" className='bg-primary rounded-xl h-[56px] flex items-center justify-between text-white text-center'>
              <span>&nbsp;</span>
              <span className='text-bold mx-4 px-12 tracking-wider'>Commencer</span> 
              <ArrowRight size={30} className='mr-4'/>
            </Link>
          )
        }
      </div>
    </> : <></>
  )
}
