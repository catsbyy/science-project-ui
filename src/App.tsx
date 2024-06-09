import { AuthProvider, MainLayout } from './auth/AuthWrapper';
import './App.css';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </div>
  );
}

export default App;
