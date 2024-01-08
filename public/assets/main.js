import './style.css'
import './loading.css'
import './interactive.css'
import gsap from "gsap";
let t1 = gsap.timeline()
.to(".loading .line>div",{
    width:1,
    duration:0.5,
    x:0,
    delay:1,
    ease: "Power4.easeOut",
})
.to(".loading .line",{
    opacity:0,
    duration:0.5,

})
.to(".loading",{
    background:"transparent",
    duration:0.01,
})

.to(".loading .top, .loading .bottom",{
    height:1,
    duration:2,

})
.to(".loading",{
    opacity:0,
    userSelect:"none",
    pointerEvents:"none"
})
.from (".name-container .name",{
    opacity:0,
    x:-20,
    filter:"blur(5px)",
    duration:0.5,
    delay:1,

},"-=1.8")
.from(".name-container > .before",{
    opacity:0,
    x:100,
    y:-10,
    duration:0.5,
},"-=1")
.from(".name-container > .after",{
    opacity:0,
    x:-100,
    y:10,
    duration:0.5,
},"-=1")
.from(".hero .after-dots",{
    opacity:0,
    x:-10,
    y:10,
},"-=0")
.from(".hero .job-title",{
    opacity:0,
    x:50,
},"-=0.3")
.from(".hero .japanese-font",{
    opacity:0,
    y:-50,
    stagger:0.5,
},"-=0.6")
.to(".portfolio-btn svg path",{
    strokeDashoffset:80,
},)
.to(".portfolio-btn .square-aura",{
    opacity:1,
    duration:0.01,
})
.to(".portfolio-btn .square-aura",{
    width:"120px",
    height:"120px",
    outlineWidth:0,
    opacity:0,
    duration:1,
})
.from(".portfolio-btn .icon",{
    opacity:0,

},)


let portfolioBtn=document.querySelector(".portfolio-btn");
function portfolioBtnHover(){
    portfolioBtn.removeEventListener("mouseover",portfolioBtnHover);
    gsap.timeline({
        onStart:()=>{portfolioBtn.removeEventListener("mouseover",portfolioBtnHover)},
        onComplete:()=>{portfolioBtn.addEventListener("mouseover",portfolioBtnHover)}
    })
    .to(".portfolio-btn .arr2",{
        transform:"rotate(45deg) translate(-20px,-16px)",
        duration:0.3,
        opacity:0
    })
    .to(".portfolio-btn .arr3",{
        transform:"rotate(-45deg) translate(-16px,12px)",
        duration:0.3,
        opacity:0
    },"-=0.3")
    .to(".portfolio-btn .arr1",{
        x:100,
        opacity:0,
        duration:0.3,
    },"-=0.1")
    .to(".portfolio-btn .arr1",{
        x:-100,
        duration:0,
    })
    .to(".portfolio-btn .arr2",{
        transform:"rotate(45deg) translate(4px,-16px)",
        duration:0.3,
        opacity:1
    })
    .to(".portfolio-btn .arr3",{
        transform:"rotate(-45deg) translate(8px,12px)",
        duration:0.3,
        opacity:1
        
    },"-=0.3")
    .to(".portfolio-btn .arr1",{
        x:0,
        opacity:1,
        duration:0.3,
    })
    .to(".portfolio-btn .square-aura",{
        opacity:1,
        duration:0.01,
        width:"75px",
        height:"75px",
        outlineWidth:5,
        outlineColor:"red",
    })
    .to(".portfolio-btn .square-aura",{
        width:"120px",
        height:"120px",
        outlineWidth:0,
        opacity:0,
        duration:1,
        outlineColor:"blue",
    });
}
portfolioBtn.addEventListener("mouseover",portfolioBtnHover);


portfolioBtn.addEventListener("click",portfolioBtnClick);
function portfolioBtnClick(){
    gsap.timeline()
    .to(".portfolio-btn .arr1, .portfolio-btn .arr2, .portfolio-btn .arr3 ",{
        x:20,
        opacity:0,
        duration:0.3,
    })
}