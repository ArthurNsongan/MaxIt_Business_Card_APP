import { ArrowRight, BadgeX } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

function HomeNoSubscription() {
   
  return (
    <>
        <div className="w-full bg-white  relative min-h-[calc(100dvh-0px)] flex flex-col items-center justify-center">
          <div className='relative flex flex-col items-center justify-center tracking-wide text-white pl-[32px] pr-[32px] rounded-b-2xl'>
            <svg className='size-40 block mb-5' viewBox="0 0 454 454">
              <path d="M42.2302 150.178C38.918 135.252 39.4266 119.731 43.7089 105.055C47.9911 90.3777 55.9084 77.02 66.7266 66.2202C77.5449 55.4203 90.9138 47.5279 105.594 43.2747C120.274 39.0215 135.79 38.5452 150.703 41.89C158.911 29.0475 170.219 18.4788 183.584 11.158C196.949 3.83725 211.941 0 227.178 0C242.416 0 257.408 3.83725 270.773 11.158C284.138 18.4788 295.446 29.0475 303.654 41.89C318.59 38.5306 334.132 39.0048 348.836 43.2683C363.539 47.5319 376.926 55.4463 387.751 66.2754C398.576 77.1045 406.487 90.4966 410.749 105.206C415.011 119.915 415.485 135.464 412.126 150.405C424.964 158.617 435.528 169.929 442.846 183.299C450.164 196.67 454 211.668 454 226.911C454 242.154 450.164 257.152 442.846 270.523C435.528 283.893 424.964 295.205 412.126 303.417C415.47 318.336 414.994 333.858 410.742 348.543C406.491 363.229 398.602 376.603 387.806 387.426C377.01 398.248 363.658 406.169 348.987 410.453C334.316 414.737 318.801 415.246 303.881 411.932C295.683 424.824 284.367 435.438 270.979 442.791C257.591 450.145 242.565 454 227.292 454C212.019 454 196.993 450.145 183.605 442.791C170.217 435.438 158.9 424.824 150.703 411.932C135.79 415.277 120.274 414.801 105.594 410.547C90.9138 406.294 77.5449 398.402 66.7266 387.602C55.9084 376.802 47.9911 363.444 43.7089 348.767C39.4266 334.091 38.918 318.57 42.2302 303.644C29.2942 295.454 18.6389 284.124 11.2554 270.708C3.87184 257.292 0 242.226 0 226.911C0 211.596 3.87184 196.53 11.2554 183.114C18.6389 169.698 29.2942 158.368 42.2302 150.178Z" fill="#FF7900"/>
              <path d="M283.75 170.25L170.25 283.75" stroke="white" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M170.25 170.25L283.75 283.75" stroke="white" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h2 className='text-2xl text-black mt-4 font-semibold text-center mb-8'>Aucun forfait de <br/>carte digitale disponible</h2>
            
            <Link to="/subscription-plans" 
              className='flex items-center justify-between text-white text-md rounded bg-primary 
              pt-1 pb-1 font-medium tracking-wide text-center m-2 w-full'>
              <span className='block m-2'></span>
              <span className='pl-2 pr-2'>Prévisualiser</span>
              <span className='block m-2'><ArrowRight /></span>
            </Link>

          </div>
          
        </div>
      </>
  )
}

export default HomeNoSubscription