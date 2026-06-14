import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const businessesAPI = {
  list: async (params) => {
    const { data } = await axios.get(`${API}/businesses`, { params });
    return data;
  },
  get: async (id) => {
    const { data } = await axios.get(`${API}/businesses/${id}`);
    return data;
  },
  create: async (businessData) => {
    const { data } = await axios.post(`${API}/businesses`, businessData, {
      withCredentials: true,
    });
    return data;
  },
};

export const servicesAPI = {
  list: async (businessId) => {
    const { data } = await axios.get(`${API}/businesses/${businessId}/services`);
    return data;
  },
  create: async (businessId, serviceData) => {
    const { data } = await axios.post(
      `${API}/businesses/${businessId}/services`,
      serviceData,
      { withCredentials: true }
    );
    return data;
  },
};

export const appointmentsAPI = {
  list: async (params) => {
    const { data } = await axios.get(`${API}/appointments`, {
      params,
      withCredentials: true,
    });
    return data;
  },
  get: async (id) => {
    const { data } = await axios.get(`${API}/appointments/${id}`, {
      withCredentials: true,
    });
    return data;
  },
  create: async (appointmentData) => {
    const { data } = await axios.post(`${API}/appointments`, appointmentData, {
      withCredentials: true,
    });
    return data;
  },
};
