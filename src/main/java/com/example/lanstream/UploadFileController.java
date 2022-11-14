package com.example.lanstream;

import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;

/**
 * description:  <br>
 * date: 2022/11/10 16:23 <br>
 */
@RestController
@Slf4j
public class UploadFileController {
    @RequestMapping(value = "/file-upload", method = RequestMethod.POST)
    @ResponseBody
    public String uploadFile(@RequestParam("file") MultipartFile multipartFile) throws IOException {
        String path = System.getProperty("java.io.tmpdir") + "webFile/";
        File file = new File(path + multipartFile.getOriginalFilename());
        if (!file.getParentFile().exists()) {
            log.info("The default folder does not exist and will be created soon.{}", file.getParent());
            file.getParentFile().mkdir();
        }
        multipartFile.transferTo(file);
        return "/webFile/" + multipartFile.getOriginalFilename();
    }

    @PostConstruct
    public void initFileDir() {
        String path = System.getProperty("java.io.tmpdir") + "webFile/";
        log.info("--------------------{}", path);
        try {
            File directory = new File(path);
            if (directory.exists()) {
                log.info("Service Init.Delete the Default folder.");
                FileUtils.deleteDirectory(directory);
            }
        } catch (IOException e) {
            log.error("delete default folder.", e);
        }
    }

}
