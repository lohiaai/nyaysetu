"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import { auth } from "./config";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: UserData) => Promise<void>;
  logout: () => Promise<void>;
}

interface UserData {
  fullName: string;
  phone: string;
  location: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Check admin/premium status from Supabase
        const supabase = createClient();
        const { data } = await supabase
          .from("users")
          .select("is_admin, is_premium")
          .eq("email", firebaseUser.email)
          .single();
        
        if (data) {
          setIsAdmin(data.is_admin || false);
          setIsPremium(data.is_premium || false);
        }
      } else {
        setIsAdmin(false);
        setIsPremium(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, userData: UserData) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update Firebase profile
    await updateProfile(userCredential.user, {
      displayName: userData.fullName
    });

    // Create user in Supabase
    const supabase = createClient();
    await supabase.from("users").insert({
      id: userCredential.user.uid,
      email: email,
      full_name: userData.fullName,
      phone: userData.phone,
      location: userData.location,
      is_admin: email === "advlakhilohia@gmail.com",
      is_premium: false
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isPremium, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
