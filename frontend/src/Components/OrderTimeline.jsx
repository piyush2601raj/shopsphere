const OrderTimeline = ({
  status,
  orderedDate,
  packedDate,
  shippedDate,
  outForDeliveryDate,
  deliveredDate,
  expectedDelivery,
}) => {

  // ================= STATUS STAGES =================

  const stages = [
    {
      key: "CONFIRMED",
      title: "Order Confirmed",
      description:
        "Your order has been placed successfully.",
      date: orderedDate,
      icon: "📝",
    },
    {
      key: "PACKED",
      title: "Packed",
      description:
        "Seller has packed your order.",
      date: packedDate,
      icon: "📦",
    },
    {
      key: "SHIPPED",
      title: "Shipped",
      description:
        "Package has left our warehouse.",
      date: shippedDate,
      icon: "🚛",
    },
    {
      key: "OUT_FOR_DELIVERY",
      title: "Out For Delivery",
      description:
        "Your package is out for delivery.",
      date: outForDeliveryDate,
      icon: "🚚",
    },
    {
      key: "DELIVERED",
      title: "Delivered",
      description:
        "Your order has been delivered successfully.",
      date: deliveredDate,
      icon: "🎉",
    },
  ];


  // ================= STATUS ORDER =================

  const statusOrder = [
    "CONFIRMED",
    "PACKED",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ];


  // ================= CURRENT STATUS INDEX =================

  const currentIndex =
    statusOrder.indexOf(status);


  // ================= PROGRESS =================

  const progress =
    status === "CANCELLED"
      ? 0
      : currentIndex >= 0
      ? (currentIndex + 1) * 20
      : 20;


  // ================= FORMAT DATE =================

  const formatDate = (date) => {

    if (!date) {
      return "";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
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
        hour12: true,
      }
    );

  };


  // ================= EXPECTED DELIVERY FORMAT =================

  const formatExpectedDelivery = (
    date
  ) => {

    if (!date) {
      return "Calculating...";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Calculating...";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );

  };


  // ================= STATUS BADGE COLOR =================

  const getStatusBadgeClass = () => {

    switch (status) {

      case "DELIVERED":
        return "bg-success";

      case "OUT_FOR_DELIVERY":
        return "bg-primary";

      case "SHIPPED":
        return "bg-info text-dark";

      case "PACKED":
        return "bg-warning text-dark";

      case "CANCELLED":
        return "bg-danger";

      default:
        return "bg-secondary";

    }

  };


  // ================= RETURN =================

  return (

    <div
      className="
        card
        border-0
        shadow-sm
        rounded-4
        mt-4
      "
    >

      <div className="card-body p-4">


        {/* ================= HEADER ================= */}


        <div
          className="
            d-flex
            justify-content-between
            align-items-center
            flex-wrap
            gap-3
            mb-4
          "
        >

          <div>

            <h4 className="fw-bold mb-1">

              Order Tracking

            </h4>

            <small className="text-muted">

              Follow your package delivery progress

            </small>

          </div>


          <span
            className={`
              badge
              fs-6
              px-3
              py-2
              ${getStatusBadgeClass()}
            `}
          >

            {status
              ?.replaceAll(
                "_",
                " "
              )}

          </span>

        </div>


        {/* ================= CANCELLED ================= */}


        {status === "CANCELLED" ? (

          <div
            className="
              alert
              alert-danger
              rounded-4
            "
          >

            <strong>

              Order Cancelled

            </strong>

            <div className="mt-1">

              This order has been cancelled.

            </div>

          </div>

        ) : (

          <>


            {/* ================= EXPECTED DELIVERY ================= */}


            <div
              className="
                alert
                alert-info
                rounded-4
              "
            >

              <strong>

                🚚 Expected Delivery

              </strong>

              <div className="mt-1">

                {formatExpectedDelivery(
                  expectedDelivery
                )}

              </div>

            </div>


            {/* ================= PROGRESS BAR ================= */}


            <div
              className="progress mb-5"
              style={{
                height: "9px",
                borderRadius: "20px",
              }}
            >

              <div
                className="
                  progress-bar
                  progress-bar-striped
                  progress-bar-animated
                  bg-success
                "
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>


            {/* ================= TIMELINE ================= */}


            <div className="position-relative">


              {/* VERTICAL BACKGROUND LINE */}


              <div
                style={{
                  position: "absolute",
                  left: "21px",
                  top: "22px",
                  bottom: "22px",
                  width: "3px",
                  background:
                    "#dee2e6",
                }}
              />


              {/* ================= STAGES ================= */}


              {stages.map(
                (
                  stage,
                  index
                ) => {


                  // Completed status

                  const completed =
                    currentIndex >= 0 &&
                    index <=
                      currentIndex;


                  // Current status

                  const current =
                    index ===
                    currentIndex;


                  return (

                    <div
                      key={stage.key}
                      className="
                        d-flex
                        position-relative
                        mb-4
                      "
                    >


                      {/* ================= STATUS ICON ================= */}


                      <div
                        className={`
                          rounded-circle
                          d-flex
                          justify-content-center
                          align-items-center

                          ${
                            completed

                              ? "bg-success text-white"

                              : "bg-light text-secondary border"

                          }
                        `}
                        style={{
                          width: "45px",
                          height: "45px",
                          minWidth:
                            "45px",
                          position:
                            "relative",
                          zIndex: 2,
                          fontWeight:
                            "bold",
                        }}
                      >

                        {stage.icon}

                      </div>


                      {/* ================= STATUS DETAILS ================= */}


                      <div className="ms-3">


                        {/* TITLE */}


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


                        {/* ================= DATE ================= */}


                        {completed &&
                          stage.date && (

                            <small
                              className="
                                text-muted
                                d-block
                              "
                            >

                              {formatDate(
                                stage.date
                              )}

                            </small>

                          )}


                        {/* ================= DESCRIPTION ================= */}


                        {completed ? (

                          <small className="text-muted">

                            {stage.description}

                          </small>

                        ) : (

                          <small className="text-muted">

                            Waiting for update

                          </small>

                        )}


                        {/* ================= CURRENT STATUS ================= */}


                        {current &&
                          status !==
                            "DELIVERED" && (

                            <div className="mt-2">

                              <span
                                className="
                                  badge
                                  bg-warning
                                  text-dark
                                "
                              >

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

          </>

        )}

      </div>

    </div>

  );

};

export default OrderTimeline;