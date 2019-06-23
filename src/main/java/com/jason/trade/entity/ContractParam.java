package com.jason.trade.entity;

import lombok.Data;

/**
 * 查询Bean
 */
@Data
public class ContractParam {
    private String storeStartDate;
    private String storeEndDate;
    private String ownerCompany;
    private String externalContract;
    private String insideContract;
    private String businessMode;
    private String caiyangdateStart;
    private String caiyangdateEnd;
    private String caiyangcangku;
    private String contractStartDate;
    private String contractEndDate;
    private String etaStartDate;
    private String etaEndDate;
    private String prePaymentStartDate;
    private String payType;
    private String prePaymentEndDate;
    private Double prePaymentMin;
    private Double prePaymentMax;
    private String finalPaymentStartDate;
    private String finalPaymentEndDate;
    private String financingDaoqiStart;
    private String financingDaoqiEnd;
    private String yahuidaoqiDateStart;
    private String yahuidaoqiDateEnd;
    private String remittanceDateStart;
    private String issuingBank;
    private String issuingDateStart;
    private String issuingDateEnd;
    private String remittanceDateEnd;
    private Double yahuiMoneyMin;
    private Double yahuiMoneyMax;
    private Double finalPaymentMin;
    private Double finalPaymentMax;
    private Double financingMoneyMin;
    private Double financingMoneyMax;
    private String prePayBank;
    private String finalPayBank;
    private String etdStartDate;
    private String etdEndDate;
    private String externalCompany;
    private String cargoName;
    private String cargoNo;
    private String cargoType;
    private String cargoStatus;
    private String tariffNo;
    private String level;
    private String agent;
    private String containerNo;
    private String companyNo;
    private String ladingbillNo;
    private String destinationPort;
    private String status;
    private String fieldName;
    private String today;
    private String originCountry;
    private Integer start;
    private Integer limit;
    private String sortName;
    private String sortOrder;
    private String type;
    private String taxPayDateStart;
    private String taxPayDateEnd;
    private String startDate;
    private String endDate;
    private String isFinancing;
    private String isYahui;
    private String warehouse;
    private Double minBox;
    private Double maxBox;
    private Double minWeight;
    private Double maxWeight;
    private String storageCondition;
    private String currency;
}
