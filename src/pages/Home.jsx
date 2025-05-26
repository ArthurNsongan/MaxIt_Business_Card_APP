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

  return (
    (((loading.checked == null && loading.authenticated == null) ||  
      (loading.authenticated == true && loading.checked == null) ||
    (loading.authenticated == false && loading.checked == null)) && loading.hasSubscription == null) ? 
      <div className="w-full min-h-[calc(100dvh-60px)] flex flex-col items-center justify-center">
        <Loader className="animate-spin duration-2000 text-primary" size={120}></Loader>
      </div>
    : (loading.authenticated == true && loading.checked == true && loading.hasSubscription == true) ?
      <HomeCardPage />
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
