import { useEffect, useState, useContext } from "react";
import { supabase } from "../data/supabase";
import Profile from "../components/Profile";
import Spinner from "../components/Spinner";
import { getMovements } from "../data/actions.js";
import { MovContext } from "../context/MovContext.jsx";
import CreateMovement from "../components/CreateMovement.jsx";

export default function Home() {
  const [data, setData] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const { modal } = useContext(MovContext);

  useEffect(() => {
    async function getData() {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError) throw new Error("Could not get current session user");
        if (!sessionData || !sessionData.session) return;

        setData(sessionData.session);

        // Await getMovements to resolve before updating the state
        const movementsData = await getMovements(sessionData.session.user.id);
        if (movementsData) {
          setMovements(movementsData);
        } else {
          console.error("No movements data received");
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  return (
    <>
      <div
        className={` bg-cyan-600 h-dvh w-full flex items-center justify-center duration-700 transition-all ${
          modal ? "blur-sm no-pointer-events" : ""
        }`}
      >
        <div className="w-[1280px] bg-white h-full p-10 shadow-xl bg-gradient-to-bl from-white to-zinc-400">
          {loading ? (
            <Spinner />
          ) : (
            <Profile data={data} movements={movements} />
          )}
        </div>
      </div>
      <CreateMovement />
    </>
  );
}
