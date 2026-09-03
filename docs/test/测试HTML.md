```html
<div class="api-mindmap">
<style>
.api-mindmap{font-family:-apple-system,"Segoe UI",sans-serif;font-size:13px;color:#1f2937}
.api-mindmap .mm-tabs{display:flex;gap:8px;border-bottom:1px solid #e5e7eb;margin-bottom:10px}
.api-mindmap .mm-tab{padding:6px 14px;border-radius:8px 8px 0 0;background:#f1f5f9;color:#475569;font-weight:600}
.api-mindmap .mm-tab.active{background:#1e293b;color:#fff}
.api-mindmap .mm-toolbar{display:flex;align-items:center;gap:8px;margin:8px 0 12px;flex-wrap:wrap}
.api-mindmap .mm-btn{padding:4px 10px;border:1px solid #cbd5e1;background:#fff;border-radius:6px;cursor:pointer;font-size:12px;color:#334155}
.api-mindmap .mm-btn:hover{background:#f8fafc}
.api-mindmap .mm-hint{margin-left:auto;color:#94a3b8;font-size:12px}
.api-mindmap .mindtree details{display:flex;flex-direction:row;align-items:flex-start;margin:6px 0}
.api-mindmap .mindtree details>summary{list-style:none;cursor:pointer;flex:0 0 auto;min-width:150px;max-width:260px;padding:8px 12px;border-radius:10px;border:1px solid #e2e8f0;box-shadow:0 1px 2px rgba(0,0,0,.05);position:relative}
.api-mindmap .mindtree details>summary::-webkit-details-marker{display:none}
.api-mindmap .mindtree summary .ind{margin-right:6px;font-size:11px;color:#64748b}
.api-mindmap .mindtree .kids{display:flex;flex-direction:column;margin-left:20px;padding-left:14px;border-left:1px dashed #cbd5e1}
.api-mindmap .mindtree ul.leaves{margin:6px 0 0;padding-left:18px}
.api-mindmap .mindtree ul.leaves li{margin:4px 0;padding:5px 10px;border-radius:8px;background:#f8fafc;border:1px solid #e2e8f0;max-width:300px}
.api-mindmap .mindtree .code{font-family:ui-monospace,Consolas,monospace;font-size:12px}
.api-mindmap .mindtree .desc{display:block;color:#64748b;font-size:11px;margin-top:2px}
.api-mindmap .d0>summary{background:#1e293b;color:#fff;border-color:#1e293b}
.api-mindmap .d1>summary{background:#dbeafe;color:#1e3a8a;border-color:#bfdbfe}
.api-mindmap .d2>summary{background:#fef9c3;color:#854d0e;border-color:#fde68a}
.api-mindmap .d3>summary{background:#dcfce7;color:#166534;border-color:#bbf7d0}
.api-mindmap .d4>summary{background:#fce7f3;color:#9d174d;border-color:#f9d3e0}
.api-mindmap .cond>summary{background:#fff7ed;color:#9a3412;border-color:#fed7aa;border-style:dashed}
</style>

<div class="mm-tabs"><span class="mm-tab active">横向下钻树</span><span class="mm-tab">Mermaid 平铺图</span></div>
<div class="mm-toolbar">
  <button class="mm-btn" onclick="mmExpandAll(this)">全部展开</button>
  <button class="mm-btn" onclick="mmCollapseAll(this)">全部折叠</button>
  <button class="mm-btn" onclick="mmExpandTo(this,2)">展开到第2层</button>
  <button class="mm-btn" onclick="mmExpandTo(this,3)">展开到第3层</button>
  <span class="mm-hint">点击 ▾ 折叠/展开，从左到右横向下钻…</span>
</div>

<div class="mindtree" id="mindtree-salesorderssave-001">
<details class="d0" open>
  <summary><span class="ind">▾</span><b>SalesOrderController.save</b><span class="desc">HTTP 入口，批量保存销售订单</span></summary>
  <div class="kids">

    <details class="d1" open>
      <summary><span class="ind">▾</span><span class="code">入口层</span><span class="desc">路由/请求/转换</span></summary>
      <div class="kids">
        <ul class="leaves">
          <li><span class="code">POST /sales-orders/save</span><span class="desc">HTTP 路由</span></li>
          <li><span class="code">SalesOrderBatchSaveRequest</span><span class="desc">批量请求 DTO，含 saveRequests 列表</span></li>
          <li><span class="code">SalesOrderSaveDTOConverter.convert</span><span class="desc">请求转 SaveDTO，componentOrderName→opportunityNo</span></li>
          <li><span class="code">SalesOrderBatchSaveResponseConverter.convert</span><span class="desc">结果转批量响应 DTO</span></li>
        </ul>
      </div>
    </details>

    <details class="d1" open>
      <summary><span class="ind">▾</span><span class="code">SalesOrderApplicationService.batchSave</span><span class="desc">事务外编排，并行保存多条 SO</span></summary>
      <div class="kids">

        <details class="d2" open>
          <summary><span class="ind">▾</span><span class="code">SecurityContextHolder.getCurrentEmployeeNumber</span><span class="desc">获取当前操作人工号</span></summary>
          <div class="kids">
            <ul class="leaves">
              <li><span class="code">saveDto.setStatus(INPUTTED)</span><span class="desc">置为已录入状态</span></li>
              <li><span class="code">setOperatorId / setSerialNo / setCreatedAt</span><span class="desc">填充操作人、序号、时间</span></li>
            </ul>
          </div>
        </details>

        <details class="d2" open>
          <summary><span class="ind">▾</span><span class="code">CompletableFuture.runAsync</span><span class="desc">线程池并行处理每条 SO</span></summary>
          <div class="kids">
            <details class="d3" open>
              <summary><span class="ind">▾</span><span class="code">saveSo</span><span class="desc">单条 SO 保存+推 ERP 编排</span></summary>
              <div class="kids">

                <details class="d4" open>
                  <summary><span class="ind">▾</span><span class="code">save（@Transactional）</span><span class="desc">事务内落库</span></summary>
                  <div class="kids">
                    <ul class="leaves">
                      <li><span class="code">buildOrderOtherInfo</span><span class="desc">查履约/组件订单、税率构建主单号</span></li>
                      <li><span class="code">SalesOrder.create</span><span class="desc">领域聚合组装订单头</span></li>
                      <li><span class="code">SEQUENCE.nextNo（Snowflake）</span><span class="desc">新增时生成主键</span></li>
                      <li><span class="code">salesOrderRepository.save</span><span class="desc">订单头入库</span></li>
                      <li><span class="code">SalesOrder.createSpecialStorageRoute</span><span class="desc">构建特殊仓储路线</span></li>
                      <li><span class="code">storageRouteRepository.save</span><span class="desc">特殊仓储路线入库</span></li>
                      <li><span class="code">SalesOrder.createLine</span><span class="desc">构建订单行（新增/更新/软删）</span></li>
                      <li><span class="code">salesOrderLineRepository.batchSave</span><span class="desc">订单行批量入库</span></li>
                      <li><span class="code">salesOrderLineRepository.batchDelByIds</span><span class="desc">软删已移除的订单行</span></li>
                    </ul>
                  </div>
                </details>

                <details class="d4 cond" open>
                  <summary><span class="ind">▾</span>🔧 条件：<span class="code">erpPaymentType</span> 是否为空</summary>
                  <div class="kids">
                    <details class="d3" open>
                      <summary><span class="ind">▾</span>为空 → 标记 ERROR 分支</summary>
                      <div class="kids">
                        <ul class="leaves">
                          <li><span class="code">salesOrder.updateStatus(ERROR)</span><span class="desc">置错误状态</span></li>
                          <li><span class="code">salesOrderRepository.updateStatus</span><span class="desc">回写错误状态</span></li>
                        </ul>
                      </div>
                    </details>
                    <details class="d3" open>
                      <summary><span class="ind">▾</span>非空 → 推 ERP 分支</summary>
                      <div class="kids">
                        <ul class="leaves">
                          <li><span class="code">erpSalesOrderRepository.saveToErp</span><span class="desc">转换 DTO 并推 ERP 保存</span></li>
                          <li><span class="code">ErpServiceClient.saveSalesOrder</span><span class="desc">调用 ErpFeignClient.saveSalesOrder</span></li>
                          <li><span class="code">salesOrderRepository.updateOrderNo</span><span class="desc">回写 ERP 单号</span></li>
                        </ul>
                      </div>
                    </details>
                  </div>
                </details>

                <details class="d4" open>
                  <summary><span class="ind">▾</span><span class="code">ERP 后续动作</span><span class="desc">推 ERP 成功后的附加处理</span></summary>
                  <div class="kids">
                    <ul class="leaves">
                      <li><span class="code">erpSalesOrderRepository.autoShipment（@Async）</span><span class="desc">ERP 自动发运处理</span></li>
                      <li><span class="code">erpSalesOrderRepository.saveSpecialStorageRouteToErp</span><span class="desc">特殊仓储路线推 ERP</span></li>
                      <li><span class="code">storageRouteRepository.updateTaxRoute</span><span class="desc">回写税务路线 ID</span></li>
                    </ul>
                  </div>
                </details>

              </div>
            </details>
          </div>
        </details>

        <details class="d2 cond" open>
          <summary><span class="ind">▾</span>🔧 条件：<span class="code">errors</span> 是否非空</summary>
          <div class="kids">
            <details class="d3" open>
              <summary><span class="ind">▾</span>有错误 → 抛批量异常</summary>
              <div class="kids">
                <ul class="leaves">
                  <li><span class="code">throw BusinessException 批量保存部分失败</span><span class="desc">汇总各条错误抛出</span></li>
                </ul>
              </div>
            </details>
            <details class="d3" open>
              <summary><span class="ind">▾</span>无错误 → 异步回查 ERP</summary>
              <div class="kids">
                <ul class="leaves">
                  <li><span class="code">erpSalesOrderRepository.querySalesOrdersFormErpAsync</span><span class="desc">@Async 异步回查 ERP 订单</span></li>
                </ul>
              </div>
            </details>
          </div>
        </details>

      </div>
    </details>

    <details class="d1" open>
      <summary><span class="ind">▾</span><span class="code">外部依赖</span><span class="desc">Feign 客户端调用</span></summary>
      <div class="kids">
        <ul class="leaves">
          <li><span class="code">MasterDataFeignClient</span><span class="desc">主数据：getSalesTaxRateById/ByName、queryAccountNameMap</span></li>
          <li><span class="code">DeliveryFeignClient</span><span class="desc">履约：fulfillmentListByIds、getFulfillmentOrdersById、getDeliveryOrderDetailById</span></li>
          <li><span class="code">ErpFeignClient.saveSalesOrder</span><span class="desc">ERP：保存/更新销售订单</span></li>
          <li><span class="code">ShipFeignClient</span><span class="desc">发货通知服务（关联场景使用）</span></li>
        </ul>
      </div>
    </details>

    <details class="d1" open>
      <summary><span class="ind">▾</span><span class="code">异步下发（@Async）</span><span class="desc">主流程完成后的异步任务</span></summary>
      <div class="kids">
        <ul class="leaves">
          <li><span class="code">querySalesOrdersFormErpAsync</span><span class="desc">@Async 异步回查 ERP 订单及关联单</span></li>
          <li><span class="code">syncSoAndRefOrderFormErpAsync</span><span class="desc">异步同步 SO 与关联订单回写</span></li>
          <li><span class="code">autoShipment</span><span class="desc">@Async ERP 自动发运处理</span></li>
        </ul>
      </div>
    </details>

  </div>
</details>
</div>

<script>
(function(){
  var root=document.getElementById('mindtree-salesorderssave-001');
  if(!root) return;
  function setInd(d){var s=d.querySelector(':scope>summary .ind');if(s){s.textContent=d.hasAttribute('open')?'▾':'▸';}}
  function refreshAll(){root.querySelectorAll('details').forEach(setInd);}
  function depthOf(d){var n=0,p=d;while(p&&p!==root){if(p.tagName==='DETAILS')n++;p=p.parentElement;}return n;}
  window.mmExpandAll=function(b){root.querySelectorAll('details').forEach(function(d){d.setAttribute('open','');});refreshAll();};
  window.mmCollapseAll=function(b){root.querySelectorAll('details').forEach(function(d){d.removeAttribute('open');});refreshAll();};
  window.mmExpandTo=function(b,n){root.querySelectorAll('details').forEach(function(d){if(depthOf(d)<=n){d.setAttribute('open','');}else{d.removeAttribute('open');}});refreshAll();};
  root.addEventListener('toggle',refreshAll,{capture:true});
  refreshAll();
})();
</script>
```