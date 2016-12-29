import React from 'react'
import { Link, hashHistory } from 'react-router'

export default React.createClass({
	getInitialState:function(){
		var stateTemp = {}
		if(!localStorage.getItem('tipsview')){
			stateTemp.localStorage = true
		}else{
			stateTemp.localStorage = false
		}
		stateTemp.flag = false;
		var listData = [
      {
        "invoiceCode":"up0001",
        "etpNm":"名字11111111",
        "taxNo":"000001",
        "isDefault":"1"
      },
      {
        "invoiceCode":"up0002",
        "etpNm":"名字1",
        "taxNo":"000001"
      },
      {
        "invoiceCode":"up0003",
        "etpNm":"名字1",
        "taxNo":"000001"
      },
      {
        "invoiceCode":"up0004",
        "etpNm":"名字1",
        "taxNo":"000001"
      },
      {
        "invoiceCode":"up0005",
        "etpNm":"名字1",
        "taxNo":"000001"
      },
      {
        "invoiceCode":"up0005",
        "etpNm":"名字1",
        "taxNo":"000001"
      },
      {
        "invoiceCode":"up0005",
        "etpNm":"名字1",
        "taxNo":"000001"
      },
      {
        "invoiceCode":"up0005",
        "etpNm":"名字1",
        "taxNo":"000001"
      },
      {
        "invoiceCode":"up0005",
        "etpNm":"名字1",
        "taxNo":"000001"
      }
    ]
        stateTemp.inoviceList = listData
        return stateTemp
	},
	render:function(){
		var listData = this.state.inoviceList
		var returnArray = new Array()
		for(var i = 0;i<listData.length;i++){
			returnArray.push(
					<li className="invoice-item swipeout" key={i}>
						<div className="swipeout-content" data-code={listData[i].invoiceCode} onClick={this.jumpToDetail}>
						<div className="invoice-item-name"><span>{listData[i].etpNm}</span>
						    <span className={listData[i].isDefault?'invoice-default':'invoice-default hide'}>[默认]</span>
						</div>
						    <div className="invoice-item-code">税号-{listData[i].taxNo}</div>
						</div>
						<div className="swipeout-actions-right">
							<a className="invoice-item-edit"><img src="../img/edit.png"/></a>
							<a className="invoice-item-delete"><img src="../img/delete.png"/></a>
						</div>
					</li>)
		}
		return(
			<div>
			<div className="scanBtnBox">
			    <ul>
			        <li id="ScanUpBtn">
			            <div className="scanCircle"></div>
			            扫码开票
			        </li>
			        <li id="ScanUpTicketBtn">
			            <Link to="/page1"><div className="scanCircle2" ></div></Link>
			            电子发票
			        </li>
			        <div className="clearboth"></div>
			    </ul>
			</div>
			<div className={this.state.localStorage?'tipsf on':'tipsf'}>
				<span className="tipsword">扫描发票抬头二维码，可面对面分享抬头信息哦</span>
				<span className="closeTips" onClick={this.hidestorge}></span>
			</div>
			<div className={this.state.inoviceList ? 'invoiceTab':'invoiceTab hide'}>
			    <div className="invoiceHead">
			        <div className="invoice-item-name-c">
			            <span className="invoice-item-name-default">发票抬头列表</span>
			            <span className="showEditBtn" id="invoiceListEdit" onClick={this.showEdit}>{!this.state.flag?'编辑':'取消'}</span>
			        </div>
			    </div>
			</div>
			<div className="invoice-container list-block">
			
    		<ul className={this.state.inoviceList ? 'invoice-list':'invoice-list hide'}>
				{returnArray}
    		</ul>

		    <div className={!this.state.inoviceList ?'invoice-empty-container':'invoice-empty-container hide'}>
		        <img className="invoice-blank-image" src="../img/blank.jpg"/>
		        <p className="invoice-blank-tip1">极速开增值税发票</p>
		        <p className="invoice-blank-tip2">一次录入，永久使用，再不需要携带开票资料了！</p>
		        <button className="up-button" id="buttonAddInvoice">新增发票抬头</button>
		    </div>


			<div className="chooseForCreate">
			    <div className="altCreate">
			        <div className="handerRecordBtn">手动录入抬头</div>
			        <div className="scanRecordBtn">扫码录入抬头</div>
			    </div>
			    <div className="cancelCreateBtn">
			        取消
			    </div>
			</div>
			<div className="mask"></div>
			</div>
			</div>
	)},
	hidestorge:function(event){
		    localStorage.setItem('tipsview', '1');
		    this.setState({localStorage:false})
	},
	showEdit:function(event){
                if (this.state.flag) {
                    $('.swipeout-content').css({
                        'transform': 'translate3d(0rem, 0px, 0px)',
                        '-webkit-transform': 'translate3d(0rem, 0px, 0px)'
                    })
                    $('.swipeout-actions-right').css({
                        'transform': 'translate3d(2.68rem, 0px, 0px)',
                        '-webkit-transform': 'translate3d(2.68rem, 0px, 0px)'
                    })
                } else {
                    $('.swipeout-content').css({
                        'transform': 'translate3d(-2.68rem, 0px, 0px)',
                        '-webkit-transform': 'translate3d(-2.68rem, 0px, 0px)'
                    })
                    $('.swipeout-actions-right').css({
                        'transform': 'translate3d(0rem, 0px, 0px)',
                        '-webkit-transform': 'translate3d(0rem, 0px, 0px)'
                    })
                }
                this.setState({flag:!this.state.flag})
	},
	jumpToDetail:function(event){
		this.props.history.pushState('/page2',{name:1})  
	}
})
