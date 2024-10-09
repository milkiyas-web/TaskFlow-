import { useAuth, RedirectToSignIn } from '@clerk/clerk-react';
import '../../src/index.css'
const ProtectedRoute = ({ children }) => {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) {
        return <div className='flex items-center justify-center h-screen w-full'>
            <div className='loader'></div>
        </div>;
    }

    if (!isSignedIn) {
        return <RedirectToSignIn />;
    }

    return children;
};

export default ProtectedRoute;
