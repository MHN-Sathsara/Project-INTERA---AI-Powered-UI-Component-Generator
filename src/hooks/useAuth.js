import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient.js";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    const minLoadingDuration = 2500; // 2.5 seconds minimum
    let authCompleted = false;
    let authResult = null;

    // Get initial session
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        authResult = session?.user ?? null;
        authCompleted = true;

        // Calculate remaining time to meet minimum duration
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingDuration - elapsed);

        setTimeout(() => {
          setUser(authResult);
          setLoading(false);
        }, remainingTime);
      } catch (error) {
        console.error("Auth initialization error:", error);
        authCompleted = true;
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingDuration - elapsed);

        setTimeout(() => {
          setUser(null);
          setLoading(false);
        }, remainingTime);
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Only update immediately if initial loading is complete
      if (!loading || authCompleted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loading]);

  const signUp = async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { data, error };
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };
};
