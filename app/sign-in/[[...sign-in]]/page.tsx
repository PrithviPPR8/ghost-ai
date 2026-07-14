import { SignIn } from "@clerk/nextjs";

import { AuthPageLayout } from "@/components/auth/auth-page-layout";

export default function SignInPage() {
  return (
    <AuthPageLayout
      description="Sign in to continue designing with your team."
      title="Welcome back"
    >
      <SignIn />
    </AuthPageLayout>
  );
}
