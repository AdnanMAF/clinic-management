   type Props = {
     label: string;
     name: string;
     value: string;
     onChange: (value: string) => void;
     error?: string;
     type?: string;
     required?: boolean;
   };

   export function TextField({
     label,
     name,
     value,
     onChange,
     error,
     type = "text",
     required,
   }: Props) {
     return (
       <div className="mb-4">
         <label htmlFor={name} className="mb-1 block text-sm font-medium">
           {label}
           {required && <span className="text-red-500"> *</span>}
         </label>
         <input
           id={name}
           name={name}
           type={type}
           value={value}
           onChange={(e) => onChange(e.target.value)}
           aria-invalid={error ? true : undefined}
           className="w-full rounded border border-gray-500 bg-transparent px-3 py-2"
         />
         {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
       </div>
     );
   }