import { createApp } from "./main";
import { createRouter } from "./router";
const { app } = createApp()
const router = createRouter()
app.use(router)

router.isReady().then(() => {
  app.mount("#app", true);
})
