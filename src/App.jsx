import Calculator from "./components/shared/Calculator";
import logoCh from "./static/assets/image/logoCh.png";
import logoAG from "./static/assets/image/logoAG.png";
import React from "react";

function App() {
    return (
        <div className='relative w-full h-screen'>
            <header className="pt-7 bg-white">
                <img className='w-[200px] h-[60px]  object-contain mx-auto' src={logoCh} alt="logo"/>
            </header>
            <div className="lg:container mx-auto">
                <Calculator/>
            </div>
            <footer className='absolute bottom-5 right-10'>
                <div className='flex items-end gap-x-2'>
                    <img className='w-fit h-[80px]  object-contain mx-auto' src={logoAG} alt="logo"/>
                </div>
            </footer>
        </div>
    )
        ;
}

export default App;
