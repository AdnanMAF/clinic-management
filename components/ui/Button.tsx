   import type { ButtonHTMLAttributes } from "react";

   type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
     variant?: "primary" | "secondary" | "danger";
   };

   const VARIANTS = {
     primary: "bg-blue-600 text-white",
     secondary: "border border-gray-500",
     danger: "bg-red-600 text-white",
   } as const;

   export function Button({ variant = "primary", className = "", ...rest }: Props) {
     return (
       <button
         className={`rounded px-4 py-2 disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
         {...rest}
       />
     );
   }