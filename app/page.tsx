import Link from "next/link";

const Page = () => {
  return (
    <div className="flex items-center justify-center h-screen">
        <Link
          className="text-white bg-primary rounded-md px-4 py-2 hover:bg-primary/90 transition-colors"
          href="/crm"
        >
          CRM
        </Link>
    </div>
  );
};

export default Page;
