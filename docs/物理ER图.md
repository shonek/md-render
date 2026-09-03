# 物理 ER 图（核心表）

> 数据源：TrinaSolar OMS 微服务项目（MySQL 8.0 / InnoDB / utf8mb4，Flyway 迁移脚本）。
> 本系统所有表均**未定义物理外键约束**（FOREIGN KEY），表间关系为**逻辑关联**（通过 `xxx_id` / `xxx_no` 字段维护），图中的 FK 标注含义为**逻辑外键字段**。
> Mermaid erDiagram 语法仅支持 PK/FK/UK 三种键标记；非空（NN）、自增（AI）等约束请见下方的「表结构说明」表。
> 本图仅展示跨域核心实体（约 15 张），完整表数 127（交货订单 44 / 主数据 41 / 销售订单 17 / 发运通知 25）。

## 图例

- **PK**：主键
- **FK**：逻辑外键（应用层维护）
- **UK**：唯一（UNIQUE）

## 物理 ER 图（核心表）

```mermaid
erDiagram
    delivery_order {
        id BIGINT PK
        order_no VARCHAR(50) UK
        parent_order_id BIGINT FK
        parent_order_no VARCHAR(50)
        order_name VARCHAR(256)
        customer_code VARCHAR(50) FK
        customer_name VARCHAR(200)
        trade_mode VARCHAR(30)
        status VARCHAR(30)
        contract_version VARCHAR(100)
        total_volums_mw DECIMAL
        total_amount DECIMAL
        currency_code VARCHAR(10)
        ou_code VARCHAR(30)
        sales_region VARCHAR(200)
        sales_channel VARCHAR(50)
        sales_rep_id VARCHAR(30)
        bpm_approval_status VARCHAR(50)
        bpm_process_instance_id VARCHAR(256)
        remark TEXT
        order_start_date DATETIME
        created_by VARCHAR(50)
        created_at DATETIME
        updated_by VARCHAR(50)
        updated_at DATETIME
        is_del BOOL
        version INT
    }

    delivery_order_line {
        id BIGINT PK
        delivery_order_id BIGINT FK
        order_no VARCHAR(50) FK
        product_id VARCHAR(30) FK
        product_name VARCHAR(50)
        product_version VARCHAR(50)
        product_specifications VARCHAR(30)
        price DECIMAL
        price_with_vat DECIMAL
        piece_quantity INT
        expected_delivery_date DATETIME
        mm_cable_length DECIMAL
        m_cable_length DECIMAL
        installation VARCHAR(100)
        created_at DATETIME
        is_del BOOLEAN
    }

    fulfillment_order {
        id BIGINT PK
        dr_no VARCHAR(50) UK
        delivery_order_id BIGINT FK
        delivery_order_no VARCHAR(50) FK
        customer_code VARCHAR(50) FK
        warehouse_code VARCHAR(30) FK
        status VARCHAR(30)
        request_date DATETIME
        created_by VARCHAR(50)
        created_at DATETIME
        updated_at DATETIME
        is_del BOOL
    }

    sales_order {
        id BIGINT PK
        so_no VARCHAR(50) UK
        parent_so_no VARCHAR(50)
        customer_code VARCHAR(50) FK
        customer_name VARCHAR(200)
        order_date DATETIME
        total_amount DECIMAL
        currency_code VARCHAR(10)
        status VARCHAR(30)
        bpm_approval_status VARCHAR(50)
        bpm_process_instance_id VARCHAR(256)
        contract_version VARCHAR(100)
        sales_rep_id VARCHAR(30)
        created_at DATETIME
        updated_at DATETIME
        is_del BOOL
        version INT
    }

    sales_order_line {
        id BIGINT PK
        sales_order_id BIGINT FK
        so_no VARCHAR(50) FK
        product_id VARCHAR(30) FK
        product_name VARCHAR(50)
        piece_quantity INT
        unit_price DECIMAL
        total_amount DECIMAL
        expected_delivery_date DATETIME
        is_del BOOLEAN
    }

    purchase_order {
        id BIGINT PK
        po_no VARCHAR(50) UK
        related_so_no VARCHAR(50)
        vendor_code VARCHAR(50) FK
        vendor_name VARCHAR(200)
        order_date DATETIME
        total_amount DECIMAL
        currency_code VARCHAR(10)
        status VARCHAR(30)
        created_at DATETIME
        is_del BOOLEAN
    }

    shipment_notice {
        id BIGINT PK
        notice_no VARCHAR(50) UK
        sales_order_no VARCHAR(50) FK
        delivery_order_no VARCHAR(50) FK
        customer_code VARCHAR(50) FK
        warehouse_code VARCHAR(30) FK
        status VARCHAR(30)
        issue_wms_status VARCHAR(30)
        issue_tms_status VARCHAR(30)
        send_mail_status VARCHAR(30)
        issue_date DATETIME
        carrier VARCHAR(100)
        tracking_no VARCHAR(100)
        created_by VARCHAR(50)
        created_at DATETIME
        updated_at DATETIME
        is_del BOOL
    }

    shipment_notice_line {
        id BIGINT PK
        shipment_notice_id BIGINT FK
        notice_no VARCHAR(50) FK
        product_id VARCHAR(30) FK
        piece_quantity INT
        shipped_quantity INT
        cabinet_no VARCHAR(50)
        created_at DATETIME
    }

    inventory_reserved_change_apply {
        id BIGINT PK
        apply_no VARCHAR(50) UK
        warehouse_code VARCHAR(30) FK
        product_id VARCHAR(30) FK
        customer_code VARCHAR(50) FK
        apply_type VARCHAR(30)
        quantity_change INT
        status VARCHAR(30)
        approved_by VARCHAR(50)
        approved_at DATETIME
        created_at DATETIME
        is_del BOOL
    }

    pickup_order {
        id BIGINT PK
        pickup_no VARCHAR(50) UK
        sales_order_no VARCHAR(50) FK
        customer_code VARCHAR(50) FK
        warehouse_code VARCHAR(30) FK
        pickup_date DATETIME
        status VARCHAR(30)
        created_at DATETIME
        is_del BOOL
    }

    customer {
        id BIGINT PK
        customer_code VARCHAR(50) UK
        customer_name VARCHAR(200)
        customer_sf_id VARCHAR(50)
        tax_type VARCHAR(50)
        payment_term_id VARCHAR(50) FK
        bill_to_country_code VARCHAR(30)
        ship_to_country_code VARCHAR(30)
        is_active BOOL
        created_at DATETIME
    }

    vendor {
        id BIGINT PK
        vendor_code VARCHAR(50) UK
        vendor_name VARCHAR(200)
        payment_term_id VARCHAR(50) FK
        is_active BOOL
        created_at DATETIME
    }

    material {
        id BIGINT PK
        product_id VARCHAR(30) UK
        product_name VARCHAR(50)
        product_category VARCHAR(30)
        product_version VARCHAR(50)
        product_specifications VARCHAR(30)
        unit VARCHAR(30)
        is_active BOOL
        created_at DATETIME
    }

    warehouse {
        id BIGINT PK
        warehouse_code VARCHAR(30) UK
        warehouse_name VARCHAR(100)
        country_code VARCHAR(30)
        region VARCHAR(100)
        is_active BOOL
        created_at DATETIME
    }

    payment_terms {
        id BIGINT PK
        payment_term_id VARCHAR(50) UK
        payment_term_name VARCHAR(100)
        days INT
        is_active BOOL
    }

    delivery_order ||--o{ delivery_order_line : "1:N"
    delivery_order ||--o{ fulfillment_order : "1:N"
    sales_order ||--o{ sales_order_line : "1:N"
    sales_order ||--o{ shipment_notice : "1:N"
    shipment_notice ||--o{ shipment_notice_line : "1:N"
    sales_order ||--o{ pickup_order : "1:N"
    customer ||--o{ delivery_order : "1:N"
    customer ||--o{ sales_order : "1:N"
    customer ||--o{ shipment_notice : "1:N"
    customer ||--o{ inventory_reserved_change_apply : "1:N"
    vendor ||--o{ purchase_order : "1:N"
    material ||--o{ delivery_order_line : "1:N"
    material ||--o{ sales_order_line : "1:N"
    material ||--o{ shipment_notice_line : "1:N"
    warehouse ||--o{ fulfillment_order : "1:N"
    warehouse ||--o{ shipment_notice : "1:N"
    warehouse ||--o{ pickup_order : "1:N"
    payment_terms ||--o{ customer : "1:N"
    payment_terms ||--o{ vendor : "1:N"
```

## 表结构说明

| 表名 | 所属服务 | 物理主键 | 逻辑外键示例 | 备注 |
|---|---|---|---|---|
| `delivery_order` | oms-deliv-order | `id` BIGINT | `parent_order_id`, `customer_code`, `sales_rep_id` | 组件订单主表 |
| `delivery_order_line` | oms-deliv-order | `id` BIGINT | `delivery_order_id`, `product_id` | 组件订单行项目 |
| `fulfillment_order` | oms-deliv-order | `id` BIGINT | `delivery_order_id`, `warehouse_code` | 发货申请 DR |
| `sales_order` | oms-sale-order | `id` BIGINT | `customer_code`, `parent_so_no` | 销售订单 SO 主表 |
| `sales_order_line` | oms-sale-order | `id` BIGINT | `sales_order_id`, `product_id` | 销售订单行 |
| `purchase_order` | oms-sale-order | `id` BIGINT | `vendor_code`, `related_so_no` | 采购订单 PO |
| `shipment_notice` | oms-ship-notice | `id` BIGINT | `sales_order_no`, `delivery_order_no` | 发货通知单 |
| `shipment_notice_line` | oms-ship-notice | `id` BIGINT | `shipment_notice_id`, `product_id` | 发货通知行 |
| `inventory_reserved_change_apply` | oms-ship-notice | `id` BIGINT | `product_id`, `warehouse_code` | 库存预留变更申请 |
| `pickup_order` | oms-ship-notice | `id` BIGINT | `sales_order_no`, `warehouse_code` | 自提单 |
| `customer` | oms-master-data | `id` BIGINT | `payment_term_id` | 客户主数据 |
| `vendor` | oms-master-data | `id` BIGINT | `payment_term_id` | 供应商主数据 |
| `material` | oms-master-data | `id` BIGINT | — | 物料主数据 |
| `warehouse` | oms-master-data | `id` BIGINT | — | 仓库主数据 |
| `payment_terms` | oms-master-data | `id` BIGINT | — | 付款条件 |

## 物理特性

- **存储引擎**：InnoDB
- **字符集**：`utf8mb4` / `utf8mb4_unicode_ci`
- **连接池**：HikariCP
- **迁移工具**：Flyway
- **逻辑删除**：所有业务表 `is_del BOOL` 字段（0 = 有效，1 = 已删除）
- **乐观锁**：核心单据表 `version INT` 字段
- **审计字段**：所有表 `created_by` / `created_at` / `updated_by` / `updated_at`