import { BrowserRouter as Router,Routes,Route,Navigate } from "react-router-dom"
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";

const ProtectedRoute=({children}:{children:React.ReactNode})=>{
  const userId =localStorage.getItem("userId");
  if(!userId ){
    return <Navigate to='/login' replace/>
  }
  return <>{children}</>
}
const PublicRoute=({children}:{children:React.ReactNode})=>{
  const userId =localStorage.getItem('userId');
  if(userId ){
    return <Navigate to='/dashboard'/>
  }
  return <>{children}</>
}

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path='/signup' element={<PublicRoute><Signup/></PublicRoute>} />
        <Route path='/login' element={<PublicRoute><Login/></PublicRoute>} />
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        <Route path='/' element={<Navigate to="/login" replace/>} />
        
      </Routes>
    </Router>
    </>
  )
      
}

export default App
