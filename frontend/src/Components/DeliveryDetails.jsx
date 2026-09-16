

const DeliveryDetails = ({
  status,
  deliveryBoy,
  deliveryOTP,
  trackingId,
}) => {

  const getCurrentLocation = () => {

    switch (status) {

      case "CONFIRMED":
        return "Warehouse";

      case "PACKED":
        return "Packing Center";

      case "SHIPPED":
        return "Chennai Distribution Hub";

      case "OUT_FOR_DELIVERY":
        return "Near Your Location";

      case "DELIVERED":
        return "Delivered";

      default:
        return "Order Processing";

    }

  };

  const getVehiclePosition = () => {

    switch (status) {

      case "CONFIRMED":
        return "20%";

      case "PACKED":
        return "35%";

      case "SHIPPED":
        return "55%";

      case "OUT_FOR_DELIVERY":
        return "78%";

      case "DELIVERED":
        return "90%";

      default:
        return "10%";

    }

  };

  const copyTrackingId = async () => {

    try {

      await navigator.clipboard.writeText(
        trackingId
      );

      alert("Tracking ID Copied");

    } catch (error) {

      console.error(
        "Copy failed:",
        error
      );

    }

  };

  return (
    <>

      <div className="card border-0 shadow-sm rounded-4 mt-4">

        <div className="card-body p-4">

          <h4 className="fw-bold mb-4">
            🚚 Delivery Information
          </h4>

          <div className="row g-4">

            <div className="col-lg-6">

              <div className="card border bg-light rounded-4 h-100">

                <div className="card-body">

                  <h6 className="fw-bold">
                    Delivery Partner
                  </h6>

                  <h5 className="text-primary">

                    {deliveryBoy.partner}

                  </h5>

                  {status ===
                    "OUT_FOR_DELIVERY" && (

                    <>

                      <hr />

                      <h6 className="fw-bold">
                        👨 Delivery Executive
                      </h6>

                      <p className="fw-bold mb-1">
                        {deliveryBoy.name}
                      </p>

                      <p className="mb-1">
                        📞 {deliveryBoy.phone}
                      </p>

                      <p className="mb-1">
                        ⭐ 4.9 Rating
                      </p>

                      <p className="mb-3">
                        🏍 Vehicle: TN09AB1234
                      </p>

                      <div className="d-flex gap-2">

                        <button
                          className="btn btn-success"
                          onClick={() => {
                            window.location.href =
                              `tel:${deliveryBoy.phone}`;
                          }}
                        >
                          📞 Call
                        </button>

                        <button
                          className="btn btn-outline-success"
                          onClick={() =>
                            window.open(
                              `https://wa.me/91${deliveryBoy.phone}`,
                              "_blank"
                            )
                          }
                        >
                          💬 WhatsApp
                        </button>

                      </div>

                      <div className="alert alert-warning text-center mt-4">

                        <small className="fw-bold">
                          DELIVERY OTP
                        </small>

                        <h2 className="fw-bold my-2">
                          {deliveryOTP}
                        </h2>

                        <small>
                          Share OTP only at the time of delivery.
                        </small>

                      </div>

                    </>

                  )}

                  {status === "DELIVERED" && (

                    <div className="alert alert-success mt-3">

                      <strong>
                        ✅ Package Delivered Successfully
                      </strong>

                      <div>
                        Delivered by {deliveryBoy.name}
                      </div>

                    </div>

                  )}

                  {![
                    "OUT_FOR_DELIVERY",
                    "DELIVERED",
                  ].includes(status) && (

                    <div className="alert alert-info mt-3 mb-0">

                      Delivery executive will be assigned on the day of delivery.

                    </div>

                  )}

                </div>

              </div>

            </div>

            <div className="col-lg-6">

              <div className="card border bg-light rounded-4 h-100">

                <div className="card-body">

                  <h6 className="fw-bold">
                    📦 Tracking Details
                  </h6>

                  <hr />

                  <small className="text-muted">
                    Tracking ID
                  </small>

                  <h4 className="text-primary mt-2">

                    {trackingId}

                  </h4>

                  <p className="text-muted">

                    Track the latest movement of your package.

                  </p>

                  <button
                    className="btn btn-primary w-100"
                    onClick={copyTrackingId}
                  >
                    📋 Copy Tracking ID
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="card border-0 shadow-sm rounded-4 mt-4">

        <div className="card-body p-4">

          <h4 className="fw-bold mb-4">
            📍 Live Delivery Map
          </h4>

          <div
            style={{
              height: "220px",
              background: "#f8f9fa",
              borderRadius: "15px",
              position: "relative",
              overflow: "hidden",
            }}
          >

            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "8%",
                right: "8%",
                height: "4px",
                background: "#198754",
              }}
            />

            <div
              style={{
                position: "absolute",
                left: "8%",
                top: "39%",
              }}
            >
              🏭
              <br />
              Warehouse
            </div>

            <div
              style={{
                position: "absolute",
                left: getVehiclePosition(),
                top: "36%",
                fontSize: "32px",
                transition: "1s",
              }}
            >
              🚚
            </div>

            <div
              style={{
                position: "absolute",
                right: "5%",
                top: "39%",
              }}
            >
              🏠
              <br />
              Your Home
            </div>

          </div>

          <div className="alert alert-light border mt-3 mb-0">

            <strong>
              Current Location:
            </strong>{" "}

            {getCurrentLocation()}

          </div>

        </div>

      </div>

      <div className="card border-0 shadow-sm rounded-4 mt-4">

        <div className="card-body">

          <h4 className="fw-bold">
            🔔 Order Notifications
          </h4>

          <ul className="list-group list-group-flush mt-3">

            <li className="list-group-item">
              ✅ Order Confirmed
            </li>

            {[
              "PACKED",
              "SHIPPED",
              "OUT_FOR_DELIVERY",
              "DELIVERED",
            ].includes(status) && (

              <li className="list-group-item">
                📦 Order Packed Successfully
              </li>

            )}

            {[
              "SHIPPED",
              "OUT_FOR_DELIVERY",
              "DELIVERED",
            ].includes(status) && (

              <li className="list-group-item">
                🚛 Package Shipped
              </li>

            )}

            {[
              "OUT_FOR_DELIVERY",
              "DELIVERED",
            ].includes(status) && (

              <li className="list-group-item">
                🚚 Out For Delivery
              </li>

            )}

            {status === "DELIVERED" && (

              <li className="list-group-item text-success fw-bold">
                🎉 Delivered Successfully
              </li>

            )}

          </ul>

        </div>

      </div>

    </>
  );
};

export default DeliveryDetails;