import gsap from "gsap";

export const pageInAnimation = () => {

    const loaderContainer = document.querySelectorAll(".splashscreen");
    const loaderIcon = document.getElementById("loaderIcon");
    const splashscreenText = document.getElementById("splashscreen-text");
    const splashscreenContainer = document.getElementById("splashscreen-container");
    const bars = document.getElementsByClassName("splashscreen-bars");
    const splashscreenODC = document.getElementById("splashscreen-odc")

    const tl = gsap.timeline();
    tl
      .to(loaderIcon, { 
        // rotation: 360, 
        // scale: 2, 
        duration: 0.5, 
        ease: "power1.out"})
      .to(splashscreenText, {
        opacity: 1,
        marginTop: 0,
        duration: 1
      })
      .to(bars, {
        backgroundColor: "black",
        duration: 0.3
      })
      .to(splashscreenODC, {
        opacity: 0
      })
      .to(splashscreenText, {
        color: "white"
      }, "-=0.3")
      .to(splashscreenContainer, { opacity: 0, duration: 0.5})
      .to(bars, { x: "100%", stagger: 0.3, duration: 0.8})
      .to(bars, { width: 0, height: 0, duration: 0})
      .to(loaderContainer, { width: 0, height: 0, duration: 0,
        onComplete: () => {
          splashscreenODC.remove();
          // splashscreenContainer.remove();
          //loaderContainer.remove();
        }
      });

}

export const pageInTransition = () => {

  const loaderContainer = document.querySelectorAll(".splashscreen");
  // const loaderIcon = document.getElementById("loaderIcon");
  // const splashscreenText = document.getElementById("splashscreen-text");
  // const splashscreenContainer = document.getElementById("splashscreen-container");
  const bars = document.getElementsByClassName("splashscreen-bars");
  // const splashscreenODC = document.getElementById("splashscreen-odc")

  const tl = gsap.timeline();
  tl
    // .to(loaderIcon, { 
    //   // rotation: 360, 
    //   // scale: 2, 
    //   duration: 0.5, 
    //   ease: "power1.out"})
    // .to(splashscreenText, {
    //   opacity: 1,
    //   marginTop: 0,
    //   duration: 1
    // })
    // .to(bars, {
    //   backgroundColor: "black",
    //   duration: 0.3
    // })
    // .to(splashscreenODC, {
    //   opacity: 0
    // })
    // .to(splashscreenText, {
    //   color: "white"
    // }, "-=0.3")
    // .to(splashscreenContainer, { opacity: 0, duration: 0.5})
    .to(bars, { x: "100%", stagger: 0.3, duration: 0.8})
    .to(bars, { width: 0, height: 0, duration: 0})
    .to(loaderContainer, { width: 0, height: 0, duration: 0,
      onComplete: () => {
        // splashscreenODC.remove();
        // splashscreenContainer.remove();
        //loaderContainer.remove();
      }
    });

}