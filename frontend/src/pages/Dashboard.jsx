import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Dashboard() {
  const navigate = useNavigate();

  const createRoom = () => {
    const roomId = crypto.randomUUID().slice(0, 6);
    navigate(`/room/${roomId}`);
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      <button onClick={createRoom} className="bg-black text-white p-2 rounded">
        Create Whiteboard Room
      </button>

      <button onClick={logout} className="bg-red-500 text-white p-2 rounded ml-4">
        Logout
      </button>
    </div>
  );
}
