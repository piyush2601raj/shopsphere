import React from "react";

function ReturnTracking({
  returnData
}) {

  if (!returnData) {
    return null;
  }

  const {
    id,
    orderId,
    status,
    action,
    reason,
    comment,
    pickupPartner,
    pickupExecutive,
    pickupNumber,
    pickupOTP,
    pickupDate,
    refundStatus,
    refundAmount,
    requestDate,
    approvedDate,
    pickedUpDate,
    qualityCheckDate,
    refundInitiatedDate,
    refundCompletedDate
  } = returnData;


  // =====================================================
  // RETURN STEPS
  // =====================================================

  const steps = [
    {
      status: "RETURN_REQUESTED",
      title: "Return Requested",
      description:
        "Your return request has been submitted successfully.",
      date: requestDate
    },
    {
      status: "REQUEST_APPROVED",
      title: "Request Approved",
      description:
        "Your return request has been approved.",
      date: approvedDate
    },
    {
      status: "PICKUP_SCHEDULED",
      title: "Pickup Scheduled",
      description:
        "Your product pickup has been scheduled.",
      date: pickupDate
    },
    {
      status: "PRODUCT_PICKED_UP",
      title: "Product Picked Up",
      description:
        "The product has been picked up successfully.",
      date: pickedUpDate
    },
    {
      status: "QUALITY_CHECK",
      title: "Quality Check",
      description:
        "The returned product is being inspected.",
      date: qualityCheckDate
    },
    {
      status: "REFUND_INITIATED",
      title: "Refund Initiated",
      description:
        "Your refund has been initiated.",
      date: refundInitiatedDate
    },
    {
      status: "REFUND_COMPLETED",
      title: "Refund Completed",
      description:
        "Your refund has been successfully completed.",
      date: refundCompletedDate
    }
  ];


  // =====================================================
  // CURRENT STEP
  // =====================================================

  const currentStepIndex = steps.findIndex(
    (step) => step.status === status
  );

  const safeCurrentStep =
    currentStepIndex >= 0
      ? currentStepIndex
      : 0;


  // =====================================================
  // PROGRESS
  // =====================================================

  const progress =
    status === "RETURN_REQUESTED"
      ? 14
      : status === "REQUEST_APPROVED"
      ? 28
      : status === "PICKUP_SCHEDULED"
      ? 42
      : status === "PRODUCT_PICKED_UP"
      ? 57
      : status === "QUALITY_CHECK"
      ? 71
      : status === "REFUND_INITIATED"
      ? 85
      : status === "REFUND_COMPLETED"
      ? 100
      : 0;


  // =====================================================
  // BADGE
  // =====================================================

  const getBadge = () => {

    switch (status) {

      case "RETURN_REQUESTED":
        return "bg-warning text-dark";

      case "REQUEST_APPROVED":
        return "bg-primary";

      case "PICKUP_SCHEDULED":
        return "bg-info text-dark";

      case "PRODUCT_PICKED_UP":
        return "bg-primary";

      case "QUALITY_CHECK":
        return "bg-secondary";

      case "REFUND_INITIATED":
        return "bg-warning text-dark";

      case "REFUND_COMPLETED":
        return "bg-success";

      case "REJECTED":
        return "bg-danger";

      default:
        return "bg-light text-dark";
    }

  };


  // =====================================================
  // DISPLAY STATUS
  // =====================================================

  const getDisplayStatus = () => {

    switch (status) {

      case "RETURN_REQUESTED":
        return "RETURN REQUESTED";

      case "REQUEST_APPROVED":
        return "REQUEST APPROVED";

      case "PICKUP_SCHEDULED":
        return "PICKUP SCHEDULED";

      case "PRODUCT_PICKED_UP":
        return "PICKUP COMPLETED";

      case "QUALITY_CHECK":
        return "QUALITY INSPECTION";

      case "REFUND_INITIATED":
        return "REFUND INITIATED";

      case "REFUND_COMPLETED":
        return "REFUND COMPLETED";

      case "REJECTED":
        return "RETURN REJECTED";

      default:
        return status || "RETURN REQUESTED";
    }

  };


  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "Not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }
    );

  };


  // =====================================================
  // RETURN TIMELINE ICONS + RANDOM DISPLAY TIMES
  // =====================================================

  // Each stage gets a different clock time.
  // The actual backend dates are preserved; only the displayed
  // time is adjusted so every stage does not show the same time.
  const stageTimes = [
    [10, 15], // Return Requested
    [14, 37], // Request Approved
    [11, 22], // Pickup Scheduled
    [16, 8],  // Product Picked Up
    [13, 46], // Quality Check
    [17, 19], // Refund Initiated
    [12, 41]  // Refund Completed
  ];

  const getStageDisplayDate = (date, index) => {
    if (!date) return null;

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return null;
    }

    const [hour, minute] =
      stageTimes[index] || [9, 30];

    parsedDate.setHours(hour, minute, 0, 0);

    return parsedDate;
  };

  const stepIcons = [
    "📝",
    "✓",
    "🚚",
    "📦",
    "🔍",
    "💳",
    "✓"
  ];

  // =====================================================
  // DATE TIME FORMAT
  // =====================================================

  const formatDateTime = (date) => {

    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }
    );

  };


  // =====================================================
  // RETURN ID
  // =====================================================

  const returnId =
    id !== undefined && id !== null
      ? `RET-${String(id).padStart(6, "0")}`
      : "Not available";


  // =====================================================
  // REJECTED
  // =====================================================

  if (status === "REJECTED") {

    return (

      <div className="card shadow rounded-4 border-0 mt-4">

        <div className="card-body">

          <h4 className="fw-bold text-danger mb-4">

            ↩ Return & Refund Tracking

          </h4>

          <div className="alert alert-danger rounded-4">

            <h5 className="fw-bold">

              ❌ Return Request Rejected

            </h5>

            <p className="mb-0">

              Your return request has been rejected.
              Please contact ShopSphere customer support
              for further assistance.

            </p>

          </div>

        </div>

      </div>

    );

  }


  return (

    <div className="card shadow rounded-4 border-0 mt-4">

      <div className="card-body">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <h4 className="fw-bold text-danger mb-4">

          ↩ Return & Refund Tracking

        </h4>


        {/* ================================================= */}
        {/* PROGRESS BAR */}
        {/* ================================================= */}

        <div
          className="progress mb-4"
          style={{
            height: "10px",
            borderRadius: "20px"
          }}
        >

          <div
            className="progress-bar progress-bar-striped progress-bar-animated bg-danger"
            style={{
              width: `${progress}%`,
              transition: "width 0.5s ease"
            }}
          />

        </div>


        {/* ================================================= */}
        {/* STATUS + REFUND */}
        {/* ================================================= */}

        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">

          <span
            className={`badge ${getBadge()} fs-6`}
          >

            {getDisplayStatus()}

          </span>


          <span className="badge bg-success fs-6">

            Refund ₹
            {Number(
              refundAmount || 0
            ).toLocaleString("en-IN")}

          </span>

        </div>


        {/* ================================================= */}
        {/* RETURN INFORMATION */}
        {/* ================================================= */}

        <div className="row">

          <div className="col-12 mt-4">

            <div className="card border-0 shadow-sm rounded-4">

              <div className="card-body">

                <h5 className="fw-bold text-primary">

                  📦 Return Information

                </h5>

                <hr />


                <div className="row">

                  {/* LEFT */}

                  <div className="col-md-6">

                    <p>

                      <b>Return ID :</b>{" "}

                      {returnId}

                    </p>


                    <p>

                      <b>Order ID :</b>{" "}

                      #{orderId}

                    </p>


                    <p>

                      <b>Current Status :</b>

                      <span
                        className={`badge ${getBadge()} ms-2`}
                      >

                        {getDisplayStatus()}

                      </span>

                    </p>


                    <p>

                      <b>Return Type :</b>{" "}

                      {action || "RETURN"}

                    </p>


                    <p>

                      <b>Return Reason :</b>{" "}

                      {reason || "Not provided"}

                    </p>


                    <p>

                      <b>Request Date :</b>{" "}

                      {formatDate(requestDate)}

                    </p>


                    <p>

                      <b>Pickup Date :</b>{" "}

                      {formatDate(pickupDate)}

                    </p>

                  </div>


                  {/* RIGHT */}

                  <div className="col-md-6">

                    <p>

                      <b>Pickup Partner :</b>{" "}

                      {pickupPartner ||
                        "Not assigned"}

                    </p>


                    <p>

                      <b>Pickup Executive :</b>{" "}

                      {pickupExecutive ||
                        "Not assigned"}

                    </p>


                    <p>

                      <b>Pickup Number :</b>{" "}

                      {pickupNumber ||
                        "Not available"}

                    </p>


                    <p>

                      <b>Pickup OTP :</b>{" "}

                      {pickupOTP ||
                        "Not available"}

                    </p>


                    <p>

                      <b>Warehouse :</b>{" "}

                      ShopSphere Fulfillment Center

                    </p>


                    <p>

                      <b>Refund Status :</b>{" "}

                      {refundStatus ||
                        "PENDING"}

                    </p>


                    <p>

                      <b>Expected Refund :</b>{" "}

                      2-5 Working Days

                    </p>

                  </div>

                </div>


                {/* ================================================= */}
                {/* COMMENT */}
                {/* ================================================= */}

                {comment && (

                  <div className="mt-3">

                    <p className="mb-1">

                      <b>Additional Comment :</b>

                    </p>

                    <div className="bg-light rounded-3 p-3">

                      {comment}

                    </div>

                  </div>

                )}


                {/* ================================================= */}
                {/* IMPORTANT */}
                {/* ================================================= */}

                <div className="alert alert-warning mt-3 rounded-4">

                  <strong>
                    Important:
                  </strong>

                  <br />

                  Please keep the product packed with all original
                  accessories and invoice. The pickup executive may
                  reject the return if accessories are missing or the
                  product is physically damaged.

                </div>

              </div>

            </div>

          </div>


          {/* ================================================= */}
          {/* RETURN TIMELINE */}
          {/* ================================================= */}

          <div className="col-12 mt-4">

            <div className="card border-0 shadow-sm rounded-4">

              <div className="card-body">

                <h5 className="fw-bold text-primary mb-4">

                  📍 Return Timeline

                </h5>


                {steps.map(
                  (step, index) => {

                    const completed =
                      safeCurrentStep >= index;

                    const current =
                      safeCurrentStep === index;

                    const stageDate =
                      getStageDisplayDate(
                        step.date,
                        index
                      );


                    return (

                      <div
                        key={step.status}
                        className="d-flex"
                      >

                        {/* ================================================= */}
                        {/* TIMELINE ICON */}
                        {/* ================================================= */}

                        <div
                          className="d-flex flex-column align-items-center me-3"
                        >

                          <div
                            className={`rounded-circle d-flex align-items-center justify-content-center ${
                              completed
                                ? "bg-success text-white"
                                : "bg-light text-secondary"
                            }`}
                            style={{
                              width: "42px",
                              height: "42px",
                              fontWeight: "bold"
                            }}
                          >

                            {stepIcons[index]}

                          </div>


                          {index <
                            steps.length - 1 && (

                            <div
                              style={{
                                width: "3px",
                                height: "60px",

                                background:
                                  safeCurrentStep >
                                  index
                                    ? "#198754"
                                    : "#dee2e6",

                                transition:
                                  "background 0.5s ease"
                              }}
                            />

                          )}

                        </div>


                        {/* ================================================= */}
                        {/* TIMELINE CONTENT */}
                        {/* ================================================= */}

                        <div className="pb-4">

                          <h6
                            className={`fw-bold ${
                              current
                                ? "text-success"
                                : ""
                            }`}
                          >

                            {step.title}

                          </h6>


                          {completed ? (

                            <>

                              <p className="text-muted small mb-1">

                                {step.description}

                              </p>


                              {stageDate && (

                                <small className="text-muted">

                                  {formatDateTime(
                                    stageDate
                                  )}

                                </small>

                              )}

                            </>

                          ) : (

                            <p className="text-muted small mb-0">

                              Waiting for update

                            </p>

                          )}


                          {current && (

                            <div className="mt-2">

                              <span className="badge bg-success">

                                Current Status

                              </span>

                            </div>

                          )}

                        </div>

                      </div>

                    );

                  }
                )}

              </div>

            </div>

          </div>


          {/* ================================================= */}
          {/* PICKUP DETAILS */}
          {/* ================================================= */}

          {(
            status === "PICKUP_SCHEDULED" ||
            status === "PRODUCT_PICKED_UP" ||
            status === "QUALITY_CHECK"
          ) && (

            <div className="col-12 mt-4">

              <div className="card border-0 shadow rounded-4">

                <div className="card-body">

                  <h5 className="fw-bold text-primary">

                    🚚 Pickup Details

                  </h5>

                  <hr />


                  <div className="row">

                    <div className="col-md-6">

                      <p>

                        <b>Pickup Partner :</b>{" "}

                        {pickupPartner ||
                          "Not assigned"}

                      </p>


                      <p>

                        <b>Pickup Executive :</b>{" "}

                        {pickupExecutive ||
                          "Not assigned"}

                      </p>

                    </div>


                    <div className="col-md-6">

                      <p>

                        <b>Pickup Number :</b>{" "}

                        {pickupNumber ||
                          "Not available"}

                      </p>


                      <p>

                        <b>Pickup Date :</b>{" "}

                        {formatDate(pickupDate)}

                      </p>

                    </div>

                  </div>


                  {/* ================================================= */}
                  {/* OTP */}
                  {/* ================================================= */}

                  {status === "PICKUP_SCHEDULED" &&
                    pickupOTP && (

                    <div className="alert alert-warning rounded-4 mt-3">

                      <h6 className="fw-bold">

                        🔐 Pickup OTP

                      </h6>

                      <p className="mb-2">

                        Share this OTP with the pickup
                        executive when the product is collected.

                      </p>

                      <h3 className="fw-bold mb-0">

                        {pickupOTP}

                      </h3>

                    </div>

                  )}

                </div>

              </div>

            </div>

          )}


          {/* ================================================= */}
          {/* REFUND INFORMATION */}
          {/* ================================================= */}

          {(
            status === "REFUND_INITIATED" ||
            status === "REFUND_COMPLETED"
          ) && (

            <div className="col-12 mt-4">

              <div className="card border-0 shadow rounded-4">

                <div className="card-body">

                  <h5 className="fw-bold text-success">

                    💳 Refund Information

                  </h5>

                  <hr />


                  <div className="row">

                    <div className="col-md-4">

                      <p>

                        <b>Refund Amount :</b>

                      </p>

                      <h5 className="text-success fw-bold">

                        ₹
                        {Number(
                          refundAmount || 0
                        ).toLocaleString(
                          "en-IN"
                        )}

                      </h5>

                    </div>


                    <div className="col-md-4">

                      <p>

                        <b>Refund Status :</b>

                      </p>

                      <span
                        className={`badge ${
                          status ===
                          "REFUND_COMPLETED"
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >

                        {refundStatus ||
                          "PROCESSING"}

                      </span>

                    </div>


                    <div className="col-md-4">

                      <p>

                        <b>Refund Mode :</b>

                      </p>

                      <span>

                        Original Payment Method

                      </span>

                    </div>

                  </div>


                  <div
                    className={`alert ${
                      status ===
                      "REFUND_COMPLETED"
                        ? "alert-success"
                        : "alert-warning"
                    } rounded-4 mt-3`}
                  >

                    <strong>

                      {status ===
                      "REFUND_COMPLETED"
                        ? "✅ Refund Completed"
                        : "⏳ Refund Processing"}

                    </strong>

                    <br />

                    {status ===
                    "REFUND_COMPLETED"
                      ? "Your refund has been successfully processed."
                      : "Your refund is currently being processed."}

                  </div>

                </div>

              </div>

            </div>

          )}


          {/* ================================================= */}
          {/* CUSTOMER SUPPORT */}
          {/* ================================================= */}

          <div className="col-12 mt-4">

            <div className="card border-0 shadow rounded-4">

              <div className="card-body">

                <h5 className="fw-bold text-success">

                  📞 Customer Support

                </h5>


                <div className="row">

                  <div className="col-md-4">

                    <div className="card border-0 bg-light">

                      <div className="card-body text-center">

                        <h6>

                          📞 Call Support

                        </h6>

                        <p className="mb-2">

                          +91 9092618817

                        </p>

                        <button
                          className="btn btn-success btn-sm"
                          onClick={() =>
                            window.location.href =
                              "tel:+919092618817"
                          }
                        >

                          Call

                        </button>

                      </div>

                    </div>

                  </div>


                  <div className="col-md-4">

                    <div className="card border-0 bg-light">

                      <div className="card-body text-center">

                        <h6>

                          💬 Live Chat

                        </h6>

                        <p className="mb-2">

                          Chat with our executive

                        </p>

                        <button
                          className="btn btn-primary btn-sm"
                        >

                          Start Chat

                        </button>

                      </div>

                    </div>

                  </div>


                  <div className="col-md-4">

                    <div className="card border-0 bg-light">

                      <div className="card-body text-center">

                        <h6>

                          📧 Email

                        </h6>

                        <p className="mb-2">

                          support@shopsphere.com

                        </p>

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


                {/* ================================================= */}
                {/* REFUND ASSURANCE */}
                {/* ================================================= */}

                <div className="alert alert-success mt-4 rounded-4">

                  <h6 className="fw-bold">

                    ✅ Refund Assurance

                  </h6>

                  Once the returned item passes the quality inspection,
                  your refund will automatically be credited to your
                  original payment method.

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default ReturnTracking;
