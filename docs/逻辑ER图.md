# 逻辑 ER 图（业务实体）

> 本图从物理表抽象为业务实体（Entity），不关注字段细节与外键约束，聚焦于**业务概念之间的关系**。
> 一个业务实体通常对应多张物理表（如"组件订单"实体包含主表 + 行项目表 + 附件表 + 审计表）。
> 颜色：每个业务实体颜色按业务域区分：组件订单（蓝）/ 销售订单（绿）/ 发货通知（橙）/ 主数据（紫）/ 系统支撑（灰）。

## 图例

| 业务域 | 颜色 | 涉及服务 |
|---|---|---|
| 组件订单 | 蓝 | oms-deliv-order |
| 销售订单 | 绿 | oms-sale-order |
| 发货通知 | 橙 | oms-ship-notice |
| 主数据 | 紫 | oms-master-data |
| 系统支撑 | 灰 | 全部服务 |

## 逻辑 ER 图

```mermaid
erDiagram
    客户 {
        客户编码 PK
        客户名称
        客户SF标识
        税类
        付款条件 FK
        计费国家
        收货国家
        是否有效
    }

    供应商 {
        供应商编码 PK
        供应商名称
        付款条件 FK
        是否有效
    }

    物料 {
        物料编码 PK
        物料名称
        物料类型
        产品系列
        规格型号
        单位
    }

    仓库 {
        仓库编码 PK
        仓库名称
        国家
        区域
    }

    付款条件 {
        付款条件编码 PK
        付款条件名称
        账期天数
    }

    组件订单 {
        订单号 PK
        客户 FK
        父订单 FK
        贸易方式
        状态
        合同版本
        币种
        业务实体
        销售区域
        BPM审批状态
    }

    组件订单行 {
        行ID PK
        组件订单 FK
        物料 FK
        数量
        单价
        含税单价
        预计交货日期
    }

    发货申请 {
        DR号 PK
        组件订单 FK
        客户 FK
        仓库 FK
        状态
        申请日期
    }

    销售订单 {
        SO号 PK
        客户 FK
        父SO号
        订单日期
        总额
        币种
        状态
        BPM审批状态
    }

    销售订单行 {
        行ID PK
        销售订单 FK
        物料 FK
        数量
        单价
    }

    采购订单 {
        PO号 PK
        关联SO号
        供应商 FK
        订单日期
        总额
        状态
    }

    发货通知单 {
        通知单号 PK
        销售订单 FK
        组件订单 FK
        客户 FK
        仓库 FK
        状态
        下发WMS状态
        下发TMS状态
        发邮件状态
    }

    发货通知行 {
        行ID PK
        发货通知单 FK
        物料 FK
        数量
        已发数量
        柜号
    }

    自提单 {
        自提单号 PK
        销售订单 FK
        客户 FK
        仓库 FK
        自提日期
        状态
    }

    库存预留申请 {
        申请号 PK
        仓库 FK
        物料 FK
        客户 FK
        申请类型
        变更数量
        状态
    }

    订单优先级规则 {
        规则ID PK
        规则名称
        优先级因子
        适用业务域
        是否启用
    }

    邮件配置 {
        配置ID PK
        员工编码
        业务类型
        收件人
        抄送
    }

    客户 ||--o{ 组件订单 : 下达
    客户 ||--o{ 销售订单 : 下达
    客户 ||--o{ 发货通知单 : 收件方
    客户 ||--o{ 自提单 : 提货方
    供应商 ||--o{ 采购订单 : 供货
    物料 ||--o{ 组件订单行 : "组成"
    物料 ||--o{ 销售订单行 : "组成"
    物料 ||--o{ 发货通知行 : "组成"
    仓库 ||--o{ 发货申请 : "发出"
    仓库 ||--o{ 发货通知单 : "发出"
    仓库 ||--o{ 自提单 : "自提"
    付款条件 ||--o{ 客户 : "约定"
    付款条件 ||--o{ 供应商 : "约定"
    组件订单 ||--o{ 组件订单行 : "包含"
    组件订单 ||--o{ 发货申请 : "拆分"
    组件订单 ||--o{ 发货通知单 : "驱动"
    销售订单 ||--o{ 销售订单行 : "包含"
    销售订单 ||--o{ 采购订单 : "触发"
    销售订单 ||--o{ 发货通知单 : "驱动"
    销售订单 ||--o{ 自提单 : "拆分"
    发货通知单 ||--o{ 发货通知行 : "包含"
```

## 业务实体—物理表对照

| 业务实体 | 物理表（所属服务） |
|---|---|
| **客户** | `customer`, `customer_address`（oms-master-data） |
| **供应商** | `vendor`（oms-master-data） |
| **物料** | `material`, `material_category`（oms-master-data） |
| **仓库** | `warehouse`（oms-master-data） |
| **付款条件** | `payment_terms`（oms-master-data） |
| **组件订单** | `delivery_order`, `delivery_order_line`, `delivery_order_attachment`, `delivery_order_audit`（oms-deliv-order） |
| **发货申请** | `fulfillment_order`, `fulfillment_order_line`（oms-deliv-order） |
| **销售订单** | `sales_order`, `sales_order_line`, `sales_order_attachment`（oms-sale-order） |
| **采购订单** | `purchase_order`, `purchase_order_line`（oms-sale-order） |
| **发货通知单** | `shipment_notice`, `shipment_notice_line`, `shipment_notice_cabinet`（oms-ship-notice） |
| **自提单** | `pickup_order`, `pickup_order_line`（oms-ship-notice） |
| **库存预留申请** | `inventory_reserved_change_apply`, `inventory_reserved_change_apply_line`（oms-ship-notice） |
| **订单优先级规则** | `order_priority`, `order_priority_factor`（oms-deliv-order） |
| **邮件配置** | `employee_mail_cfg`（oms-master-data） |

## 核心业务关系

| 关系 | 业务含义 | 关键操作 |
|---|---|---|
| 客户 → 组件订单 | 客户下达订单 | `DeliveryOrderController.save()` |
| 组件订单 → 发货申请 | 组件订单拆分为发货申请 | `FulfillmentOrderController.createFromDO()` |
| 组件订单 → 发货通知单 | 组件订单驱动发货通知 | `ShipmentNoticeController.createFromDO()` |
| 销售订单 → 发货通知单 | 销售订单驱动发货通知 | `ShipmentNoticeController.createFromSO()` |
| 销售订单 → 采购订单 | 销售订单触发关联采购 | `OrderRelatedTransactionsController.generateInternalPurchaseOrder()` |
| 发货通知单 → WMS | 发货通知下发到 WMS | `ShipmentNoticeController.issueWms()` |
| 发货通知单 → TMS | 发货通知下发到 TMS | `ShipmentNoticeController.issueTms()` |