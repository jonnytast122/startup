import ApiRoutes from "@/constants/ApiRoutes";
import api from "../api";

// Define a Position interface for type safety
export interface Position {
  id?: string;
  name: string;
  department?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Add a new position.
 * @param {Position} data - Position data
 * @returns {Promise<Position>} Created position data
 */
export const addPosition = async (data: Position): Promise<Position> => {
  const response = await api.post<Position>(ApiRoutes.position.create, data);
  return response.data;
};

/**
 * Fetch all positions (optionally filtered).
 * @returns {Promise<Position[]>} List of positions
 */
export const fetchPositions = async (): Promise<Position[]> => {
  const response = await api.get<Position[]>(
    `${ApiRoutes.position.get}/filter`
  );
  if (response.status !== 200) throw new Error("Failed to fetch positions");
  return response.data;
};

/**
 * Update a position.
 * @param {string} id - Position ID
 * @param {Partial<Position>} data - Updated position data
 * @returns {Promise<Position>} Updated position data
 */
export const updatePosition = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<Position>;
}): Promise<Position> => {
  const response = await api.put<Position>(
    ApiRoutes.position.update.replace("{id}", id),
    data
  );
  return response.data;
};

/**
 * Delete a position.
 * @param {string} id - The position ID
 * @returns {Promise<{ success: boolean; message?: string }>} Deletion result
 */
export const deletePosition = async (
  id: string
): Promise<{ success: boolean; message?: string }> => {
  const response = await api.delete<{ success: boolean; message?: string }>(
    ApiRoutes.position.delete.replace("{id}", id)
  );
  return response.data;
};
