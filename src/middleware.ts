import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";


const isProtectedRoute = createRouteMatcher(["/settings(.*)", "/"]); //这些路由需要登录

// 核心保安！检查请求
// auth.protect()​​ 是保护方法，会检查用户是否登录
// 如果 ​​已登录​​ → 继续访问
// 如果 ​​未登录​​ → 自动跳转到 Clerk 默认登录页
// export default clerkMiddleware(); //放行所有路由, 不需要检查

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});



// 配置保安的工作范围
export const config = {
  matcher: [
    // 规则1：保护所有页面，除了以下情况...
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // 规则2：永远检查API路由
    "/(api|trpc)(.*)",
  ],
};


// 🌰 举个实际例子​​
// 假设你的网站有这些页面：

// /
// /about
// /profile
// /api/user
// 当访问 /about → 保安放行（因为是公开页面）
// 当访问 /setting → 保安检查："有登录吗？" → 没登录就踢到登录页
// 当访问 /api/user → 必须出示登录凭证，否则返回401错误