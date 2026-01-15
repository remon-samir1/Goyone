import Link from 'next/link';
import React from 'react';

const Page = () => {
  return (
    <div className='flex items-center justify-center h-screen'>
    <Link className='text-white bg-primary rounded-md px-4 py-2' href='/crm'>CRM</Link>
    </div>
  );
}

export default Page;
