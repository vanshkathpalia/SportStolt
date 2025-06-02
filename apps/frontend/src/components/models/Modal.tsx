// // components/Modal.tsx
// "use client"
// import React, { useEffect } from "react"

// interface ModalProps {
//   isOpen: boolean
//   onClose: () => void
//   children: React.ReactNode
// }

// export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
//   useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose()
//     }
//     document.addEventListener("keydown", handleEscape)
//     return () => document.removeEventListener("keydown", handleEscape)
//   }, [onClose])

//   if (!isOpen) return null

//   return (
//     <div
//       className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
//       onClick={onClose}
//     >
//       <div
//         className="relative w-full h-full"
//         onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
//       >
//         {children}
//       </div>
//     </div>
//   )
// }
