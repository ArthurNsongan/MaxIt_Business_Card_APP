import { AlertTriangleIcon } from 'lucide-react'
import React from 'react'

export default function Subscription() {
  return (
    <>
        <div className="flex flex-col items-center min-h-[calc(100dvh-60px)] w-full">
            <div className='p-2 w-full'>
                <div className="text-xs flex items-center justify-center rounded bg-primary/10 text-primary border border-gray-500/10 w-full p-2 font-bold"><AlertTriangleIcon className='mr-1.5'/> Aucun forfait de carte actif</div>
            </div>
            <div className="flex flex-col items-center justify-center w-full mt-6">
                <div className="text-2xl font-bold text-center leading-6">Choisissez votre <br/><span className='text-primary'>Package</span></div>
                <div className="text-sm text-gray-500 mt-4">Vous pouvez changer de forfait à tout moment</div>
            </div>           
        </div>
    </>
  )
}
