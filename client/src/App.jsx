import { Outlet } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar';
import useEditProfileDialog from './utils/useEditProfileDialog';
import useAuth from './utils/useAuth';
import { useQuery } from 'react-query';
import { useEffect } from 'react';
import { toast} from 'react-toastify';
import LoadingPage from './components/LoadingPage';
import Progress from './components/Progress';

function App() {

  const { blockScroll } = useEditProfileDialog();
  const { user, getUser } = useAuth();
  const { isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    enabled: !user,
  });

  useEffect(() => {
    toast(<Progress text="Please wait..." />, { theme: "dark", customProgressBar: true, closeButton: false });
    return () => {
      toast.dismiss();
    }
  }, []);

  return (
    <main className={`h-screen mx-auto flex flex-col bg-white ${blockScroll ? "overflow-y-hidden" : ""}`}>
      {isLoading ? <LoadingPage /> :
        <>
          <Navbar />
          <Outlet />
        </>
      }
    </main>
  )
}

export default App;
