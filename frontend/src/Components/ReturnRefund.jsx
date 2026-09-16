const ReturnRefund = ({
  returnRequested,
  setShowReturnModal,
  RETURN_STEPS,
  currentReturnStep,
  pickupPartner,
  pickupExecutive,
  pickupNumber,
  pickupOTP,
  pickupDate,
  returnRequestDate,
  demoStageDates,
}) => {

  // =====================================================
  // DATE FORMAT FUNCTION
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  };


  // =====================================================
  // RETURN STAGE DATE/TIME
  // =====================================================
  // IMPORTANT:
  // Do not reuse the same backend timestamp for every stage.
  // Every return stage gets its own fixed demo day and time.
  //
  // This also protects the UI if the backend sends the same
  // timestamp for multiple return statuses.

  const RETURN_STAGE_TIMINGS = {
    requested: {
      dayOffset: 0,
      hour: 10,
      minute: 15,
    },

    approved: {
      dayOffset: 0,
      hour: 14,
      minute: 30,
    },

    pickupScheduled: {
      dayOffset: 1,
      hour: 11,
      minute: 20,
    },

    pickedUp: {
      dayOffset: 2,
      hour: 16,
      minute: 10,
    },

    qualityCheck: {
      dayOffset: 3,
      hour: 13,
      minute: 45,
    },

    refundInitiated: {
      dayOffset: 4,
      hour: 17,
      minute: 25,
    },

    refundCompleted: {
      dayOffset: 5,
      hour: 12,
      minute: 40,
    },
  };

  const getReturnBaseDate = () => {
    // Prefer the actual return request date supplied by the parent.
    const possibleDates = [
      returnRequestDate,
      demoStageDates?.requested,
    ];

    for (const value of possibleDates) {
      if (!value) {
        continue;
      }

      const parsed = new Date(value);

      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    return null;
  };

  const getStageDate = (stageKey) => {
    const timing = RETURN_STAGE_TIMINGS[stageKey];

    if (!timing) {
      return null;
    }

    const baseDate = getReturnBaseDate();

    if (!baseDate) {
      return null;
    }

    const date = new Date(baseDate);

    // Force a different calendar day for stages that occur later.
    date.setDate(
      date.getDate() + timing.dayOffset
    );

    // Force a different clock time for every stage.
    // This intentionally overrides any repeated backend/demo time.
    date.setHours(
      timing.hour,
      timing.minute,
      0,
      0
    );

    return date;
  };

  // =====================================================
  // RETURN STAGE DATE VALIDATION
  // =====================================================
  // Extra safety: make sure the seven dates are unique.
  // This prevents accidental duplicate timestamps if the data
  // structure is changed later.

  const returnStageDates = {
    requested: getStageDate("requested"),
    approved: getStageDate("approved"),
    pickupScheduled: getStageDate("pickupScheduled"),
    pickedUp: getStageDate("pickedUp"),
    qualityCheck: getStageDate("qualityCheck"),
    refundInitiated: getStageDate("refundInitiated"),
    refundCompleted: getStageDate("refundCompleted"),
  };

  // =====================================================
  // RETURN TIMELINE DATA
  // =====================================================

  const returnStageIcons = [
    "📝", // Return Requested
    "✓",  // Request Approved
    "🚚", // Pickup Scheduled
    "📦", // Product Picked Up
    "🔍", // Quality Check
    "💳", // Refund Initiated
    "✓",  // Refund Completed
  ];

  const returnStages = [

    {
      title: "Return Requested",

      description:
        "Your return request has been submitted successfully.",

      date: returnStageDates.requested,
    },

    {
      title: "Request Approved",

      description:
        "Your return request has been approved.",

      date: returnStageDates.approved,
    },

    {
      title: "Pickup Scheduled",

      description:
        "Pickup has been scheduled for your product.",

      date: returnStageDates.pickupScheduled,
    },

    {
      title: "Product Picked Up",

      description:
        "The product has been collected by our pickup executive.",

      date: returnStageDates.pickedUp,
    },

    {
      title: "Quality Check",

      description:
        "The returned product is being inspected.",

      date: returnStageDates.qualityCheck,
    },

    {
      title: "Refund Initiated",

      description:
        "Your refund has been initiated successfully.",

      date: returnStageDates.refundInitiated,
    },

    {
      title: "Refund Completed",

      description:
        "Refund has been successfully credited.",

      date: returnStageDates.refundCompleted,
    },

  ];


  // =====================================================
  // RETURN
  // =====================================================

  return (

    <div className="card border-0 shadow-sm rounded-4 mt-4">

      <div className="card-body p-4">


        {/* ========================================= */}
        {/* RETURN INFORMATION */}
        {/* ========================================= */}


        <div className="text-center">

          <h4 className="text-success fw-bold">

            Easy Return Available

          </h4>


          <p className="text-muted">

            Return, replacement and refund options
            are available for eligible products.

          </p>

        </div>



        {/* ========================================= */}
        {/* RETURN BENEFITS */}
        {/* ========================================= */}


        <div className="row text-center g-3 my-4">


          <div className="col-md-4">

            <div className="border rounded-4 p-3 h-100">

              <h3>🔄</h3>

              <h6 className="fw-bold">

                7 Days Return

              </h6>

            </div>

          </div>



          <div className="col-md-4">

            <div className="border rounded-4 p-3 h-100">

              <h3>📦</h3>

              <h6 className="fw-bold">

                Replacement

              </h6>

            </div>

          </div>



          <div className="col-md-4">

            <div className="border rounded-4 p-3 h-100">

              <h3>💰</h3>

              <h6 className="fw-bold">

                Secure Refund

              </h6>

            </div>

          </div>


        </div>



        {/* ========================================= */}
        {/* RETURN BUTTON */}
        {/* ========================================= */}


        {!returnRequested ? (

          <div className="text-center">


            <button

              className="btn btn-danger px-5 py-2 fw-bold"

              onClick={() =>
                setShowReturnModal(true)
              }

            >

              🔄 Return / Replace

            </button>


          </div>


        ) : (


          <>


            {/* ========================================= */}
            {/* REQUEST SUCCESS */}
            {/* ========================================= */}


            <div className="alert alert-success rounded-4">


              <h5 className="fw-bold">

                Return Request Submitted

              </h5>


              <small>

                Your request has been received
                and is being processed.

              </small>


            </div>



            {/* ========================================= */}
            {/* RETURN TRACKING */}
            {/* ========================================= */}


            <div className="mt-5">


              <h4 className="fw-bold text-center mb-5">

                Return & Refund Tracking

              </h4>



              <div

                className="mx-auto"

                style={{
                  maxWidth: "750px",
                }}

              >


                {/* Never render 1, 2, 3...; every stage has its own icon. */}
                {returnStages.map(

                  (stage, index) => {


                    // Current step and previous steps
                    // are completed

                    const completed =
                      index <= currentReturnStep;


                    // Exact current status

                    const current =
                      index === currentReturnStep;


                    return (


                      <div

                        key={stage.title}

                        className="d-flex align-items-start position-relative pb-5"

                      >



                        {/* ================================= */}
                        {/* STATUS CIRCLE */}
                        {/* ================================= */}


                        <div

                          className={`
                            rounded-circle
                            d-flex
                            justify-content-center
                            align-items-center

                            ${
                              completed

                                ? "bg-success text-white"

                                : "bg-secondary text-white"
                            }
                          `}

                          style={{

                            width: "46px",

                            height: "46px",

                            minWidth: "46px",

                            fontWeight: "bold",

                            zIndex: 2,

                          }}

                        >


                          {returnStageIcons[index] || "•"}


                        </div>



                        {/* ================================= */}
                        {/* VERTICAL LINE */}
                        {/* ================================= */}


                        {

                          index !==
                          returnStages.length - 1 && (


                            <div

                              style={{

                                position: "absolute",

                                left: "22px",

                                top: "46px",

                                width: "3px",

                                height: "75px",

                                background:

                                  index <
                                  currentReturnStep

                                    ? "#198754"

                                    : "#dee2e6",

                              }}

                            />


                          )

                        }



                        {/* ================================= */}
                        {/* STATUS INFORMATION */}
                        {/* ================================= */}


                        <div className="ms-4">


                          <h6

                            className={`
                              fw-bold
                              mb-1

                              ${
                                current

                                  ? "text-success"

                                  : !completed

                                  ? "text-muted"

                                  : ""
                              }
                            `}

                          >


                            {stage.title}


                          </h6>



                          {/* DATE ONLY COMPLETED STAGES */}


                          {

                            completed &&
                            stage.date && (


                              <small className="text-muted d-block mb-1">


                                {formatDate(stage.date)}


                              </small>


                            )

                          }



                          {/* DESCRIPTION */}


                          {

                            completed ? (


                              <small className="text-muted">


                                {stage.description}


                              </small>


                            ) : (


                              <small className="text-muted">


                                Waiting for update


                              </small>


                            )

                          }



                          {/* CURRENT STATUS */}


                          {

                            current &&
                            currentReturnStep <
                              returnStages.length - 1 && (


                              <div className="mt-2">


                                <span className="badge bg-warning text-dark">


                                  Current Status


                                </span>


                              </div>


                            )

                          }


                        </div>


                      </div>


                    );


                  }

                )}


              </div>


            </div>



            {/* ========================================= */}
            {/* PICKUP DETAILS */}
            {/* ========================================= */}


            {

              pickupPartner &&
              currentReturnStep >= 2 && (


                <div className="card bg-light border rounded-4 mt-4">


                  <div className="card-body">


                    <h5 className="fw-bold mb-4">


                      🚚 Pickup Details


                    </h5>



                    <div className="row">


                      <div className="col-md-6 mb-3">


                        <small className="text-muted">


                          Pickup Partner


                        </small>


                        <h6 className="fw-bold">


                          {pickupPartner}


                        </h6>


                      </div>



                      <div className="col-md-6 mb-3">


                        <small className="text-muted">


                          Executive


                        </small>


                        <h6 className="fw-bold">


                          {pickupExecutive}


                        </h6>


                      </div>



                      <div className="col-md-6 mb-3">


                        <small className="text-muted">


                          Contact


                        </small>


                        <h6 className="fw-bold">


                          {pickupNumber}


                        </h6>


                      </div>



                      <div className="col-md-6 mb-3">


                        <small className="text-muted">


                          Pickup OTP


                        </small>


                        <div>


                          <span className="badge bg-success fs-5 px-4 py-2">


                            {pickupOTP}


                          </span>


                        </div>


                      </div>



                      <div className="col-12">


                        <small className="text-muted">


                          Pickup Date


                        </small>


                        <h6 className="fw-bold">


                          {returnStageDates.pickupScheduled
                            ? formatDate(returnStageDates.pickupScheduled)
                            : "Pickup Date Will Be Updated"}


                        </h6>


                      </div>


                    </div>


                  </div>


                </div>


              )

            }


          </>


        )}


      </div>


    </div>

  );

};


export default ReturnRefund;