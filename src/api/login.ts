import supabase from "../config/supabaseClient";

export async function signInWithEmail(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: "http://localhost:3000/home",
    },
  });
  return { data, error } 
}
