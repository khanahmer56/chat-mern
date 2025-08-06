import Loading from "@/component/Loading";
import VerifyPage from "@/component/VerifyPage";
import React, { Suspense } from "react";

const page = async ({ searchParams }: any) => {
  const email = searchParams.email;
  return (
    <Suspense fallback={<Loading />}>
      <VerifyPage email={email} />
    </Suspense>
  );
};

export default page;
