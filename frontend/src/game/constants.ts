import { pad } from "./padding";

export const WIDTH = 800;
export const HEIGHT = 730;
export const ballRadius = 7;
export const obstacleRadius = 4;

export const gravity = pad(0.6);
export const horizontalFriction = 0.4;
export const verticalFriction = 0.8;

export const sinkWidth = 36;
export const NUM_SINKS = 17;

export const IMG = {
  LOGIN:
    "https://images.unsplash.com/photo-1517232115160-ff93364542dd?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

export const AUTH_STATE = {
  LOGIN: 0,
  SIGNUP: 1,
  FORGET_PASSWORD: 2,
  EMAIL_VERIFICATION: 3,
};

export const OTP_INTERVAL = 60;

export const RESEND_TYPE = {
  VERIFICATION: 1,
  FORGET_PASSWORD: 2,
};

interface StringMap {
  [key: number]: string;
}

export const AVATAR: StringMap = {
  1: "https://img.freepik.com/free-photo/portrait-man-cartoon-style_23-2151134256.jpg?size=626&ext=jpg&ga=GA1.1.1028521158.1718732320&semt=ais_user",
  2: "https://img.freepik.com/free-photo/3d-rendering-elder-person-portrait_23-2150964616.jpg?size=626&ext=jpg&ga=GA1.1.1028521158.1718732320&semt=ais_user",
  3: "https://img.freepik.com/free-photo/view-3d-cool-modern-bird_23-2150946453.jpg?size=626&ext=jpg&ga=GA1.1.1028521158.1718732320&semt=ais_user",
  4: "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100202.jpg?size=626&ext=jpg&ga=GA1.1.1028521158.1718732320&semt=ais_user",
  5: "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100262.jpg?size=626&ext=jpg&ga=GA1.1.1028521158.1718732320&semt=ais_user",
  6: "https://img.freepik.com/free-photo/3d-cartoon-style-character_23-2151034029.jpg?size=626&ext=jpg&ga=GA1.1.1028521158.1718732320&semt=ais_user",
  7: "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100279.jpg?size=626&ext=jpg&ga=GA1.1.1028521158.1718732320&semt=ais_user",
  8: "https://img.freepik.com/free-photo/cartoon-character-with-handbag-sunglasses_71767-99.jpg?size=626&ext=jpg&ga=GA1.1.1028521158.1718732320&semt=ais_user",
  9: "https://img.freepik.com/free-photo/view-3d-cool-modern-bird_23-2150946639.jpg?size=626&ext=jpg&ga=GA1.1.1028521158.1718732320&semt=ais_user",
  10: "https://img.freepik.com/premium-photo/3d-illustration-image_1016686-42726.jpg?size=626&ext=jpg&ga=GA1.1.1028521158.1718732320&semt=ais_user",
  11: "https://img.freepik.com/free-photo/cartoon-man-wearing-glasses_23-2151136831.jpg?size=626&ext=jpg&ga=GA1.1.1028521158.1718732320&semt=ais_user",
  12: "https://img.freepik.com/free-photo/3d-rendering-man-portrait_23-2150964650.jpg?size=626&ext=jpg&ga=GA1.1.1028521158.1718732320&semt=ais_user",
};

export const billionaires: { name: string; _id: number }[] = [
  {
    name: "Elon musk",
    _id: 1,
  },
  {
    name: "Mark zuckerberg",
    _id: 2,
  },
  {
    name: "Talha anjum",
    _id: 3,
  },
  {
    name: "Harkirat singh",
    _id: 4,
  },
  {
    name: "Samay raina",
    _id: 5,
  },
  {
    name: "Warrent buffet",
    _id: 6,
  },
  {
    name: "Sundar pichai",
    _id: 7,
  },
  {
    name: "Mukesh Ambani",
    _id: 8,
  },
];

export const BET_RISK = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
};
