import HomeVue from "@/views/Home.vue";
import {
  createRouter as _createRouter,
  createMemoryHistory,
  createWebHistory,

} from "vue-router";

const routes =[
  {
    path:"/",
    name: "home",
    component:HomeVue
  }
]

export function createRouter() {
  return _createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes,
  });
}
