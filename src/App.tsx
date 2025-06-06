import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import DrawingCanvas from './components/DrawingCanvas';

function App() {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <ThemeProvider>
    <DrawingCanvas />
    </ThemeProvider>
  );
}

export default App;
