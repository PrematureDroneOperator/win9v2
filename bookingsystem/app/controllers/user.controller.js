import supabase from "../config/supabase.config.js";

export const getUserProfile = async (req, res) => {
    try {
        const { data, error } = await supabase.auth.getUser(req.headers.authorization);
        if (error) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.user.id)
            .single();
        if (userError) {
            return res.status(500).json({ message: "Internal server error" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
//book the ride from user to rider
