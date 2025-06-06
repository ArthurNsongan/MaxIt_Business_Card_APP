import React from 'react'
import { useAppBar } from '../contexts/appbar_context';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AppBar() {

  const { showBackButton, visible } = useAppBar();
  const navigate = useNavigate();

  return (
    <div className={`w-full bg-black sticky top-0 z-[30] rounded-b-2xl backdrop-blur-lg ${visible ? "h-[60px]" : "h-[0px] hidden"} flex items-center justify-start`}>
      {showBackButton && (
        <button 
          onClick={() => navigate(-1)}
          className='px-3 text-primary'
        >
          <ArrowLeft />
        </button>
      )}
    </div>
  )
}
