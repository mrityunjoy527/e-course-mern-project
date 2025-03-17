import { Outlet } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar';
import useEditProfileDialog from './utils/useEditProfileDialog';
import useAuth from './utils/useAuth';
import { useQuery } from 'react-query';
import LoadingPage from './components/LoadingPage';
import { Toaster,} from 'react-hot-toast';
import useProfileDialog from './utils/useProfileDialog';

function App() {

  const { blockScroll } = useEditProfileDialog();
  const { getUser } = useAuth();
  const { resetDialog } = useProfileDialog();
  const { isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: Infinity,
  });

  return (
    <main className={`h-screen mx-auto flex flex-col bg-white ${blockScroll ? "overflow-y-hidden" : ""}`}>
      {isLoading ? <LoadingPage /> :
        <div onClick={resetDialog}>
          <Navbar />
          <Outlet />
        </div>
      }
      <Toaster
        position='bottom-right'
        containerStyle={{ bottom: "50px", right: "30px" }}
        toastOptions={{
          style: {
            background: "black",
            color: "white",
            padding: "10px",
          }
        }} />
    </main>
  )
}

export default App;
