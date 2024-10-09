import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
    return (
        <div className="flex justify-center items-center h-screen">
            <SignIn
                routing="path"
                path="/sign-in"
                redirectUrl={import.meta.env.VITE_CLERK_AFTER_SIGN_IN_URL}
            />
        </div>
    )
}