import React from 'react'
import { useAppBar } from '../contexts/appbar_context'
import { useEffect } from 'react';
import { useUser } from '../contexts/user_context';
import { ArrowLeft, Facebook, Globe2, InstagramIcon, LinkedinIcon, Locate, Mail, MapPin, Phone, Pin, Twitter, TwitterIcon, XIcon } from 'lucide-react';
import FormattedText from '../components/formatter';

function EditPreviewCard({previous_action, card_type = null}) {

  const { setVisible } = useAppBar();
  const { user_card } = useUser();

  useEffect(() => {
    setVisible(false)
  }, []);

  return (
    <>
    <button className='fixed z-[100] top-2 right-4 flex items-center 
        justify-center h-12 w-12 rounded bg-black text-primary' onClick={previous_action}><ArrowLeft /></button>
    {
      card_type == null ? <EditPreviewBasicCard preview_data={user_card} card_type={card_type}/> :
      card_type == "basic" ? <EditPreviewBasicCard preview_data={user_card} card_type={card_type} /> :
      card_type == "premium" ? <EditPreviewPremiumCard preview_data={user_card} card_type={card_type} /> : <></>
    }
    </>
  );
}


function EditPreviewBasicCard({preview_data}) {
  return (
    <>
      <div className="w-screen relative translate-y-[-25px] flex flex-col">
          <div className='bg-black -mb-16 relative tracking-wide text-white h-[180px] pl-[32px] pr-[32px] pb-[60px] pt-[60px] rounded-b-2xl'>
            
          </div>

          <div className='relative z-[50] px-4'>
            <div className='pt-4 pb-4 shadow pl-4 pr-4 shadow-gray-400 min-h-[240px] flex justify-center relative bg-white w-[100%] max-w-md rounded-3xl shadow-md'>
                <div className='flex flex-col justify-between h-auto w-3/5'>
                  <div>
                    <h1 className='font-bold text-2xl'>{preview_data?.first_name}</h1>
                    <h1 className='font-bold text-2xl'>{preview_data?.last_name}</h1>
                  </div>

                  <div>
                    <p className='text-sm font-bold pt-3'>{preview_data?.job_title}</p>
                    <p className='text-[12px] font-semibold text-gray-600 pt-1 pb-3'>à {preview_data?.company}</p>
                  </div>

                  <div>
                    <img src={preview_data?.company_logo_url} className='h-[60px] max-w-fit rounded-xl' />
                  </div>

                </div>

                <img src={preview_data?.profile_photo_url} className='h-[200px] w-2/5 rounded-xl object-cover' />

                </div>
            </div>

            <div className='flex mt-5 pl-4 pr-4 mb-4 items-center'>
              <button className='rounded text-[13px] font-semibold bg-black border-2 border-black text-white pt-3 pb-3 m-1 w-full'>Ajouter aux contacts </button>
              <button className='rounded text-[13px] font-semibold bg-white border-2 border-black pt-3 pb-3 text-black m-1 w-full'>Partager le contact</button>
            </div>

            <div className='flex flex-col mt-5 pl-4 pr-4 mb-4 justify-center'>
              <span className='text-xl mb-3 text-black font-bold tracking-tighter'>Contact</span>
              
              <div className='flex items-center mb-3'>
                <div className='h-10 w-10 mr-4 text-white bg-black rounded flex items-center justify-center'>
                  <Phone size={24} />
                </div>
                <span className='text-sm font-semibold '>(+237) {preview_data?.phone_number}</span>
              </div>

              {
                preview_data?.email?.length > 0 ? 
                <div className='flex items-center mb-3'>
                  <div className='h-10 w-10 mr-4 text-white bg-black rounded flex items-center justify-center'>
                    <Mail size={24} />
                  </div>
                  <span className='text-sm font-semibold '>{preview_data?.email}</span>
                </div> : <></>
              }

              {
                preview_data?.website_url?.length > 0 ? 
                <div className='flex items-center mb-3'>
                  <div className='h-10 w-10 mr-4 text-white bg-black rounded flex items-center justify-center'>
                    <Globe2 size={24} />
                  </div>
                  <span className='text-sm font-semibold '>{preview_data?.website_url}</span>
                </div> : <></>
              }

              {
                preview_data?.address?.length > 0 ? 
                <div className='flex items-center mb-3'>
                  <div className='h-10 w-10 mr-4 text-white bg-black rounded flex items-center justify-center'>
                    <MapPin size={24} />
                  </div>
                  <span className='text-sm font-semibold '>{preview_data?.address}</span>
                </div> : <></>
              }

            </div>

            <div className='flex flex-col mt-5 pl-4 pr-4 mb-4 justify-center'>
              <span className='text-xl mb-3 text-black font-bold tracking-tighter'>Réseaux Sociaux</span>
              
              {
                preview_data?.facebook_url?.length > 0 ? 
                <a href={preview_data?.facebook_url} className='flex items-center mb-3'>
                  <div className='h-10 w-10 mr-4 text-white bg-blue-500 rounded flex items-center justify-center'>
                    <Facebook size={24} />
                  </div>
                  <span className='text-sm font-semibold '>Facebook</span>
                </a> : <></>
              }

              {
                preview_data?.instagram_url?.length > 0 ? 
                <a href={preview_data?.instagram_url} className='flex items-center mb-3'>
                  <div className='h-10 w-10 mr-4 text-white bg-pink-500 rounded flex items-center justify-center'>
                    <InstagramIcon size={24} />
                  </div>
                  <span className='text-sm font-semibold'>Instagram</span>
                </a> : <></>
              }

              {
                preview_data?.linkedin_url?.length > 0 ? 
                <a href={preview_data?.linkedin_url} className='flex items-center mb-3'>
                  <div className='h-10 w-10 mr-4 text-white bg-blue-600 rounded flex items-center justify-center'>
                    <LinkedinIcon size={24} />
                  </div>
                  <span className='text-sm font-semibold'>LinkedIn</span>
                </a> : <></>
              }

              {
                preview_data?.twitter_url?.length > 0 ? 
                <a href={preview_data?.twitter_url} className='flex items-center mb-3'>
                  <div className='h-10 w-10 mr-4 text-white bg-black rounded flex items-center justify-center'>
                    <Twitter size={24} />
                  </div>
                  <span className='text-sm font-semibold'>{preview_data?.twitter_url}</span>
                </a> : <></>
              }

            </div>

            <div className='flex flex-col mt-5 pl-4 pr-4 mb-4 justify-center'>
              <span className='text-xl mb-3 text-black font-bold tracking-tighter'>A Propos de Moi</span>
              {
                preview_data?.bio?.length > 0 ? <FormattedText preserveWhitespace
                tabSpaces={2} className='text-[14px] leading-4.5' text={preview_data?.bio}></FormattedText> : <></>
              }
            </div>
      </div></>
  )
}

function EditPreviewPremiumCard({preview_data}) {
    return (
      <>
      <div style={{
          color: preview_data?.text_color,
          backgroundColor: preview_data?.background_color
        }} className={"w-screen relative min-h-[100dvh] flex flex-col"}>
          <div className={`bg-black -mb-12 relative tracking-wide text-white h-[240px] 
            pl-[32px] pr-[32px] rounded-b-2xl`} 
            style={{ backgroundImage: "url('" + preview_data?.cover_image_url + "')", backgroundPosition: "center",
              backgroundSize: "cover"
            }}>
            
          </div>

          <div className='relative z-[50] px-4'style={{
            // backgroundColor: preview_data?.text_color,
            color: preview_data?.background_color
          }}>
            <div className='pt-4 pb-4 shadow pl-4 pr-4 shadow-gray-400 min-h-[240px] flex justify-center relative bg-white w-[100%] max-w-md rounded-3xl shadow-md'>
                <div className='flex flex-col justify-between h-auto w-3/5'>
                  <div>
                    <h1 className='font-bold text-2xl'>{preview_data?.first_name}</h1>
                    <h1 className='font-bold text-2xl'>{preview_data?.last_name}</h1>
                  </div>

                  <div>
                    <p className='text-sm font-bold pt-3'>{preview_data?.job_title}</p>
                    <p className='text-[12px] font-semibold text-gray-600 pt-1 pb-3'>à {preview_data?.company}</p>
                  </div>

                  <div>
                    <img src={preview_data?.company_logo_url} className='h-[60px] max-w-fit' />
                  </div>

                </div>

                <img src={preview_data?.profile_photo_url} className='h-[200px] w-2/5 rounded-xl object-cover' />

                </div>
            </div>

            <div className='flex mt-5 pl-4 pr-4 mb-4 items-center'>
              <button className='rounded text-[13px] font-semibold bg-black border-2 border-black text-white pt-3 pb-3 m-1 w-full'>Ajouter aux contacts </button>
              <button className='rounded text-[13px] font-semibold bg-white border-2 border-black pt-3 pb-3 text-black m-1 w-full'>Partager le contact</button>
            </div>

            <div className='flex flex-col mt-5 pl-4 pr-4 mb-4 justify-center'>
              <span className='text-xl mb-3 font-bold tracking-tighter'>Contact</span>
              
              <div className='flex items-center mb-3 border-1 border-transparent hover:border-black/20 rounded-lg 
                hover:bg-black/30 bg-black/20 p-2 cursor-pointer'>
                <div className='h-8 w-8 mr-4 bg-white rounded-lg flex items-center justify-center'>
                  <Phone size={20} color={preview_data?.background_color} />
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm font-semibold '>(+237) {preview_data?.phone_number}</span>
                  <span className='text-[12px]'>Numéro de téléphone</span>
                </div>
              </div>

              {
                preview_data?.email?.length > 0 ? 
                <div className='flex items-center mb-3 border-1 border-transparent hover:border-black/20 rounded-lg 
                hover:bg-black/30 bg-black/20 p-2 cursor-pointer'>
                  <div className='h-8 w-8 mr-4 bg-white rounded flex items-center justify-center'>
                    <Mail size={20} color={preview_data?.background_color} />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-sm font-semibold '>{preview_data?.email}</span>
                    <span className='text-[12px]'>Adresse e-mail</span>
                  </div>
                </div> : <></>
              }

              {
                preview_data?.website_url?.length > 0 ? 
                <div className='flex items-center mb-3 border-1 border-transparent hover:border-black/20 rounded-lg 
                  hover:bg-black/30 bg-black/20 p-2 cursor-pointer'>
                  <div className='h-8 w-8 mr-4 bg-white rounded flex items-center justify-center'>
                    <Globe2 size={20} color={preview_data?.background_color} />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-sm font-semibold '>{preview_data?.website_url}</span>
                    <span className='text-[12px]'>Site Web</span>
                  </div>
                </div> : <></>
              }

              {
                preview_data?.address?.length > 0 ? 
                <div className='flex items-center mb-3 border-1 border-transparent hover:border-black/20 rounded-lg 
                  hover:bg-black/30 bg-black/20 p-2 cursor-pointer'>
                  <div className='h-8 w-8 mr-4 bg-white rounded flex items-center justify-center'>
                    <MapPin size={20} color={preview_data?.background_color} />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-sm font-semibold '>{preview_data?.address}</span>
                    <span className='text-[12px]'>Adresse</span>
                  </div>
                </div> : <></>
              }

            </div>

            <div className='flex flex-col mt-5 pl-4 pr-4 mb-4 justify-center'>
              <span className='text-xl mb-3 font-bold tracking-tighter'>Réseaux Sociaux</span>
              
              {
                preview_data?.facebook_url?.length > 0 ? 
                <a href={preview_data?.facebook_url} className='flex items-center mb-3'>
                  <div className='h-10 w-10 mr-4 text-white bg-blue-500 rounded flex items-center justify-center'>
                    <Facebook size={24} />
                  </div>
                  <span className='text-sm font-semibold '>Facebook</span>
                </a> : <></>
              }

              {
                preview_data?.instagram_url?.length > 0 ? 
                <a href={preview_data?.instagram_url} className='flex items-center mb-3'>
                  <div className='h-10 w-10 mr-4 text-white bg-pink-500 rounded flex items-center justify-center'>
                    <InstagramIcon size={24} />
                  </div>
                  <span className='text-sm font-semibold'>Instagram</span>
                </a> : <></>
              }

              {
                preview_data?.linkedin_url?.length > 0 ? 
                <a href={preview_data?.linkedin_url} className='flex items-center mb-3'>
                  <div className='h-10 w-10 mr-4 text-white bg-blue-600 rounded flex items-center justify-center'>
                    <LinkedinIcon size={24} />
                  </div>
                  <span className='text-sm font-semibold'>LinkedIn</span>
                </a> : <></>
              }

              {
                preview_data?.twitter_url?.length > 0 ? 
                <a href={preview_data?.twitter_url} className='flex items-center mb-3'>
                  <div className='h-10 w-10 mr-4 text-white bg-black rounded flex items-center justify-center'>
                    <Twitter size={24} />
                  </div>
                  <span className='text-sm font-semibold'>{preview_data?.twitter_url}</span>
                </a> : <></>
              }

            </div>

            <div className='flex flex-col mt-5 pl-4 pr-4 mb-4 justify-center'>
              <span className='text-xl mb-3 font-bold tracking-tighter'>A Propos de Moi</span>
              {
                preview_data?.bio?.length > 0 ? <FormattedText preserveWhitespace
                tabSpaces={2} className='text-[14px] leading-4.5' text={preview_data?.bio}></FormattedText> : <></>
              }
            </div>
      </div>

    </>
    )
  }


export default EditPreviewCard