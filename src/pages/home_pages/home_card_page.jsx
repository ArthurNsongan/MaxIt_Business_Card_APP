import React, { useRef } from 'react'
import { useUser } from '../../contexts/user_context'
import { toPng } from 'html-to-image';
import { QRCode} from 'react-qrcode-logo'
import { Link } from 'react-router-dom';

function HomeCardPage() {

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
            link.download = 'my-card.png';
            link.href = dataUrl;
            link.click();
        });
    };

    return (
    <>
        <div className="w-full relative translate-y-[-25px] min-h-[calc(100dvh-60px)] flex flex-col">
          <div className='bg-black -mb-12 relative tracking-wide text-white pl-[32px] pr-[32px] pb-[60px] pt-[60px] h-[200px] rounded-b-2xl'>
            <h2 className='text-2xl font-bold'>Bienvenue</h2>
            <p className='leading-5 text-sm'>Interface de gestion de votre carte de visite digitale</p>
            
          </div>

          <div ref={qrCodeRef} className='relative z-[50] px-4'>
            <div className='pt-4 pb-4 shadow shadow-gray-400 min-h-[240px] flex justify-center relative bg-white w-[100%] max-w-md rounded-3xl shadow-md'>
                <div className="w-1/2 pl-4 flex flex-col tracking-wide justify-between">
                  {/* Informations principales */}
                  <div>
                    <h1 className="text-lg mb-1 text-[18px] font-bold leading-4 text-primary">{user_card.first_name} {user_card.last_name}</h1>
                    {
                      user_card?.job_title ?
                      <p className="text-[10px] leading-3.5 mb-1 font-semibold text-black">{user_card.job_title}</p>
                      : <></>
                    }
                    {/* <p className="text-md font-semibold mt-1" style={{ color: user_card.background_color }}>{user_card.company  }</p> */}
                  </div>
                  
                  {/* Coordonnées */}
                  <div className="mt-2">
                    {
                      user_card?.phone_number ?
                        <div className="flex items-center w-full mt-1 mb-1">
                          <div className='min-w-[24px]'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
                              stroke="currentColor" className="size-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                            </svg>
                          </div>
                          <span className='text-[10px] font-semibold'>(+237) {user_card?.phone_number}</span>
                        </div>
                      : <></>
                    }
                    {
                      user_card?.email ?
                        <div className="flex items-center w-full mt-1 mb-1">
                          <div className='min-w-[24px]'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
                              stroke="currentColor" className="size-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>
                          </div>
                          <span className='text-[10px] break-all font-semibold'>{user_card?.email}</span>
                        </div>
                      : <></>
                    }
                    {
                      user_card?.website_url ?
                        <div className="flex items-center mt-1">
                          <Globe size={14} className="mr-2" style={{ color: user_card.background_color }} />
                          <span className='text-[10px] font-semibold'>{user_card?.website}</span>
                        </div> 
                      : <></>
                    }
                  </div>

                  <div className="mt-2">
                    {
                      user_card?.company_logo_url ?
                        <div className="flex items-center mt-2">
                          <img crossOrigin='anonymous' src={user_card?.company_logo_url} className='h-[70px] rounded' />
                        </div>
                      : <></>
                    }
                  </div>

                </div>
                <div className="w-1/2 flex flex-col justify-center items-center">
                  <div ref={qrCodeRef} className="">
                    <QRCode
                      value={import.meta.env.VITE_API_URL + "/users/card/" + user_card.phone_number}
                      size={120}
                      quietZone={10}
                      bgColor="#ffffff"
                      fgColor={user_card.background_color}
                      logoImage={user_card.company_logo_url}
                      logoWidth={40}
                      logoHeight={40}
                      enableCORS="true"
                      qrStyle="dots"
                      eyeRadius={16}
                    //   removeQrCodeBehindLogo={true}
                      logoPadding={2}
                    //   logoPaddingStyle="circle"
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

export default HomeCardPage