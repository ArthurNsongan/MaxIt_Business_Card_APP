
export default function Splashscreen() {

  return (
    <>
      <div id="splashscreen-container" className="splashscreen h-[100dvh] w-screen z-[501] absolute top-0 flex flex-col items-center justify-center 
        overflow-hidden">
        <img src="/favicon.png" id="loaderIcon" width={100} height={100} />
        <span style={{marginTop: "-70px", opacity: 0}} id="splashscreen-text" className="text-black pt-[40px] font-bold text-3xl tracking-wider">Digital Business Card</span>
      </div>
      <div id="splashscreen-odc" className='h-[100dvh] w-screen z-[550] absolute flex flex-col justify-end items-center pb-4 overflow-hidden'>
        <span className='text-xs'>Designed by</span>
        <span className='font-bold'><span className='text-primary'>Orange</span> Digital Center</span>
      </div>
      <div className="splashscreen h-[100dvh] w-screen z-[500] absolute top-0 overflow-hidden">
        <div style={{backgroundColor: "white"}} className="splashscreen-bars min-h-[25vh] flex items-center justify-center"></div>
        <div style={{backgroundColor: "white"}} className="splashscreen-bars min-h-[25vh] flex items-center justify-center"></div>
        <div style={{backgroundColor: "white"}} className="splashscreen-bars min-h-[25vh] flex items-center justify-center"></div>
        <div style={{backgroundColor: "white"}} className="splashscreen-bars min-h-[25vh] flex items-center justify-center"></div>
      </div>
    </>
  )
}
