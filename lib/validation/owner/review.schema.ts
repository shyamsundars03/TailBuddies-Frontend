import * as z from "zod";

export const reviewSchema = z.object({
  rating: z.number().min(1, { message: "Please select a star rating" }).max(5),
  comment: z.string().optional().refine(
    (val) => {
      if (!val) return true;
      const count = val.trim().split(/\s+/).filter(Boolean).length;
      return count <= 100;
    },
    { message: "Comment cannot exceed 100 words" }
  ),
});

export type ReviewValues = z.infer<typeof reviewSchema>;
