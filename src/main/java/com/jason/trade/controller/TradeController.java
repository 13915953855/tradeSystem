package com.jason.trade.controller;

import com.jason.trade.constant.GlobalConst;
import com.jason.trade.entity.*;
import com.jason.trade.mapper.AttachmentMapper;
import com.jason.trade.mapper.ContractBaseInfoMapper;
import com.jason.trade.mapper.InternalContractInfoMapper;
import com.jason.trade.model.*;
import com.jason.trade.repository.*;
import com.jason.trade.service.TradeService;
import com.jason.trade.util.DateUtil;
import com.jason.trade.util.RespUtil;
import com.jason.trade.util.SetStyleUtils;
import com.jason.trade.util.WebSecurityConfig;
import net.sf.json.JSONException;
import net.sf.json.JSONObject;
import org.apache.commons.lang.StringUtils;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping(value = "/trade")
public class TradeController {
    private static final Logger log = LoggerFactory.getLogger(TradeController.class.getName());
    @Autowired
    private ContractRepository contractRepository;
    @Autowired
    private CargoRepository cargoRepository;
    @Autowired
    private InternalContractRepository internalContractRepository;
    @Autowired
    private InternalCargoRepository internalCargoRepository;
    @Autowired
    private AttachmentRepository attachmentRepository;
    @Autowired
    private SaleRepository saleRepository;
    @Autowired
    private TradeService tradeService;
    @Autowired
    private SysLogRepository sysLogRepository;
    @Autowired
    private ContractBaseInfoMapper contractBaseInfoMapper;
    @Autowired
    private InternalContractInfoMapper internalContractInfoMapper;
    @Autowired
    private AttachmentMapper attachmentMapper;

    @RequestMapping(value = "/list")
    public String getTradeList(@RequestParam("limit") int limit, @RequestParam("offset") int offset, ContractParam contractParam) throws JSONException {
        contractParam.setStart(offset);
        contractParam.setLimit(limit);
        JSONObject result = tradeService.queryContractListByMapper(contractParam);
        return result.toString();
    }
    @RequestMapping(value = "/internal/list")
    public String getInternalTradeList(@RequestParam("limit") int limit, @RequestParam("offset") int offset, InternalContractParam contractParam) throws JSONException {
        contractParam.setStart(offset);
        contractParam.setLimit(limit);
        JSONObject result = tradeService.queryInternalContractListByMapper(contractParam);
        return result.toString();
    }
    @RequestMapping(value = "/cargo/list")
    public String getCargoList(@RequestParam("contractId") String contractId) throws JSONException {
        List<CargoInfo> list = cargoRepository.findByContractIdAndStatusNot(contractId,GlobalConst.DISABLE);
        JSONObject result = new JSONObject();
        result.put("total",list.size());
        result.put("rows",list);
        return result.toString();
    }
    @RequestMapping(value = "/internal/cargo/list")
    public String getInternalCargoList(@RequestParam("contractId") String contractId) throws JSONException {
        List<InternalCargoInfo> list = internalCargoRepository.findByContractIdAndStatusNot(contractId,GlobalConst.DISABLE);
        JSONObject result = new JSONObject();
        result.put("total",list.size());
        result.put("rows",list);
        return result.toString();
    }

    @RequestMapping(value = "/attachment/getAll")
    public String getAllFile(@RequestParam("contractId") String contractId) throws JSONException {
        List<Attachment> list = attachmentRepository.findByContractId(contractId);
        JSONObject result = new JSONObject();
        result.put("status","1");
        result.put("data",list);
        return result.toString();
    }

    @RequestMapping(value = "/attachment/delete")
    public String delete(@RequestParam("contractId") String contractId,@RequestParam("id") Integer id) throws JSONException {
        AttachmentKey key = new AttachmentKey();
        key.setId(id);
        key.setContractId(contractId);
        Attachment attachment = attachmentMapper.selectByPrimaryKey(key);
        String filePath = attachment.getFilePath();
        attachmentMapper.deleteByPrimaryKey(key);
        //删除文件
        File file = new File(filePath);
        if(file.exists()){
            file.delete();
        }
        JSONObject result = new JSONObject();
        result.put("status","1");
        return result.toString();
    }

    @RequestMapping(value = "/cargo/all")
    public String getCargoAllList(@RequestParam("limit") int limit, @RequestParam("offset") int offset,CargoParam cargoParam) throws JSONException {
        cargoParam.setStart(offset);
        cargoParam.setLimit(limit);
        JSONObject result = tradeService.queryAllCargoList(cargoParam);
        return result.toString();
    }

    @RequestMapping(value = "/contract/getTotalInfo")
    public String getTotalInfo(ContractParam contractParam) throws JSONException {
        JSONObject result = tradeService.getTotalInfo(contractParam);
        return result.toString();
    }

    @RequestMapping(value = "/cargo/getTotalStore")
    public String getTotalStore(CargoParam cargoParam) throws JSONException {
        JSONObject result = tradeService.getTotalStore(cargoParam);
        return result.toString();
    }

    @RequestMapping(value = "/sale/list")
    public String getSaleList(@RequestParam("cargoId") String cargoId) throws JSONException {
        List<SaleInfo> list = saleRepository.findByCargoIdAndStatus(cargoId,GlobalConst.ENABLE);
        JSONObject result = new JSONObject();
        result.put("total",list.size());
        result.put("rows",list);
        return result.toString();
    }

    @PostMapping(value="/contract/add")
    public String contractAdd(ContractBaseInfo contractBaseInfo,@RequestParam("cargoId") String cargoId, HttpSession session){
        UserInfo userInfo = (UserInfo) session.getAttribute(WebSecurityConfig.SESSION_KEY);
        String now = DateUtil.DateTimeToString(new Date());
        contractBaseInfo.setCreateUser(userInfo.getAccount());
        contractBaseInfo.setCreateDateTime(now);
        contractBaseInfo.setVersion(1);
        ContractBaseInfo record = tradeService.saveContract(contractBaseInfo,cargoId);

        SysLog sysLog = new SysLog();
        sysLog.setDetail("新增合同"+record.getContractId());
        sysLog.setOperation("新增");
        sysLog.setUser(userInfo.getAccount());
        sysLog.setCreateDate(DateUtil.DateTimeToString(new Date()));
        sysLogRepository.save(sysLog);

        return GlobalConst.SUCCESS;
    }

    @PostMapping(value="/cargo/add")
    public String cargoAdd(CargoInfo cargoInfo, HttpSession session){
        log.info("开始处理商品新增或修改的请求");
        cargoInfo.setStatus(GlobalConst.EDITING);
        if(StringUtils.isBlank(cargoInfo.getCargoId())) {
            cargoInfo.setCargoId(UUID.randomUUID().toString());
            log.info("新增商品cargoId="+cargoInfo.getCargoId());
        }else{
            log.info("编辑商品cargoId="+cargoInfo.getCargoId());
        }

        UserInfo userInfo = (UserInfo) session.getAttribute(WebSecurityConfig.SESSION_KEY);
        String now = DateUtil.DateTimeToString(new Date());
        cargoInfo.setCreateUser(userInfo.getAccount());
        cargoInfo.setCreateDateTime(now);
        cargoInfo.setExpectStoreBoxes(cargoInfo.getBoxes());
        cargoInfo.setRealStoreBoxes(cargoInfo.getBoxes());
        cargoInfo.setExpectStoreWeight(cargoInfo.getInvoiceAmount());
        cargoInfo.setRealStoreWeight(cargoInfo.getInvoiceAmount());
        log.info("保存商品开始");
        CargoInfo data = cargoRepository.save(cargoInfo);
        log.info("保存商品完毕");

        SysLog sysLog = new SysLog();
        sysLog.setDetail("新增商品"+data.getCargoId());
        sysLog.setOperation("新增");
        sysLog.setUser(userInfo.getAccount());
        sysLog.setCreateDate(DateUtil.DateTimeToString(new Date()));
        sysLogRepository.save(sysLog);

        return RespUtil.respSuccess(data);
    }

    @PostMapping(value="/sale/add")
    public String saleAdd(SaleInfo saleInfo, HttpSession session){
        saleInfo.setStatus(GlobalConst.ENABLE);
        UserInfo userInfo = (UserInfo) session.getAttribute(WebSecurityConfig.SESSION_KEY);
        if(saleInfo.getSaleId() == null) {//新增
            String now = DateUtil.DateTimeToString(new Date());
            saleInfo.setCreateUser(userInfo.getAccount());
            saleInfo.setCreateDateTime(now);
        }
        log.debug("开始保存销售记录====================");
        SaleInfo data = tradeService.saveSale(saleInfo);

        SysLog sysLog = new SysLog();
        sysLog.setDetail("新增销售记录"+data.getSaleId());
        sysLog.setOperation("新增");
        sysLog.setUser(userInfo.getAccount());
        sysLog.setCreateDate(DateUtil.DateTimeToString(new Date()));
        sysLogRepository.save(sysLog);
        return RespUtil.respSuccess(data);
    }

    @PostMapping(value="/internal/contract/add")
    public String internalcontractAdd(InternalContractInfo contractBaseInfo,@RequestParam("cargoId") String cargoId, HttpSession session){
        UserInfo userInfo = (UserInfo) session.getAttribute(WebSecurityConfig.SESSION_KEY);
        String now = DateUtil.DateTimeToString(new Date());
        contractBaseInfo.setCreateUser(userInfo.getAccount());
        contractBaseInfo.setCreateDateTime(now);
        contractBaseInfo.setVersion(1);
        InternalContractInfo record = tradeService.saveInternalContract(contractBaseInfo,cargoId);

        SysLog sysLog = new SysLog();
        sysLog.setDetail("新增合同"+record.getContractId());
        sysLog.setOperation("新增");
        sysLog.setUser(userInfo.getAccount());
        sysLog.setCreateDate(DateUtil.DateTimeToString(new Date()));
        sysLogRepository.save(sysLog);

        return GlobalConst.SUCCESS;
    }

    @PostMapping(value="/internal/cargo/add")
    public String internalcargoAdd(InternalCargoInfo cargoInfo, HttpSession session){
        log.info("开始处理商品新增或修改的请求");
        cargoInfo.setStatus(GlobalConst.EDITING);
        if(StringUtils.isBlank(cargoInfo.getCargoId())) {
            cargoInfo.setCargoId(UUID.randomUUID().toString());
            log.info("新增商品cargoId="+cargoInfo.getCargoId());
        }else{
            log.info("编辑商品cargoId="+cargoInfo.getCargoId());
        }

        UserInfo userInfo = (UserInfo) session.getAttribute(WebSecurityConfig.SESSION_KEY);
        String now = DateUtil.DateTimeToString(new Date());
        cargoInfo.setCreateUser(userInfo.getAccount());
        cargoInfo.setCreateDateTime(now);
        log.info("保存商品开始");
        InternalCargoInfo data = internalCargoRepository.save(cargoInfo);
        log.info("保存商品完毕");

        SysLog sysLog = new SysLog();
        sysLog.setDetail("新增商品"+data.getCargoId());
        sysLog.setOperation("新增");
        sysLog.setUser(userInfo.getAccount());
        sysLog.setCreateDate(DateUtil.DateTimeToString(new Date()));
        sysLogRepository.save(sysLog);

        return RespUtil.respSuccess(data);
    }

    @PostMapping(value="/contract/update")
    public String contractUpdate(ContractBaseInfo contractBaseInfo,@RequestParam("cargoId") String cargoId, HttpSession session){
        Integer currentVersion = contractRepository.findOne(contractBaseInfo.getId()).getVersion();
        UserInfo userInfo = (UserInfo) session.getAttribute(WebSecurityConfig.SESSION_KEY);
        if(currentVersion > contractBaseInfo.getVersion()){
            return GlobalConst.MODIFIED;
        }

        if(StringUtils.isNotBlank(contractBaseInfo.getEtd())){
            if(contractBaseInfo.getEtd().compareTo(DateUtil.DateToString(new Date())) <= 0){
                contractBaseInfo.setStatus(GlobalConst.SHIPPED);
            }
        }
        if(StringUtils.isNotBlank(contractBaseInfo.getEta())){
            if(contractBaseInfo.getEta().compareTo(DateUtil.DateToString(new Date())) <= 0){
                contractBaseInfo.setStatus(GlobalConst.ARRIVED);
            }
        }
        if(StringUtils.isNotBlank(contractBaseInfo.getStoreDate())){
            contractBaseInfo.setStatus(GlobalConst.STORED);
        }
        contractBaseInfo.setVersion(contractBaseInfo.getVersion()+1);
        //contractRepository.save(contractBaseInfo);

        if(StringUtils.isNotBlank(cargoId)) {
            String[] arr = cargoId.split(",");
            List<String> cargoIdList = Arrays.asList(arr);
            tradeService.updateCargoStatus(cargoIdList);
        }
        contractBaseInfoMapper.updateByPrimaryKeySelective(contractBaseInfo);

        SysLog sysLog = new SysLog();
        sysLog.setDetail("更新合同"+contractBaseInfo.getContractId());
        sysLog.setOperation("更新");
        sysLog.setUser(userInfo.getAccount());
        sysLog.setCreateDate(DateUtil.DateTimeToString(new Date()));
        sysLogRepository.save(sysLog);

        return GlobalConst.SUCCESS;
    }
    @PostMapping(value="/internal/contract/update")
    public String internalContractUpdate(InternalContractInfo contractBaseInfo,@RequestParam("cargoId") String cargoId, HttpSession session){
        Integer currentVersion = internalContractRepository.findOne(contractBaseInfo.getId()).getVersion();
        UserInfo userInfo = (UserInfo) session.getAttribute(WebSecurityConfig.SESSION_KEY);
        if(currentVersion > contractBaseInfo.getVersion()){
            return GlobalConst.MODIFIED;
        }

        contractBaseInfo.setVersion(contractBaseInfo.getVersion()+1);

        if(StringUtils.isNotBlank(cargoId)) {
            String[] arr = cargoId.split(",");
            List<String> cargoIdList = Arrays.asList(arr);
            tradeService.updateInternalCargoStatus(cargoIdList);
        }
        internalContractInfoMapper.updateByPrimaryKeySelective(contractBaseInfo);

        SysLog sysLog = new SysLog();
        sysLog.setDetail("更新合同"+contractBaseInfo.getContractId());
        sysLog.setOperation("更新");
        sysLog.setUser(userInfo.getAccount());
        sysLog.setCreateDate(DateUtil.DateTimeToString(new Date()));
        sysLogRepository.save(sysLog);

        return GlobalConst.SUCCESS;
    }
    @PostMapping(value="/contract/delete")
    public String contractDel(@RequestParam("ids") String ids, HttpSession session){
        UserInfo userInfo = (UserInfo) session.getAttribute(WebSecurityConfig.SESSION_KEY);
        tradeService.deleteContract(ids);

        SysLog sysLog = new SysLog();
        sysLog.setDetail("删除合同"+ids);
        sysLog.setOperation("删除");
        sysLog.setUser(userInfo.getAccount());
        sysLog.setCreateDate(DateUtil.DateTimeToString(new Date()));
        sysLogRepository.save(sysLog);
        return GlobalConst.SUCCESS;
    }

    @PostMapping(value="/cargo/delete")
    public String cargoDel(@RequestParam("ids") String ids, HttpSession session){
        UserInfo userInfo = (UserInfo) session.getAttribute(WebSecurityConfig.SESSION_KEY);

        tradeService.deleteCargo(ids);
        SysLog sysLog = new SysLog();
        sysLog.setDetail("删除商品"+ids);
        sysLog.setOperation("删除");
        sysLog.setUser(userInfo.getAccount());
        sysLog.setCreateDate(DateUtil.DateTimeToString(new Date()));
        sysLogRepository.save(sysLog);
        return GlobalConst.SUCCESS;
    }

    @PostMapping(value="/sale/delete")
    public String saleDel(@RequestParam("ids") String ids, HttpSession session){
        UserInfo userInfo = (UserInfo) session.getAttribute(WebSecurityConfig.SESSION_KEY);
        //销售记录删除，没有对商品的库存进行恢复操作。需要管理员手动维护。
        tradeService.deleteSaleInfo(ids);
        SysLog sysLog = new SysLog();
        sysLog.setDetail("删除销售记录"+ids);
        sysLog.setOperation("删除");
        sysLog.setUser(userInfo.getAccount());
        sysLog.setCreateDate(DateUtil.DateTimeToString(new Date()));
        sysLogRepository.save(sysLog);
        return GlobalConst.SUCCESS;
    }

    @RequestMapping(value = "/charts")
    public String getCharts(@RequestParam("type") String type) throws JSONException {
        JSONObject result = new JSONObject();
        if(type.equals("contractAdd")){
            List<ContractForCharts> data = contractBaseInfoMapper.getTotalNumPerDay();
            result.put("status","1");
            result.put("data",data);
        }

        return result.toString();
    }

    @PostMapping(value = "/upload")
    public String upload(@RequestParam("file")MultipartFile files,@RequestParam("contractId") String contractId,@RequestParam("fileRef") String fileRef, @RequestParam("size") Integer size) {
        JSONObject json=new JSONObject();
        String msg = "添加成功";
        log.info("-------------------开始调用上传文件upload接口-------------------");
        try{
            String name = files.getOriginalFilename();
            String type = name.substring(name.lastIndexOf(".") + 1);// 文件类型
            String path = GlobalConst.FILE_PATH + File.separator + contractId;
            //String path = "D:"+ File.separator + contractId;
            File file = new File(path);
            if(!file.exists()){
                file.mkdir();
            }
            String pathWithName = path + File.separator + name;
            File uploadFile = new File(pathWithName);
            files.transferTo(uploadFile);

            //保存记录到数据库
            Attachment attachment = new Attachment();
            attachment.setContractId(contractId);
            attachment.setFileName(name);
            attachment.setFilePath(pathWithName);
            attachment.setFileType(type);
            attachment.setFileRef(fileRef);
            attachment.setFileSize(size);
            attachment.setStatus(GlobalConst.ENABLE);
            attachment.setCreatetime(new Date());
            attachmentMapper.insertSelective(attachment);
        }catch(Exception e){
            msg="添加失败";
        }
        log.info("-------------------结束调用上传文件upload接口-------------------");
        json.put("msg", msg);
        return json.toString();
    }
}
