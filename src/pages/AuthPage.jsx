import { useState } from "react";
import Login from "../components/Login";
import SignUp from "../components/SignUp";

export default function AuthPage() {
  const [modal, setModal] = useState(false);

  return (
    <main className="bg-cyan-600 h-dvh w-full flex items-center justify-center">
      {!modal ? <Login setState={setModal} /> : <SignUp setState={setModal} />}
    </main>
  );
}
