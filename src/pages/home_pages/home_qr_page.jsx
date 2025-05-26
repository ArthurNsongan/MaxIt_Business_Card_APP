import React, { useRef } from 'react'
import { useUser } from '../../contexts/user_context'
import { toPng } from 'html-to-image';
import { QRCode} from 'react-qrcode-logo'
import { apiAddress } from '../../services/client';
import { PATHS } from '../../services/user_service';
import { Link } from 'react-router-dom';

function HomeQRPage() {

  const { user_card } = useUser()
  
  const qrCodeRef = useRef(null);

  const downloadCard = () => {
  
      if (qrCodeRef.current === null) {
          return;
      }

      const options = {
          cacheBust: true,
          quality: 1,
          pixelRatio: window.devicePixelRatio,
          style: {
              // Force visibility of all elements
              '.html-to-image-container *': {
              visibility: 'visible !important'
              }
          },
          // Ensure proper scrolling behavior
          scrollX: 0,
          scrollY: 0,
          // Handle CORS issues by filtering problematic nodes
          filter: (node) => {
              // Skip img elements without proper crossOrigin setting
              if (node.tagName === 'IMG') {
              const imgSrc = node.getAttribute('src') || '';
              if (imgSrc.startsWith('http') && 
                  !imgSrc.startsWith(window.location.origin) && 
                  node.getAttribute('crossorigin') !== 'anonymous') {
                  console.warn(`Filtering out image that might cause CORS issues: ${imgSrc}`);
                  return false;
              }
              }
              // Keep the node visible for capture
              return true;
          },
          // Provide fallback for cross-origin images
          // Image loading timeout
          imageTimeout: 5000,
          // For debugging
          logging: true,
          // Optional function to run before capture
          onCloneNode: (node) => {
              if (node.tagName === 'IMG') {
              // Add loading='eager' to images
              node.setAttribute('loading', 'eager');
              }
              return node;
          }
      };
      
      toPng(qrCodeRef.current, options)
      .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = 'qr_code.png';
          link.href = dataUrl;
          link.click();
      });
  };
  
  return (
    <>
        <div className="w-full relative translate-y-[-25px] min-h-[calc(100dvh-60px)] flex flex-col">
          <div className='bg-black -mb-12 relative tracking-wide text-white pl-[32px] pr-[32px] pt-[60px] h-[200px] rounded-b-2xl'>
            <h2 className='text-2xl font-bold'>Bienvenue</h2>
            <p className='leading-5 text-sm'>Interface de gestion de votre carte de visite digitale</p>
            
          </div>

          <div ref={qrCodeRef} className='relative z-[50] flex flex-col items-center px-4'>
            <div className='p-2 h-[320px] w-[320px] flex justify-center relative mt-4 bg-white w-[100%] max-w-md rounded-3xl shadow-md' style={{ aspectRatio: '1.8/1' }}>
                <div className="w-full flex flex-col justify-center items-center">
                  <div className="">
                    <QRCode
                      value={import.meta.env.VITE_API_URL + '/render/' + user_card.phone_number}
                      size={280}
                      quietZone={10}
                      bgColor="#ffffff"
                      fgColor={user_card.background_color}
                      logoImage={apiAddress + user_card.company_logo_url}
                      logoWidth={80}
                      logoHeight={80}
                      enableCORS="true"
                      qrStyle="dots"
                      eyeRadius={16}
                      removeQrCodeBehindLogo={true}
                      logoPadding={4}
                      // logoPaddingStyle="circle"
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
          </div>

          
          <div className='pl-[32px] pr-[32px] flex w-full items-center mt-4 text-white text-sm'>
            <button onClick={downloadCard} className='btn bg-primary pt-2 pb-2 w-full ml-1 mr-1 rounded'>Télécharger</button>
            <Link to={"/edit"} className='btn text-center bg-black pt-2 pb-2 w-full ml-1 mr-1 rounded'>Modifier</Link>
          </div>
          
        </div>
      </>
  )
}

export default HomeQRPage