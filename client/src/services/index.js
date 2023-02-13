import axios from "axios";
const BASE_URL = "http://localhost:4000/api/";

const instance = axios.create({
	baseURL: BASE_URL,
});

export const getCharges = async () => await instance.get(`/charge`);
export const postRefund = async (data) => await instance.post(`/refund`, data);
