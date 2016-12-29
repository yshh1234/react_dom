'use strict'

import React from 'react'

export default React.createClass({
  render() {
    return <div>
			<div className="invoice-ticket-container">
			    <img src="../img/ticket.jpg" className="ticket-img" />
			    <div className="ticketText">电子业务发票即将上线，敬请期待</div>
			</div>
			<div className="ticket-bottom"></div>
		</div>
  },
})
