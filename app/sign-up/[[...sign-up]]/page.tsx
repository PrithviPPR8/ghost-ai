import { SignUp } from "@clerk/nextjs";

import { AuthPageLayout } from "@/components/auth/auth-page-layout";

export default function SignUpPage() {
  return (
    <AuthPageLayout
      description="Create an account to start designing systems."
      title="Create your workspace"
    >
      <SignUp />
    </AuthPageLayout>
  );
}
