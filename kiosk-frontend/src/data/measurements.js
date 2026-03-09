export const MEASUREMENTS = [
  { id: "temp", title: "Body Temperature", shortTitle: "Body Temp", tone: "ha-card--amber", unit: "deg C", placeholder: "36.8" },
  { id: "bp", title: "Blood Pressure", shortTitle: "Blood Pressure", tone: "ha-card--rose", unit: "mmHg", placeholder: "120/80" },
  { id: "height", title: "Height", shortTitle: "Height", tone: "ha-card--slate", unit: "cm", placeholder: "168" },
  { id: "weight", title: "Weight", shortTitle: "Weight", tone: "ha-card--violet", unit: "kg", placeholder: "64.2" },
  { id: "bmi", title: "BMI", shortTitle: "BMI", tone: "ha-card--mint", unit: "kg/m2", placeholder: "22.7" },
  { id: "oxygen", title: "Oxygen Level", shortTitle: "Oxygen Level", tone: "ha-card--sky", unit: "percent SpO2", placeholder: "98" },
];

export function getMeasurementById(id) {
  return MEASUREMENTS.find((item) => item.id === id) || null;
}

