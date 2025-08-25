import axios from "axios";

export type SignupFormData = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  referral: string;
};

export async function signupUser(data: SignupFormData) {
  const response = await axios.post("/api/signup", data);
  return response.data;
}