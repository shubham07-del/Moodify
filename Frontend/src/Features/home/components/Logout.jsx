import React from 'react'
import { LogOut } from "lucide-react";
import { useAuth } from '../../auth/hooks/useAuth';
import Loader from '../../auth/components/Loader';
import { useNavigate } from 'react-router';
const Logout = () => {

    const {loading, handleLogout} = useAuth()
    const navigate = useNavigate()

    const handleLogoutButton =async ()=>{
        await handleLogout()
        navigate("/login")
    }

    if(loading){
        return <Loader/>
    }
  return (
    <button
      onClick={handleLogoutButton}
      className="flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition-all duration-200 hover:bg-red-600 active:scale-95"
    >
      <LogOut size={18} />
      <span>Logout</span>
    </button>
  )
}

export default Logout