import { ReactNode, useEffect, useState } from "react";
import { Member } from "../../lib/types/member";
import { GlobalContext } from "../hooks/useGlobals";
import MemberService from "../services/MemberService";
import { UNAUTHORIZED_EVENT } from "../services/api";

function readStoredMember(): Member | null {
  try {
    const memberJson = localStorage.getItem("memberData");
    return memberJson ? JSON.parse(memberJson) : null;
  } catch {
    localStorage.removeItem("memberData");
    return null;
  }
}

const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authMember, setAuthMember] = useState<Member | null>(
    readStoredMember,
  );
  const [orderBuilder, setOrderBuilder] = useState<Date>(new Date());

  useEffect(() => {
    // Sahifa yangilanganda token hali amal qilishini serverdan tasdiqlaymiz.
    // Token muddati o'tgan bo'lsa 401 keladi va auth holati tozalanadi.
    if (!readStoredMember()) return;

    const member = new MemberService();
    member
      .getMemberDetail()
      .then((data) => setAuthMember(data))
      .catch(() => {
        localStorage.removeItem("memberData");
        setAuthMember(null);
      });
  }, []);

  useEffect(() => {
    // Istalgan so'rov 401 qaytarsa (token eskirgan) — logout holatiga o'tamiz
    const onUnauthorized = () => setAuthMember(null);
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, []);

  return (
    <GlobalContext.Provider
      value={{ authMember, setAuthMember, orderBuilder, setOrderBuilder }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextProvider;
