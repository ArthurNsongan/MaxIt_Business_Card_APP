import React, { useRef } from 'react'
import { useUser } from '../../contexts/user_context'
import { toPng } from 'html-to-image';
import { QRCode} from 'react-qrcode-logo'

function HomeQRPage() {

  const { user_card } = useUser()
  
  const qrCodeRef = useRef(null);

  const downloadCard = () => {
    if (qrCodeRef.current === null) {
      return;
    }
    
    toPng(qrCodeRef.current)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'my-card.png';
        link.href = dataUrl;
        link.click();
      });
  };

  return (
    <>
        <div className="w-full relative translate-y-[-25px] min-h-[calc(100dvh-60px)] flex flex-col">
          <div className='bg-black relative tracking-wide text-white pl-[32px] pr-[32px] pt-[60px] h-[200px] rounded-b-2xl'>
            <h2 className='text-2xl font-bold'>Bienvenue</h2>
            <p className='leading-5 text-sm'>Interface de gestion de votre carte de visite digitale</p>
            
          </div>

          <div className='relative z-[50] flex flex-col items-center -mt-16 px-4'>
            <div ref={qrCodeRef} className='p-2 h-[320px] w-[320px] flex justify-center relative mt-4 bg-white w-[100%] max-w-md rounded-3xl shadow-md' style={{ aspectRatio: '1.8/1' }}>
                <div className="w-full flex flex-col justify-center items-center">
                  <div className="">
                    <QRCode
                      value={import.meta.env.VITE_API_URL + "/users/card/" + user_card.phone_number}
                      size={280}
                      quietZone={10}
                      bgColor="#ffffff"
                      fgColor={user_card.background_color}
                      logoImage={user_card.company_logo_url}
                      logoWidth={80}
                      logoHeight={80}
                      enableCORS="true"
                      qrStyle="dots"
                      eyeRadius={8}
                      removeQrCodeBehindLogo={true}
                      logoPadding={2}
                      logoPaddingStyle="circle"
                      ecLevel="H"
                      dotsOptions={{
                        type: "rounded",
                        color: "#ff7900"
                      }}
                      cornersSquareOptions={{
                        type: "extra-rounded",
                        color: "#ff7900"
                      }}
                      cornersDotOptions={{
                        type: "dot",
                        color: "#ff7900"
                      }}
                    />
                  </div>
                </div>
            </div>
            <div className='flex w-full items-center mt-4 text-white text-sm'>
                <button onClick={downloadCard} className='btn bg-primary pt-2 pb-2 w-full ml-1 mr-1 rounded'>Télécharger</button>
                <button className='btn bg-black pt-2 pb-2 w-full ml-1 mr-1 rounded'>Modifier</button>
            </div>
          </div>
          
        </div>
      </>
  )
}

export default HomeQRPage