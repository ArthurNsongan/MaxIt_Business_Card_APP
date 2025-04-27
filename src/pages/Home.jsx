import { ArrowRight } from 'lucide-react'
import React from 'react'

export default function Home() {
  return (
    <>
      <div className="w-full min-h-[calc(100dvh-60px)] flex flex-col items-center justify-center">
        <h1 className='text-3xl text-black text-center font-bold mb-12'>Bienvenue sur <br/>
          <span className='font-bold text-primary'>MaxIt Business Cards</span>
        </h1>
        <a href='/edit' type="button" className='bg-primary rounded-xl h-[56px] flex items-center justify-between text-white text-center'>
          <span>&nbsp;</span>
          <span className='text-bold mx-4 px-12 tracking-wider'>Commencer</span> 
          <ArrowRight size={30} className='mr-4'/>
        </a>
      </div>
    </>
  )
}
