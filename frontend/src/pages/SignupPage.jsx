import { SignUp } from '@clerk/clerk-react'

export default function SignUpPage() {
    return (
        <div className='flex justify-center items-center h-screen'>
            <SignUp
                routing="path"
                path="/sign-up"
                redirectUrl={import.meta.env.VITE_CLERK_AFTER_SIGN_UP_URL}
            />
        </div>
    )
}