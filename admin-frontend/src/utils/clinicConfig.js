const STORAGE_KEY = "vitalkey_clinic_config";

export const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const DAY_PRESETS = {
  mon_fri: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  mon_sat: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  daily: DAY_ORDER,
};

export const DEFAULT_CLINIC_CONFIG = {
  centerName: "VitalKey Community Health Center",
  address: "123 Rizal Avenue, Baliuag, Bulacan",
  contactNumber: "+63 44 766 0001",
  email: "admin@vitalkey.ph",
  openingTime: "08:00",
  closingTime: "17:00",
  consultationDays: DAY_PRESETS.mon_fri,
};

function normalizeConfig(config) {
  return {
    ...DEFAULT_CLINIC_CONFIG,
    ...config,
    consultationDays: Array.isArray(config?.consultationDays)
      ? config.consultationDays
      : DEFAULT_CLINIC_CONFIG.consultationDays,
  };
}

export function loadClinicConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CLINIC_CONFIG;
    return normalizeConfig(JSON.parse(raw));
  } catch {
    return DEFAULT_CLINIC_CONFIG;
  }
}

export function saveClinicConfig(config) {
  const normalized = normalizeConfig(config);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function timeToMinutes(timeText) {
  const [hours, minutes] = String(timeText).split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
}

export function formatTime(timeText) {
  const minutes = timeToMinutes(timeText);
  if (minutes == null) return "-";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h >= 12 ? "PM" : "AM";
  const twelveHour = h % 12 || 12;
  return `${twelveHour}:${String(m).padStart(2, "0")} ${period}`;
}

export function getDailyOperatingHours(config) {
  const open = timeToMinutes(config.openingTime);
  const close = timeToMinutes(config.closingTime);
  if (open == null || close == null || close <= open) return 0;
  return (close - open) / 60;
}

export function buildWeeklySchedule(config) {
  const opening = formatTime(config.openingTime);
  const closing = formatTime(config.closingTime);
  const hoursText = `${opening} - ${closing}`;

  return DAY_ORDER.map((day) => {
    const isOpen = config.consultationDays.includes(day);
    return {
      day,
      open: isOpen,
      hours: isOpen ? hoursText : "-",
    };
  });
}

export function validateAppointmentSlot({ day, time }, config = loadClinicConfig()) {
  if (!config.consultationDays.includes(day)) {
    return {
      allowed: false,
      reason: "Appointment day is outside consultation days.",
    };
  }

  const value = timeToMinutes(time);
  const open = timeToMinutes(config.openingTime);
  const close = timeToMinutes(config.closingTime);

  if (value == null || open == null || close == null || close <= open) {
    return {
      allowed: false,
      reason: "Clinic schedule is invalid. Check opening and closing times.",
    };
  }

  if (value < open || value > close) {
    return {
      allowed: false,
      reason: "Appointment time is outside operating hours.",
    };
  }

  return {
    allowed: true,
    reason: "Appointment fits clinic operating schedule.",
  };
}
