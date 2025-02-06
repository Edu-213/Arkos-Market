import { useEffect, useState } from "react";

const useIsMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobileScreen = () => {
            setIsMobile(window.innerWidth < breakpoint); 
        };
        checkMobileScreen();
        window.addEventListener('resize', checkMobileScreen);
        return () => {
            window.removeEventListener('resize', checkMobileScreen);
        };
    }, [breakpoint]);

    return isMobile;
};

export default useIsMobile;