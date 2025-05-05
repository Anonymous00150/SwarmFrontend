export default {
  path: "/manage",
  redirect: "/manage/index",
  meta: {
    title: "管理面板"
  },
  children: [
    {
      path: "/manage/index",
      name: "manage",
      component: () => import("@/views/manage/index.vue"),
      meta: {
        title: "管理面板"
      }
    }
  ]
};