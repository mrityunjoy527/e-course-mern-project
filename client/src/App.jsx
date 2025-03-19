import { Outlet } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar';
import useEditProfileDialog from './utils/useEditProfileDialog';
import useAuth from './utils/useAuth';
import { useQuery } from 'react-query';
import LoadingPage from './components/LoadingPage';
import { Toaster, } from 'react-hot-toast';
import useProfileDialog from './utils/useProfileDialog';
import { useEffect, useState } from 'react';
import { DarkModeContext } from './utils/DarkModeContext';
import useSortDialog from './utils/useSortDialog';

function App() {

  const { blockScroll } = useEditProfileDialog();
  const { getUser } = useAuth();
  const { resetDialog } = useProfileDialog();
  const { isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: Infinity,
  });

  const {resetSort} = useSortDialog();
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <main className={`min-h-screen mx-auto flex flex-col bg-white dark:bg-gray-900 ${blockScroll ? "overflow-y-hidden" : ""}`}>
      <DarkModeContext.Provider value={{ isDarkMode: darkMode, setDarkMode: setDarkMode }}>
        {isLoading ? <LoadingPage /> :
          <div onClick={() => {resetDialog(); resetSort();}}>
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
      </DarkModeContext.Provider>
    </main>
  )
}

export default App;
