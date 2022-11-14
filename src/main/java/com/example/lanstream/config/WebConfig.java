package com.example.lanstream.config;

import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Component
public class WebConfig implements WebMvcConfigurer {
    /*
     * 添加静态资源文件，外部可以直接访问地址
     *
     * @param registry
     */
    String systemName = System.getProperty("os.name");
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String path = System.getProperty("java.io.tmpdir") + "webFile/";
        if(!ObjectUtils.isEmpty(systemName) && systemName.toLowerCase().contains("linux")){
            // Linux临时路径
            path = System.getProperty("java.io.tmpdir") + "webFile/";
        }
        registry.addResourceHandler("/webFile/**").addResourceLocations("file:" + path);
    }

}
