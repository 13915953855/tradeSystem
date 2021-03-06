package com.jason.trade.util;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.jason.trade.model.UserInfo;
import org.hibernate.service.spi.ServiceException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

@Configuration
public class WebSecurityConfig extends WebMvcConfigurerAdapter {
    /**
     * 登录session key
     */
    public final static String SESSION_KEY = "user";

    @Bean
    public SecurityInterceptor getSecurityInterceptor() {
        return new SecurityInterceptor();
    }

    public void addInterceptors(InterceptorRegistry registry) {
        InterceptorRegistration addInterceptor = registry.addInterceptor(getSecurityInterceptor());

        // 排除配置
        addInterceptor.excludePathPatterns("/error");
        addInterceptor.excludePathPatterns("/register");
        addInterceptor.excludePathPatterns("/modifyPwd");
        addInterceptor.excludePathPatterns("/login**");

        // 拦截配置
        addInterceptor.addPathPatterns("/**");
    }

    private class SecurityInterceptor extends HandlerInterceptorAdapter {

        @Override
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
                throws Exception {
            HttpSession session = request.getSession();
            if (session.getAttribute(SESSION_KEY) != null){
                UserInfo user = (UserInfo) session.getAttribute(SESSION_KEY);
                String name = user.getAccount();
                String uri = request.getRequestURI();
                String postType = request.getMethod();
                if(
                        name.equals("visitor") && postType.equals("POST") &&
                        (uri.endsWith("update") || uri.endsWith("delete") || uri.endsWith("add") || uri.endsWith("upload") || uri.endsWith("copy"))
                ) {
                    response.setHeader("sessionstatus", "limit");//在响应头设置session状态
                    return false;
                }
                if(uri.endsWith("hesuan") || uri.endsWith("query/duty") || uri.endsWith("query/fuhui")
                                || uri.endsWith("query/fuhuiRZ")|| uri.endsWith("query/fuhuiKZ")|| uri.endsWith("query/baoguan")){
                    if(user.getLevelName() == null || !user.getLevelName().equals("admin")){
                        // 跳转登录
                        String url = "/index";
                        response.sendRedirect(url);
                        return false;
                    }
                }
                return true;
            }

            if (request.getHeader("x-requested-with") != null
                    && request.getHeader("x-requested-with").equalsIgnoreCase("XMLHttpRequest")) {
                //如果是ajax请求响应头会有，x-requested-with
                response.setHeader("sessionstatus", "timeout");//在响应头设置session状态
                return false;
            }
            // 跳转登录
            String url = "/login";
            response.sendRedirect(url);
            return false;
        }

        /**
         * 获取Ip地址
         * @param request
         * @return
         */
        public  String getIpAddr(HttpServletRequest request){
            String ip = request.getHeader("X-Forwarded-For");
            if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getHeader("Proxy-Client-IP");
            }
            if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getHeader("WL-Proxy-Client-IP");
            }
            if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getHeader("HTTP_CLIENT_IP");
            }
            if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getHeader("HTTP_X_FORWARDED_FOR");
            }
            if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getRemoteAddr();
            }
            return ip;
        }
    }
}
