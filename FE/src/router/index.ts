import {
  createRouter,
  createWebHistory,
  RouteLocationNormalized,
  RouteRecordRaw,
} from "vue-router";

import authUrl from "./auth";
import * as hidden from "./hidden";

import Home from "../views/Home.vue";
import Prodlist from "../views/Prodlist.vue";
import About from "../views/About.vue";
import Lisense from "../views/Lisense.vue";
import PostList from "../views/PostList.vue";
import Admin from "../views/Admin.vue";

import globalState from "@/store/global";
import curItemState from "@/store/Prod/ItemModule";
import prodState from "@/store/Prod";
import postState from "@/store/Post";
import postListState from "@/store/Post/postList";
import userState from "@/store/User";
import { useToast } from "vue-toastification";
import cartState from "@/store/Cart";
export interface Meta {
  authRequired?: boolean;
  noLayout?: boolean;
}

export interface pageObj {
  icon?: string | null;
  name: string;
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: unknown;
  redirect?: string;
  meta?: Meta;
}
export type pageObjList = Array<pageObj>;
export const pageList: pageObjList = [
  { name: "Home", url: "/", component: Home },
  { name: "제품 목록", url: "/prodList", component: Prodlist },
  { name: "게시글 목록", url: "/posts", component: PostList },
  { name: "oss license", url: "/lisense", component: Lisense },
];
export const AdminList: pageObjList = [
  {
    name: "물품 관리",
    url: "/admin",
    component: Admin,
    meta: { authRequired: true },
  },
];
function PageConvert(pagelist: pageObjList): Array<RouteRecordRaw> {
  return pagelist.map((item) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj: any = {};
    obj.path = item.url;
    obj.name = item.name;
    if (item.component !== undefined) obj.component = item.component;
    obj.meta = {
      authRequired: item.meta?.authRequired ?? false,
      noLayout: item.meta?.noLayout ?? false,
    };
    if (item.redirect !== undefined) obj.redirect = item.redirect;
    return obj as RouteRecordRaw;
  });
}

const routes: Array<RouteRecordRaw> = PageConvert(pageList).concat(
  PageConvert(authUrl)
    .concat(PageConvert(hidden.pageList))
    .concat(PageConvert(AdminList))
);

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(
  async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    next: any
  ) => {
    if (to.meta !== undefined && to.meta !== null)
      if (to.meta.authRequired && userState.bSigned === false) {
        useToast().info(
          "로그인이 되어있지 않습니다\n로그인후 이용 부탁드립니다."
        );
        return;
      }
    if (to.name === null || to.name === undefined) {
      globalState.setPageName("");
    } else {
      switch (to.name.toString()) {
        case "Home":
          globalState.setPageName("Home");
          postListState.update();
          break;
        case "제품":
          await curItemState.changeCurItem(to.params.id.toString());
          globalState.setPageName(curItemState.name);
          break;
        case "게시글":
          await postState.setId(to.params.id.toString());
          globalState.setPageName(
            postState.title === "" ? "게시글" : postState.title
          );
          break;
        case "제품 목록":
          prodState.refresh();
          break;
        case "상품 수정":
          await curItemState.changeCurItem(to.params.id.toString());
          globalState.setPageName(curItemState.name);
          break;
        case "게시글 목록":
          globalState.setPageName("게시글 목록");
          postListState.update();
        case "장바구니":
          globalState.setPageName("장바구니");
          if (userState.bSigned) {
            cartState.update();
          }
          break;
        default:
          globalState.setPageName(to.name.toString());
      }
    }
    next();
  }
);

export default router;
