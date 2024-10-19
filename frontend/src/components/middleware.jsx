import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import '../../src/index.css';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading, login } = useKindeAuth();

    if (isLoading) {
        return (
            <div className='flex items-center justify-center h-screen w-full'>
                <div className='loader'></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return login(); // Redirect to the Kinde login page
    }

    return children;
};

export default ProtectedRoute;

