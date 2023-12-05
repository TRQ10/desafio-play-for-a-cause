"use client"

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

interface Props {
    children: ReactNode;
}


const Providers = ({ children }: Props) => {
    return (<SessionProvider>
        <Toaster position="top-center" reverseOrder={false} />
        {children}
    </SessionProvider>
    )
};

export default Providers