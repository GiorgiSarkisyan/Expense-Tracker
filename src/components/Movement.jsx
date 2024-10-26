/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";

export default function Movement({ mov }) {
  const [details, setDetails] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef(null);
  const [modalHeight, setModalHeight] = useState("0px");

  const handleToggleModal = () => {
    setModalOpen((prev) => !prev);
  };

  useEffect(() => {
    if (modalOpen) {
      setModalHeight(`${modalRef.current.scrollHeight}px`);
    } else {
      setModalHeight("0px");
    }
  }, [modalOpen]);

  return (
    <>
      <li
        className={`cursor-pointer ${
          mov.amount > 0
            ? "border-l-8 border-l-green-600"
            : "border-l-8 border-red-600"
        } px-2`}
      >
        <div
          className="w-[500px] h-20 flex justify-between"
          onMouseEnter={() => setDetails(true)}
          onMouseLeave={() => setDetails(false)}
          onClick={handleToggleModal}
        >
          <span className="font-poppins text-3xl text-center flex items-center w-20">
            {Math.abs(mov.amount)}$
          </span>
          {details && !modalOpen && (
            <span className="font-poppins flex items-center">Show more</span>
          )}
          <span className="font-poppins text-3xl uppercase flex items-center justify-end">
            {mov.type}
          </span>
        </div>
        <div
          ref={modalRef}
          style={{ height: modalHeight }}
          className={`bg-white overflow-hidden transition-height duration-300`}
        >
          <div className="pt-3 px-5">
            <span className="font-poppins text-xl">{mov.date}</span>
            <p className="font-poppins text-xl border-b-4 border-gray-400 min-h-24">
              {mov.content}
            </p>
            {modalOpen && (
              <span
                className="font-poppins text-2xl flex items-center justify-center duration-300 transition-all hover:bg-gray-400 hover:text-white"
                onClick={handleToggleModal}
              >
                Show less
              </span>
            )}
          </div>
        </div>
      </li>
    </>
  );
}
