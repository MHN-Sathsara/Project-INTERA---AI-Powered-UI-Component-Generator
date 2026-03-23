import { supabase } from "./supabaseClient.js";

export const saveComponent = async (componentData) => {
  const { data, error } = await supabase
    .from("saved_components")
    .insert([
      {
        name: componentData.name,
        code: componentData.code,
        type: componentData.type,
        description: componentData.description || "",
        prompt: componentData.prompt || "",
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  return { data, error };
};

export const getUserComponents = async () => {
  const { data, error } = await supabase
    .from("saved_components")
    .select("*")
    .order("created_at", { ascending: false });

  return { data, error };
};

export const deleteComponent = async (id) => {
  const { error } = await supabase
    .from("saved_components")
    .delete()
    .eq("id", id);

  return { error };
};
