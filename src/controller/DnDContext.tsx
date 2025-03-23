// import { createContext, useContext, useState } from 'react';

// const DnDContext = createContext<[string | null, React.Dispatch<React.SetStateAction<string | null>>]>([null, () => {}]);

// export const DnDProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [type, setType] = useState<string | null>(null);

//   return (
//     <DnDContext.Provider value={[type, setType]}>
//       {children}
//     </DnDContext.Provider>
//   );
// };

// export default DnDContext;

// export const useDnD = () => {
//   return useContext(DnDContext);
// };