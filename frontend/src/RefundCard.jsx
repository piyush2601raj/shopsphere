import React from "react";

function RefundCard({

refundStatus,

refundAmount,

refundMode,

paymentMethod,

returnStatus,

refundDate

}) {

const progress =

refundStatus === "PENDING"
?25

:refundStatus==="APPROVED"
?50

:refundStatus==="PROCESSING"
?75

:refundStatus==="SUCCESS"
?100

:0;

const badgeColor=()=>{

switch(refundStatus){

case "PENDING":

return "bg-warning text-dark";

case "APPROVED":

return "bg-info";

case "PROCESSING":

return "bg-primary";

case "SUCCESS":

return "bg-success";

default:

return "bg-secondary";

}

};

return(

<div className="card shadow rounded-4 border-0 mt-4">

<div className="card-body">

<h4 className="fw-bold text-success mb-4">

💰 Refund Details

</h4>

<div
className="progress mb-4"
style={{

height:"10px",

borderRadius:"20px"

}}

>

<div

className="progress-bar progress-bar-striped progress-bar-animated bg-success"

style={{

width:`${progress}%`

}}

>

</div>

</div>

<div className="d-flex justify-content-between mb-4">

<span className={`badge ${badgeColor()} fs-6`}>

{refundStatus}

</span>

<span className="badge bg-success fs-6">

₹{refundAmount}

</span>

</div>

<div className="row">
    <div className="col-md-6">

<div className="card border-0 shadow-sm h-100">

<div className="card-body">

<h5 className="fw-bold text-success">

💰 Refund Summary

</h5>

<hr/>

<p>

<b>Refund Amount :</b>

₹{refundAmount}

</p>

<p>

<b>Refund Status :</b>

<span className={`badge ${badgeColor()} ms-2`}>

{refundStatus}

</span>

</p>

<p>

<b>Refund Mode :</b>

{refundMode}

</p>

<p>

<b>Original Payment :</b>

{paymentMethod}

</p>

<p>

<b>Return Status :</b>

{returnStatus}

</p>

</div>

</div>

</div>

<div className="col-md-6">

<div className="card border-0 shadow-sm h-100">

<div className="card-body">

<h5 className="fw-bold text-primary">

🏦 Refund Information

</h5>

<hr/>

<p>

<b>Refund Date :</b>

{refundDate || "Pending"}

</p>

<p>

<b>Expected Credit :</b>

2 - 5 Working Days

</p>

<p>

<b>Transaction ID :</b>

TXN-{Math.floor(Math.random()*1000000)}

</p>

<p>

<b>Reference No :</b>

REF-{Math.floor(Math.random()*100000)}

</p>

<p>

<b>Bank Status :</b>

{refundStatus==="SUCCESS"

? "Amount Credited"

: "Waiting"}

</p>

</div>

</div>

</div>

</div>
<div className="col-12 mt-4">

  <div className="card border-0 shadow-sm rounded-4">

    <div className="card-body">

      <h5 className="fw-bold text-primary">

        💳 Refund Method

      </h5>

      <hr/>

      {paymentMethod === "COD" ? (

        <>

          <div className="alert alert-warning">

            Cash On Delivery orders are refunded to your bank account or UPI.

          </div>

          <div className="row">

            <div className="col-md-6">

              <label className="form-label">
                Account Holder Name
              </label>

              <input
                type="text"
                className="form-control"
                value="Piyush Mishra"
                readOnly
              />

            </div>

            <div className="col-md-6">

              <label className="form-label">

                UPI ID

              </label>

              <input
                type="text"
                className="form-control"
                value="piyush@upi"
                readOnly
              />

            </div>

          </div>

        </>

      ) : (

        <>

          <div className="alert alert-success">

            Refund will be credited to your original payment method.

          </div>

          <div className="row">

            <div className="col-md-6">

              <p>

                <b>Payment Gateway</b>

              </p>

              <p>Razorpay</p>

            </div>

            <div className="col-md-6">

              <p>

                <b>Destination</b>

              </p>

              <p>

                Original Card / UPI / NetBanking

              </p>

            </div>

          </div>

        </>

      )}

    </div>

  </div>

</div>

<div className="col-12 mt-4">

<div className="card border-0 shadow-sm rounded-4">

<div className="card-body">

<h5 className="fw-bold text-danger">

📈 Refund Timeline

</h5>

<hr/>

<ul className="list-group list-group-flush">

<li className="list-group-item">

{progress>=25?"✅":"⭕"}

Refund Requested

</li>

<li className="list-group-item">

{progress>=50?"✅":"⭕"}

Refund Approved

</li>

<li className="list-group-item">

{progress>=75?"✅":"⭕"}

Refund Processing

</li>

<li className="list-group-item">

{progress>=100?"✅":"⭕"}

Amount Credited

</li>

</ul>

</div>

</div>

</div>
<div className="col-12 mt-4">

  <div className="card border-0 shadow rounded-4">

    <div className="card-body">

      <h5 className="fw-bold text-success">

        🎉 Refund Assurance

      </h5>

      <div className="alert alert-success">

        {refundStatus === "SUCCESS" ? (

          <>
            <h6 className="fw-bold">
              ✅ Refund Successfully Credited
            </h6>

            <p className="mb-0">
              ₹{refundAmount} has been credited to your account.
            </p>
          </>

        ) : (

          <>
            <h6 className="fw-bold">
              ⏳ Refund In Progress
            </h6>

            <p className="mb-0">
              Your refund is being processed. Please wait 2–5 working days.
            </p>
          </>

        )}

      </div>

      <div className="row mt-4">

        <div className="col-md-4">

          <div className="card bg-light border-0">

            <div className="card-body text-center">

              <h6>📞 Call Support</h6>

              <button
                className="btn btn-success btn-sm"
                onClick={() =>
                  window.location.href = "tel:+919092618817"
                }
              >
                Call Now
              </button>

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card bg-light border-0">

            <div className="card-body text-center">

              <h6>💬 Live Chat</h6>

              <button
                className="btn btn-primary btn-sm"
              >
                Start Chat
              </button>

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card bg-light border-0">

            <div className="card-body text-center">

              <h6>📧 Email</h6>

              <button
                className="btn btn-dark btn-sm"
                onClick={() =>
                  window.location.href =
                    "mailto:support@shopsphere.com"
                }
              >
                Send Mail
              </button>

            </div>

          </div>

        </div>

      </div>

      <div className="alert alert-info mt-4">

        <strong>Need Help?</strong>

        <br />

        If your refund is delayed beyond 5 working days,
        please contact ShopSphere Customer Care with your
        Return ID and Transaction ID.

      </div>

    </div>

  </div>

</div>

</div>

</div>

);

}

export default RefundCard;