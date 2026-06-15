const React = require("react");

// Jest (CJS) ESM-only swiper paketini yuklay olmaydi — testda soddalashtirilgan mock
const Swiper = ({ children }) => React.createElement("div", null, children);
const SwiperSlide = ({ children }) => React.createElement("div", null, children);

module.exports = { Swiper, SwiperSlide };
