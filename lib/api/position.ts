import ApiRoutes from "@/constants/ApiRoutes";
import api from "../api";

// Define Position interface
export interface Position {
  id?: string; // optional for creation
  name: string;
  departmentId: string; // link to department
  description?: string;
  // add other fields if needed
}

/**
 * Add a new position
 */
export const addPosition = async (data: Position): Promise<Position> => {
  const response = await api.post(ApiRoutes.position.create, data);
  if (response.status !== 201) throw new Error("Failed to add position");
  return response.data;
};

/**
 * Fetch all positions
 */
export const fetchPositions = async (): Promise<Position[]> => {
  const response = await api.get(`${ApiRoutes.position.get}/filter`);
  if (response.status !== 200) throw new Error("Failed to fetch positions");
  return response.data;
};

/**
 * Delete a position by ID
 */
export const deletePosition = async (
  id: string
): Promise<{ success: boolean }> => {
  const response = await api.delete(
    ApiRoutes.position.delete.replace("{id}", id)
  );
  return response.data;
};

/**
 * Update an existing position
 */
export const updatePosition = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<Position>; // Partial for partial updates
}): Promise<Position> => {
  const response = await api.put(
    ApiRoutes.position.update.replace("{id}", id),
    data
  );
  if (response.status !== 200) throw new Error("Failed to update position");
  return response.data;
};
