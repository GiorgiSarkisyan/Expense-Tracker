import { useState, useContext } from "react";
import { MovContext } from "../context/MovContext";
import { supabase } from "../data/supabase";
import { createMovement } from "../data/actions";

export default function CreateMovement() {
  const { modal, setModal } = useContext(MovContext);
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState({
    type: "",
    amount: "",
    content: "",
  });

  const validate = () => {
    let isValid = true;
    const newError = { type: "", amount: "", content: "" };

    // Validate type
    if (!type) {
      newError.type = "Movement type is required.";
      isValid = false;
    }

    // Validate amount
    if (!amount) {
      newError.amount = "Amount is required.";
      isValid = false;
    } else if (isNaN(parseFloat(amount))) {
      newError.amount = "Amount must be a valid number.";
      isValid = false;
    }

    // Validate content
    if (!content) {
      newError.content = "Content is required.";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ type: "", amount: "", content: "" });

    if (!validate()) return;

    const { data } = await supabase.auth.getUser();
    const { user } = data;

    if (!user.id) {
      setError({ ...error, type: "User not authenticated." });
      return;
    }

    try {
      await createMovement(amount, content, type, user.id);
      setModal(false);
      setInterval(() => {
        window.location.reload();
      }, 750);
    } catch (err) {
      setError({ ...error, content: err.message });
    }
  };

  return (
    <>
      {modal && (
        <form
          onSubmit={handleSubmit}
          className="absolute w-[400px] h-[600px] p-10 rounded-xl bg-gray-300 right-1/2 bottom-1/2 translate-x-1/2 translate-y-1/2 flex flex-col gap-5"
        >
          <div className="flex flex-col gap-3">
            <label className="font-poppins text-2xl text-gray-500">
              Movement Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={`font-poppins text-xl text-gray-500 focus:outline-none focus:ring-2 ${
                error.type ? "ring-red-500" : "focus:ring-cyan-600"
              } shadow-xl`}
            >
              <option value="" disabled>
                Select a type
              </option>
              <option value="IT">IT</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-3">
            <label className="font-poppins text-2xl text-gray-500">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={error.amount || "Enter amount"}
              className={`font-poppins text-xl text-gray-500 focus:outline-none focus:ring-2 ${
                error.amount ? "focus:ring-red-500" : "focus:ring-cyan-600"
              } shadow-xl`}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="font-poppins text-2xl text-gray-500">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={error.content || "Enter content"}
              className={`font-poppins text-xl text-gray-500 focus:outline-none h-40 focus:ring-2 ${
                error.content ? "focus:ring-red-500" : "focus:ring-cyan-600"
              } shadow-xl resize-none`}
            />
          </div>
          <button
            className="mt-4 bg-blue-500 text-white rounded px-4 py-2 shadow-lg font-poppins"
            type="submit"
          >
            Create Movement
          </button>
          <button
            onClick={() => setModal(false)}
            className="mt-4 bg-blue-500 text-white rounded px-4 py-2 shadow-lg font-poppins"
          >
            Close
          </button>
        </form>
      )}
    </>
  );
}
