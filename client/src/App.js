import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Register, Landing, Error, ProtectedRoute} from "./pages";
import { AllEvents, AddEvent, Profile, SharedLayout, Stats } from './pages/dashboard'

const App = () => <BrowserRouter>
  <Routes>
    <Route path='/' element={
      <ProtectedRoute>
        <SharedLayout/>
      </ProtectedRoute>
    }>
      <Route index element={<Stats/>}></Route>
      <Route path="all-jobs" element={<AllEvents/>}></Route>
      <Route path="add-job" element={<AddEvent/>}></Route>
      <Route path="profile" element={<Profile/>}></Route>
    </Route>
    <Route path="/register" element={<Register/>}></Route>
    <Route path="/landing" element={<Landing/>}></Route>
    <Route path="*" element={<Error/>}></Route>
  </Routes>
</BrowserRouter>

export default App;
