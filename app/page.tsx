
import { Button } from "@/components/ui/button";
import { getRole } from "@/utils/roles";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";


export default async function Home() {
    const {userId} = await auth();
    const role = await getRole();

    if (userId && role) {
      redirect(`/${role}`);
    }

  return (
    <div className="flex flex-col h-screen p-6">
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="mb-8">

            <h1 className="text-4xl md:text-5xl font-bold text-center">
              Welcome To <br />
              <span className="text-blue-700 text-5xl md:text-6xl"> My HealthCare</span>              
            </h1>
        </div>

        <div className="text-center max-w-xl flex flex-col items-center justify-center">
          <p className="mb-8">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Debitis magnam, aut magni vitae asperiores ipsa id itaque 
            reiciendis obcaecati dolorum dolore iusto reprehenderit dicta ea voluptatem architecto commodi repudiandae atque!
          </p>
        </div>

        <div>
        {userId ? (
              <>
                <Link href={`/${role}`}>
                  <Button  className="bg-blue-500 text-white hover:text-blue-400  m-3 shadow border">
                    View Dashboard</Button>
                </Link>

                 <UserButton />
              </>
            ) : (
              <>
                <Link href="/sign-up">
                  <Button className=" bg m-3 bg-green-500 text-white shadow border">
                    New Patient
                  </Button>
                </Link>

                <Link href="/sign-in">
                  <Button                   
                    className="bg-blue-500 text-white hover:text-blue-400  m-3 shadow border"
                  >
                    Login to account
                  </Button>
                </Link>
              </>
            )}
        </div>

      </div>

          <footer className="flex justify-center items-center mt-8">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} <span className="text-green-500">My HealthCare</span>. All rights reserved.
            </p>
          </footer>

    

    </div>
   
  );


}
