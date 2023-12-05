"use client"


import { useSession } from 'next-auth/react'
interface pageProps {

}

const page = ({ }) => {

  const { data: session, status } = useSession()

  console.log(session)

  return <><pre>{session?.backendTokens.expiresIn}</pre></>
}

export default page