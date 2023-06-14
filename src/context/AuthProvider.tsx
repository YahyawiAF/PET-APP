import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import supabase from "../config/supabaseClient";
import { AuthResponse, Session } from "@supabase/supabase-js";

interface AppContextInterface {
  user: any;
  signUp: (data: any) => Promise<AuthResponse>;
  logIn: (data: any) => Promise<AuthResponse>;
  signOut: () => void;
  session: Session | null;
}

export const AuthContext = createContext<AppContextInterface>(
  {} as AppContextInterface
);

interface AuthProviderProps {
  children?: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    let gotSession = localStorage.getItem("authSession");
    if (gotSession) {
      setSession(JSON.parse(gotSession));
      setUser(JSON.parse(gotSession));
    }
    
    async function getSession() {
      setLoading(false);
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session) {
         
          setUser(session.user);
          localStorage.setItem("authSession", JSON.stringify(session));
          setSession(session);
        } else {
          localStorage.removeItem("authSession");
          setSession(null);
          setUser(null);
        }
        setLoading(false);
      });
      return () => {
        subscription?.unsubscribe();
      };
    }
    getSession();
  }, []);

  const value = {
    session,
    signUp: (data: any) => supabase.auth.signUp(data),
    logIn: (data: any) => supabase.auth.signInWithPassword(data),
    signOut: () => supabase.auth.signOut(),
    user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
