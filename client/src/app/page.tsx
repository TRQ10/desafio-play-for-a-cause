import { client } from "@/lib/db"

export default async function Home() {

  await client.set('hello', 'hello')
  
  return (
    <div className='text-red-400'>
      Hello World
    </div>
  )
}
    