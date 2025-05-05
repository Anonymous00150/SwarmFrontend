
// 最简代码，也就是这些字段必须有
export default {
  path: "/info",
  redirect: "/info/index",
  meta: {
    title: "用户"
  },
  children: [
    {
      path: "/info/index",
      name: "Info",
      component: () => import("@/views/info/index.vue"),
      meta: {
        title: "个人用户信息展示"
      }
    }
  ]
};
