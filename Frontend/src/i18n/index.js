import { createI18n } from "vue-i18n";
import th from "./th";

const messages = {
  th: th,
};

const i18n = createI18n({
  locale: "th",
  messages: messages,
});

export default i18n;
