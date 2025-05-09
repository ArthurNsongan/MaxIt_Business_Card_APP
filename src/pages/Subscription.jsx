import { AlertTriangleIcon, ChevronsDown, ChevronsUp, Menu } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { SubscriptionSlideDownCard } from '../components/slide_down_card'
import EditPreviewCard from './EditPreviewCard';

export default function Subscription() {

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState('right');
  const [isAnimating, setIsAnimating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigateToPage = (index, dir) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection(dir);
    
    // Short delay to ensure animation plays before changing the page
    setTimeout(() => {
      setActiveIndex(index);
      
      // Reset animation state after transition completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 700);
    }, 50);
  };

  const pages = ["forfait", "preview"];

  const goToPrevious = () => {
    const newIndex = activeIndex === 0 ? pages.length - 1 : activeIndex - 1;
    window.scrollTo({
      top: 0,         // vertical position in pixels
      left: 0, 
      behavior: "smooth"         // optional, for horizontal scroll
    });    
    navigateToPage(newIndex, 'left');
  };

  const goToNext = () => {
    const newIndex = (activeIndex + 1) % pages.length;
    window.scrollTo({
      top: 0,         // vertical position in pixels
      left: 0,          // optional, for horizontal scroll
    });    
    navigateToPage(newIndex, 'right');
  };

  const plans= [{
    title: "Carte Basique",
    value: "basic",
    description : ""
  }, {
    title: "Carte Premium",
    value: "premium",
    description : ""
  }];

  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    console.log("selectedPlan : ", selectedPlan)
  }, [selectedPlan]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowUp' && activeIndex > 0) {
        navigateToPage(activeIndex - 1, 'up');
      } else if (e.key === 'ArrowDown' && activeIndex < pages.length - 1) {
        navigateToPage(activeIndex + 1, 'down');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, isAnimating]);

  // Get page animation classes based on direction and animation state
  const getPageClasses = (index) => {
    if (index === activeIndex) {
      return `translate-x-0 opacity-100 z-10`;
    } else if (direction === 'right') {
      return index < activeIndex 
        ? `-translate-x-full opacity-0 z-0` 
        : `translate-x-full opacity-0 z-0`;
    } else if (direction === 'left') {
      return index > activeIndex 
        ? `translate-x-full opacity-0 z-0` 
        : `-translate-x-full opacity-0 z-0`;
    } else if (direction === 'up') {
      return `translate-y-full opacity-0 z-0`;
    } else {
      return `-translate-y-full opacity-0 z-0`;
    }
  };

  return (
    <>
        <div className={" min-h-[100dvh] w-screen relative " + (activeIndex == 0 ? "overflow-hidden" : "overflow-x-hidden")}>
          {/* Full-page slides */}
          {pages.map((page, index) => (
            <div
              key={index}
              className={`absolute inset-0 ${page.color} transition-all duration-700 ease-in-out ${getPageClasses(index)}`}
            >
              {
                  page == "forfait" ?
                  <div className="min-h-full w-screen flex flex-col"> 
                    <div className="flex flex-col items-center min-h-[calc(100dvh-60px)] overflow-y-auto w-full">
                      <div className='p-2 w-full'>
                          <div className="text-xs flex items-center justify-center rounded bg-primary/10 text-primary border border-gray-500/10 w-full p-2 font-bold"><AlertTriangleIcon className='mr-1.5'/> Aucun forfait de carte actif</div>
                      </div>
                      <div className="flex flex-col items-center justify-center w-full mt-6">
                          <div className="text-2xl font-bold text-center leading-6">Choisissez votre <br/><span className='text-primary'>Package</span></div>
                          <div className="text-sm text-gray-500 mt-4">Vous pouvez changer de forfait à tout moment</div>

                          <div className='p-4 w-full'>
                            {
                              plans.map((plan) => {
                                return <SubscriptionSlideDownCard className="mt-5 mb-5" 
                                  expanded={plan.value == selectedPlan} active_background={"bg-primary"} 
                                  active_color={"text-primary"} title={plan.title} action={() => { setSelectedPlan(plan.value) }} />
                              })
                            }
                          </div>
                      </div> 
                      <div className='w-full flex items-center justify-center p-3'>
                      {
                        selectedPlan != null ? <button onClick={goToNext} className='w-fit pl-4 pr-4 font-medium text-sm text-white tracking-wide bg-primary text-center rounded pt-2 pb-2'>Prévisualiser </button> : <></>
                      }
                      </div>          
                    </div>
                  </div> :
                  page == "preview" ? 
                        <EditPreviewCard previous_action={goToPrevious} card_type={selectedPlan} />
                       : <></>
                }

            </div>
          ))}
          
          
        </div>
    </>
  )
}
