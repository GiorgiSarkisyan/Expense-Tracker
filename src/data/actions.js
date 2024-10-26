import toast from "react-hot-toast";
import { supabase } from "./supabase";

export async function signUp(email, password, username, file) {
  let { data: authData, error: authError } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        display_name: username,
        avatar_url: null,
      },
    },
  });

  if (authError) {
    console.error("Authentication Error:", authError);
    return { data: null, error: authError };
  }

  const { user } = authData;

  let imageUrl;

  if (file) {
    const fileName = `${user.id}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("File Upload Error:", uploadError);
      return { data: null, error: uploadError };
    }

    imageUrl = `https://iiohsmrbbtopcsezwkhb.supabase.co/storage/v1/object/public/avatars/${fileName}`;
  } else {
    imageUrl = `https://iiohsmrbbtopcsezwkhb.supabase.co/storage/v1/object/public/avatars/avatar.png`;
  }

  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      name: username,
      avatar_url: imageUrl,
    },
  });

  if (updateError) {
    console.error("Error updating user metadata:", updateError);
    return { data: null, error: updateError };
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .insert([
      {
        user_id: user.id,
        email: email,
        username: username,
        avatar_url: imageUrl,
      },
    ]);

  if (userError) {
    console.error("User Insert Error:", userError);
    return { data: null, error: userError };
  }

  toast.success("User created successfully!", {
    style: {
      font: "poppins",
      fontSize: "20px",
    },
  });

  return { data: userData, error: null };
}

export const checkUsersExist = async (username, email) => {
  try {
    const { data: usernameData, error: usernameError } = await supabase
      .from("users")
      .select("user_id")
      .eq("username", username);

    const { data: emailData, error: emailError } = await supabase
      .from("users")
      .select("user_id")
      .eq("email", email);

    if (usernameError) throw usernameError;
    if (emailError) throw emailError;

    return {
      usernameExists: usernameData.length > 0,
      emailExists: emailData.length > 0,
    };
  } catch (error) {
    console.error("Error checking user existence:", error);
    return { usernameExists: false, emailExists: false, error };
  }
};

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  if (!data) throw new Error("No Data Found");

  toast.success("Sign in Approved!", {
    style: {
      font: "poppins",
      fontSize: "20px",
    },
  });
  return data;
}

export async function getMovements(userId) {
  const { data: movements, error } = await supabase
    .from("movements")
    .select("*")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  console.log(movements);

  return movements;
}

export async function createMovement(amount, content, type, user_id) {
  const { data, error } = await supabase
    .from("movements")
    .insert([{ user_id, amount, type, content }])
    .select();

  if (error) throw new Error(error.message);

  toast.success("Movement Created Successfully ", {
    style: {
      font: "poppins",
      fontSize: "20px",
    },
  });
  return { data };
}

export async function Logout() {
  let { error } = await supabase.auth.signOut();

  if (error) throw new Error(error);

  toast.success("Successfully Logged Out", {
    style: {
      font: "poppins",
      fontSize: "20px",
    },
  });

  return error;
}
