import type { APIRoute } from "astro";
import { supabaseClient } from "../../db/supabase.client";
import type { GoalCategoryDTO, GoalCategoryListResponse } from "../../types";

export const GET: APIRoute = async ({ locals }) => {
  try {
    const supabase = locals.supabase;

    // Check if user is logged in
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({
          error: "Użytkownik niezalogowany",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // 2. Fetch goal categories from database
    const { data: categories, error: categoriesError } = await supabaseClient
      .from("goal_categories")
      .select("id, name")
      .order("name");

    if (categoriesError) {
      // eslint-disable-next-line no-console
      console.error("Błąd podczas pobierania kategorii celów:", categoriesError);
      return new Response(JSON.stringify({ error: "Wystąpił błąd podczas pobierania kategorii celów" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // 3. Transform data to DTO format
    const categoryDTOs: GoalCategoryDTO[] = categories.map((category) => ({
      id: category.id,
      name: category.name,
    }));

    // 4. Prepare response
    const response: GoalCategoryListResponse = {
      categories: categoryDTOs,
    };

    // 5. Return response
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Nieoczekiwany błąd podczas obsługi żądania:", error);
    return new Response(JSON.stringify({ error: "Wystąpił błąd serwera" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
