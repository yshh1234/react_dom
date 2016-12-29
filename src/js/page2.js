import React from 'react'
import {Link} from 'react-router'


export default React.createClass({
	getInitialState:function(){
		var code = this.props.query.name
		console.log(code)
		var detail = {
					      "etpId": "up123456",
					      "etpNm": "中国银联股份有限公司1",
					      "taxNo": "310115736239890",
					      "isDefault": "1",
					      "bank": "招商银行上海分行营业部",
					      "account": "216083851810001",
					      "address": "上海市浦东新区含笑路36号",
					      "telephone": "68401888",
					      "certified": "0",
					      "isEffective": "1",
					      "qrCode": "up123456|1中国银联股份有限公司→2310115736239890→3上海市浦东新区含笑路36号 68401888→4招商银行上海分行营业部 216083851810001→AUNIONPAY_"
    					}
    	return {detail:detail}
	},
  	render:function() {
    	return (
    	<div>
		<div className="invoice-detail">
		    <div className="invoice-detail-row clearfix">
		        <span className="invoice-detail-label">抬头名称</span>
		        <span className="invoice-detail-value">{this.state.detail.etpNm}</span>
		    </div>
		    <div className="invoice-detail-row clearfix">
		        <span className="invoice-detail-label">税号</span>
		        <span className="invoice-detail-value">{this.state.detail.taxNo }</span>
		    </div>
		    <div className="invoice-detail-row clearfix">
		        <span className="invoice-detail-label">单位地址</span>
		        <span className="invoice-detail-value">{this.state.detail.address }</span>
		    </div>
		    <div className="invoice-detail-row clearfix">
		        <span className="invoice-detail-label">电话号码</span>
		        <span className="invoice-detail-value">{this.state.detail.telephone }</span>
		    </div>
		    <div className="invoice-detail-row clearfix">
		        <span className="invoice-detail-label">开户银行</span>
		        <span className="invoice-detail-value">{this.state.detail.bank }</span>
		    </div>
		    <div className="invoice-detail-row clearfix">
		        <span className="invoice-detail-label">银行账号</span>
		        <span className="invoice-detail-value">{this.state.detail.account }</span>
		    </div>
		    <div className={!this.state.detail.isDefault?'invoice-detail-row clearfix hide':'invoice-detail-row clearfix'}>
		        <span className="invoice-detail-label">备注</span>
		        <span className="invoice-detail-value">默认抬头</span>
		    </div>
		    <div className="invoice-detail-row invoice-border clearfix">
		        <span className="invoice-detail-label">开票代码</span>
		        <span className="invoice-detail-value">{this.state.detail.invoiceCode }</span>
		    </div>
		</div>
		<div className="invoice-qrcode-area">
		    <div className="invoice-qrcode" id="invoiceQRCode">
		    </div>
		    <p className="invoice-qrcode-tips tipsset">商家扫描二维码，可快速获取抬头信息</p>
		    <p className="invoice-qrcode-tips">用户扫描二维码，面对面分享抬头信息</p>
		</div>
		</div>
		)
  }
})
