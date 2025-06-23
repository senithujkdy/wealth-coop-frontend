
export const API_BASE_URL = 'https://your-api-domain.com/api';

// For development - local Flask server
export const DEV_ML_API_BASE_URL = 'http://10.93.185.84:5000';


// ML Model endpoints
export const PREDICT_DEFAULT_URL = `${DEV_ML_API_BASE_URL}/predict-default`;
export const FORECAST_LOAN_AMOUNT_URL = `${DEV_ML_API_BASE_URL}/forecast-loan-amount`;
export const PREDICT_REPAYMENT_URL = `${DEV_ML_API_BASE_URL}/predict-repayment`;