import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function awardPoints(studentId: string, teacherId: string, points: number, reason: string) {
  const { data, error } = await supabase
    .from("points")
    .insert([
      {
        student_id: studentId,
        teacher_id: teacherId,
        points,
        reason,
      },
    ]);

  if (error) {
    console.error("Error inserting points:", error);
    throw error;
  }

  return data;
}
