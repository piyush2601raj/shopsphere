import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductImage from "./ProductImage";
import axios from "axios";

import OrderTimeline from "./components/OrderTimeline";
import DeliveryDetails from "./components/DeliveryDetails";
import ReturnRefund from "./components/ReturnRefundFixed";

function TrackOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ================= ORDER STATES =================

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("CONFIRMED");

  // ================= DELIVERY STATES =================

  const [deliveryBoy, setDeliveryBoy] = useState(null);
  const [trackingId, setTrackingId] = useState("");
  const [deliveryOTP, setDeliveryOTP] = useState("");

  // ================= RATING STATES =================

  const [rating, setRating] = useState(0);

  // ================= RETURN STATES =================

  const [showReturnModal, setShowReturnModal] =
    useState(false);

  const [returnRequested, setReturnRequested] =
    useState(false);

  const [selectedAction, setSelectedAction] =
    useState("");

  const [returnReason, setReturnReason] =
    useState("");

  const [returnComment, setReturnComment] =
    useState("");

  const [returnImage, setReturnImage] =
    useState(null);

  const [currentReturnStep, setCurrentReturnStep] =
    useState(0);

  // Return/Replacement demo starts when the request is created.
  // Each stage advances every 10 seconds.
  const [returnDemoStartedAt, setReturnDemoStartedAt] =
    useState(null);

  // ================= PICKUP STATES =================

  const [pickupPartner, setPickupPartner] =
    useState("");

  const [pickupExecutive, setPickupExecutive] =
    useState("");

  const [pickupNumber, setPickupNumber] =
    useState("");

  const [pickupOTP, setPickupOTP] =
    useState("");

  const [pickupDate, setPickupDate] =
    useState("");

  // ================= CONSTANTS =================

  const DELIVERY_BOYS = [
    {
      partner: "Ekart Logistics",
      name: "Rahul Kumar",
      phone: "9876543210",
    },
    {
      partner: "Delhivery",
      name: "Aman Singh",
      phone: "9123456789",
    },
    {
      partner: "Blue Dart",
      name: "Rohit Verma",
      phone: "9988776655",
    },
    {
      partner: "DTDC",
      name: "Vikram Sharma",
      phone: "9090909090",
    },
    {
      partner: "XpressBees",
      name: "Akash Patel",
      phone: "9898989898",
    },
  ];

  const RETURN_STEPS = [
    "Return Requested",
    "Request Approved",
    "Pickup Scheduled",
    "Product Picked Up",
    "Quality Check",
    "Refund Initiated",
    "Refund Completed",
  ];

  const getReturnStep = (returnStatus) => {
    const statusSteps = {
      RETURN_REQUESTED: 0,
      REQUEST_APPROVED: 1,
      PICKUP_SCHEDULED: 2,
      PRODUCT_PICKED_UP: 3,
      QUALITY_CHECK: 4,
      REFUND_INITIATED: 5,
      REFUND_COMPLETED: 6,

      // Replacement statuses
      REPLACEMENT_REQUESTED: 0,
      REPLACEMENT_APPROVED: 1,
      REPLACEMENT_SHIPPED: 2,
      REPLACEMENT_DELIVERED: 6,

      REJECTED: 0,
      CANCELLED: 0,
    };

    return statusSteps[returnStatus] ?? 0;
  };

  const formatPickupDate = (dateValue) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // ================= GET ORDERS =================

  const getOrders = () => {
    try {
      const savedOrders = JSON.parse(
        localStorage.getItem("orders")
      );

      return Array.isArray(savedOrders)
        ? savedOrders
        : [];
    } catch (error) {
      console.error(
        "Orders Reading Error:",
        error
      );

      return [];
    }
  };

  // ================= UPDATE ORDER =================

  const updateOrderInStorage = (updatedOrder) => {
    const orders = getOrders();

    const updatedOrders = orders.map(
      (currentOrder) =>
        String(currentOrder.id) === String(id)
          ? updatedOrder
          : currentOrder
    );

    localStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders)
    );

    localStorage.setItem(
      "latestOrder",
      JSON.stringify(updatedOrder)
    );

    setOrder(updatedOrder);
  };

  // ================= LOAD ORDER =================

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);

        const orders = getOrders();

        const selectedOrder = orders.find(
          (currentOrder) =>
            String(currentOrder.id) === String(id)
        );

        if (!selectedOrder) {
          setOrder(null);
          return;
        }

        const updatedOrder = {
          ...selectedOrder,
        };

        // ================= INITIAL STATUS =================

        if (!updatedOrder.status) {
          updatedOrder.status = "CONFIRMED";
        }

        // ================= DEMO TIMER START =================

        if (!updatedOrder.statusStartedAt) {
          updatedOrder.statusStartedAt =
            new Date().toISOString();
        }

        // ================= REAL ORDER DATE =================

        if (!updatedOrder.orderedAt) {
          updatedOrder.orderedAt =
            updatedOrder.orderDate ||
            new Date().toISOString();
        }

        // ================= DELIVERY BOY =================

        if (!updatedOrder.deliveryBoy) {
          const deliveryBoyIndex =
            Math.abs(
              Number(updatedOrder.id) || 0
            ) % DELIVERY_BOYS.length;

          updatedOrder.deliveryBoy =
            DELIVERY_BOYS[deliveryBoyIndex];
        }

        // ================= TRACKING ID =================

        if (!updatedOrder.trackingId) {
          updatedOrder.trackingId = `TRK${
            100000000 +
            ((Number(updatedOrder.id) ||
              Date.now()) %
              900000000)
          }`;
        }

        // ================= DELIVERY OTP =================

        if (!updatedOrder.deliveryOTP) {
          updatedOrder.deliveryOTP = String(
            1000 +
              ((Number(updatedOrder.id) ||
                Date.now()) %
                9000)
          );
        }

        updateOrderInStorage(updatedOrder);

        setStatus(updatedOrder.status);

        setDeliveryBoy(
          updatedOrder.deliveryBoy
        );

        setTrackingId(
          updatedOrder.trackingId
        );

        setDeliveryOTP(
          updatedOrder.deliveryOTP
        );

        setRating(
          Number(updatedOrder.rating) || 0
        );

        // =====================================================
        // LOAD REAL RETURN DATA FROM SPRING BOOT
        // =====================================================

        try {
          const returnResponse = await axios.get(
            `http://localhost:8080/api/returns/order/${selectedOrder.id}`
          );

          const backendReturn = returnResponse.data;

          if (backendReturn) {
            setReturnRequested(true);

            const demoKey =
              `shopsphere_return_demo_start_${selectedOrder.id}`;

            let savedDemoStart =
              localStorage.getItem(demoKey);

            if (!savedDemoStart) {
              savedDemoStart =
                new Date().toISOString();

              localStorage.setItem(
                demoKey,
                savedDemoStart
              );
            }

            setReturnDemoStartedAt(
              savedDemoStart
            );

            setSelectedAction(
              backendReturn.action || "RETURN"
            );

            setReturnReason(
              backendReturn.reason || ""
            );

            setReturnComment(
              backendReturn.comment || ""
            );

            setCurrentReturnStep(
              getReturnStep(backendReturn.status)
            );

            setPickupPartner(
              backendReturn.pickupPartner || ""
            );

            setPickupExecutive(
              backendReturn.pickupExecutive || ""
            );

            setPickupNumber(
              backendReturn.pickupNumber || ""
            );

            setPickupOTP(
              backendReturn.pickupOTP || ""
            );

            setPickupDate(
              formatPickupDate(
                backendReturn.pickupDate
              )
            );

            // Keep the latest backend return in local UI state.
            // The database remains the source of truth.
            setOrder((currentOrder) => ({
              ...currentOrder,
              returnRequest: backendReturn,
            }));
          }
        } catch (returnError) {
          // 404 simply means no return request exists yet.
          if (returnError?.response?.status !== 404) {
            console.error(
              "Return Request Fetch Error:",
              returnError
            );
          }

          setReturnRequested(false);
          setCurrentReturnStep(0);
        }
      } catch (error) {
        console.error(
          "Track Order Loading Error:",
          error
        );

        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  // ================= AUTO STATUS UPDATE =================

  useEffect(() => {
    if (!order?.statusStartedAt) {
      return;
    }

    if (
      status === "CANCELLED" ||
      status === "DELIVERED"
    ) {
      return;
    }

    const updateOrderStatus = () => {
      const startTime = new Date(
        order.statusStartedAt
      ).getTime();

      if (Number.isNaN(startTime)) {
        return;
      }

      const elapsedSeconds = Math.floor(
        (Date.now() - startTime) / 1000
      );

      let newStatus = "CONFIRMED";

      // DEMO ORDER FLOW: complete in 30 seconds.
      // 0s = Confirmed, 6s = Packed, 12s = Shipped,
      // 18s = Out For Delivery, 24s = Delivered.
      if (elapsedSeconds >= 30) {
        newStatus = "DELIVERED";
      } else if (elapsedSeconds >= 18) {
        newStatus = "OUT_FOR_DELIVERY";
      } else if (elapsedSeconds >= 12) {
        newStatus = "SHIPPED";
      } else if (elapsedSeconds >= 6) {
        newStatus = "PACKED";
      }

      if (newStatus !== status) {
        const updatedOrder = {
          ...order,
          status: newStatus,
        };

        // Keep frontend demo status and Spring Boot database
        // status synchronized.
        axios
          .put(
            `http://localhost:8080/orders/${order.id}/status`,
            null,
            {
              params: {
                status: newStatus,
              },
            }
          )
          .then(() => {
            updateOrderInStorage(updatedOrder);
            setOrder(updatedOrder);
            setStatus(newStatus);
          })
          .catch((error) => {
            console.error(
              `Failed to sync order status ${newStatus} with backend:`,
              error
            );
          });
      }
    };

    updateOrderStatus();

    const intervalId = setInterval(
      updateOrderStatus,
      1000
    );

    return () => {
      clearInterval(intervalId);
    };
  }, [order?.statusStartedAt, status]);
  // ================= REAL RETURN STATUS POLLING =================

  useEffect(() => {
    if (!order?.id || !returnRequested) {
      return;
    }

    let cancelled = false;

    const loadReturnStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/returns/order/${order.id}`
        );

        if (cancelled) return;

        const backendReturn = response.data;

        setReturnRequested(true);
        setSelectedAction(
          backendReturn.action || "RETURN"
        );
        setReturnReason(
          backendReturn.reason || ""
        );
        setReturnComment(
          backendReturn.comment || ""
        );

        // The return demo engine controls the timeline step.
        // Do not overwrite it from the 5-second polling call.

        setPickupPartner(
          backendReturn.pickupPartner || ""
        );

        setPickupExecutive(
          backendReturn.pickupExecutive || ""
        );

        setPickupNumber(
          backendReturn.pickupNumber || ""
        );

        setPickupOTP(
          backendReturn.pickupOTP || ""
        );

        setPickupDate(
          formatPickupDate(
            backendReturn.pickupDate
          )
        );

        setOrder((currentOrder) => ({
          ...currentOrder,
          returnRequest: backendReturn,
        }));
      } catch (error) {
        if (error?.response?.status === 404) {
          setReturnRequested(false);
          setCurrentReturnStep(0);
        } else {
          console.error(
            "Return Status Fetch Error:",
            error
          );
        }
      }
    };

    loadReturnStatus();

    const intervalId = setInterval(
      loadReturnStatus,
      5000
    );

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [order?.id, returnRequested]);

  // ================= RETURN / REPLACEMENT DEMO =================
  //
  // Return flow: complete in 30 seconds.
  // 0s = Requested, 5s = Approved, 10s = Pickup Scheduled,
  // 15s = Product Picked Up, 20s = Quality Check,
  // 25s = Refund Initiated, 30s = Refund Completed
  //
  // Replacement flow:
  // 0s  = Requested
  // 10s = Approved
  // 20s = Replacement Shipped
  // 30s = Replacement Delivered
  //
  // The frontend advances the timeline and also syncs the
  // corresponding status to Spring Boot.

  useEffect(() => {
    if (
      !order?.id ||
      !returnRequested ||
      !returnDemoStartedAt
    ) {
      return;
    }

    let cancelled = false;

    const RETURN_DEMO_STATUSES = [
      "RETURN_REQUESTED",
      "REQUEST_APPROVED",
      "PICKUP_SCHEDULED",
      "PRODUCT_PICKED_UP",
      "QUALITY_CHECK",
      "REFUND_INITIATED",
      "REFUND_COMPLETED",
    ];

    const REPLACEMENT_DEMO_STATUSES = [
      "REPLACEMENT_REQUESTED",
      "REPLACEMENT_APPROVED",
      "REPLACEMENT_SHIPPED",
      "REPLACEMENT_DELIVERED",
    ];

    const updateReturnDemo = async () => {
      const startTime =
        new Date(returnDemoStartedAt).getTime();

      if (Number.isNaN(startTime)) {
        return;
      }

      const elapsedSeconds = Math.floor(
        (Date.now() - startTime) / 1000
      );

      const statuses =
        selectedAction === "REPLACEMENT"
          ? REPLACEMENT_DEMO_STATUSES
          : RETURN_DEMO_STATUSES;

      // Return: 5 sec/stage. Replacement: 10 sec/stage.
      // Both demo flows complete in 30 seconds.
      const stageDuration =
        selectedAction === "REPLACEMENT" ? 10 : 5;

      const demoIndex = Math.min(
        Math.floor(elapsedSeconds / stageDuration),
        statuses.length - 1
      );

      const newBackendStatus =
        statuses[demoIndex];

      const newStep =
        getReturnStep(newBackendStatus);

      if (cancelled) {
        return;
      }

      setCurrentReturnStep(newStep);

      const statusKey =
        `shopsphere_return_demo_status_${order.id}`;

      const lastSyncedStatus =
        localStorage.getItem(statusKey);

      if (lastSyncedStatus === newBackendStatus) {
        return;
      }

      try {
        const returnId =
          order?.returnRequest?.id;

        if (!returnId) {
          return;
        }

        const response = await axios.put(
          `http://localhost:8080/api/returns/${returnId}/status`,
          null,
          {
            params: {
              status: newBackendStatus,
            },
          }
        );

        if (cancelled) {
          return;
        }

        localStorage.setItem(
          statusKey,
          newBackendStatus
        );

        const updatedReturn =
          response.data;

        setCurrentReturnStep(
          getReturnStep(
            updatedReturn?.status ||
            newBackendStatus
          )
        );

        setOrder((currentOrder) => ({
          ...currentOrder,
          returnRequest: {
            ...(currentOrder?.returnRequest || {}),
            ...updatedReturn,
          },
        }));

        // Keep pickup details synchronized.
        setPickupPartner(
          updatedReturn?.pickupPartner || ""
        );

        setPickupExecutive(
          updatedReturn?.pickupExecutive || ""
        );

        setPickupNumber(
          updatedReturn?.pickupNumber || ""
        );

        setPickupOTP(
          updatedReturn?.pickupOTP || ""
        );

        setPickupDate(
          formatPickupDate(
            updatedReturn?.pickupDate
          )
        );
      } catch (error) {
        console.error(
          `Failed to sync return demo status ${newBackendStatus}:`,
          error
        );
      }
    };

    updateReturnDemo();

    const intervalId = setInterval(
      updateReturnDemo,
      1000
    );

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [
    order?.id,
    order?.returnRequest?.id,
    returnRequested,
    returnDemoStartedAt,
    selectedAction,
  ]);

  // ================= MULTI-DAY DEMO DATE CALCULATIONS =================
  //
  // The shipment is still simulated every 10 seconds:
  // 0s  = Confirmed
  // 10s = Packed
  // 20s = Shipped
  // 30s = Out For Delivery
  // 40s = Delivered
  //
  // For a realistic e-commerce display, the timeline dates are
  // shown across multiple days instead of all on the same day.
  //
  // Demo date progression:
  // Day 0 = Confirmed
  // Day 1 = Packed
  // Day 2 = Shipped
  // Day 4 = Out For Delivery
  // Day 5 = Delivered
  //
  // Return/Replacement starts from the simulated Delivered date,
  // so it can never appear before delivery.

  const orderStartDate = order?.statusStartedAt
    ? new Date(order.statusStartedAt)
    : order?.orderedAt
    ? new Date(order.orderedAt)
    : new Date();

  const createDemoDate = (days, hour, minute) => {
  const date = new Date(orderStartDate);

  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);

  return date;
};
  // Multi-day demo status dates
  const orderedDate =
  createDemoDate(0, 9, 15);

const packedDate =
  createDemoDate(1, 11, 40);

const shippedDate =
  createDemoDate(2, 14, 5);

const outForDeliveryDate =
  createDemoDate(4, 17, 30);

const deliveredDate =
  createDemoDate(5, 12, 20);

  // ================= RETURN DEMO DATES =================
  // Demo status progression completes in 30 seconds.
  // Displayed dates/times are intentionally different for each stage.
  const createReturnDemoDate = (
    baseDate,
    days,
    hour,
    minute
  ) => {
    const date = new Date(baseDate);

    date.setDate(date.getDate() + days);
    date.setHours(hour, minute, 0, 0);

    return date;
  };

  const returnDemoStageDates =
    returnRequested
      ? {
          requested: createReturnDemoDate(
            deliveredDate, 0, 10, 15
          ).toISOString(),
          approved: createReturnDemoDate(
            deliveredDate, 0, 14, 30
          ).toISOString(),
          pickupScheduled: createReturnDemoDate(
            deliveredDate, 1, 11, 20
          ).toISOString(),
          pickedUp: createReturnDemoDate(
            deliveredDate, 2, 16, 10
          ).toISOString(),
          qualityCheck: createReturnDemoDate(
            deliveredDate, 3, 13, 45
          ).toISOString(),
          refundInitiated: createReturnDemoDate(
            deliveredDate, 4, 17, 25
          ).toISOString(),
          refundCompleted: createReturnDemoDate(
            deliveredDate, 5, 12, 40
          ).toISOString(),
        }
      : null;

  // Expected delivery is the simulated delivery date.
  const expectedDelivery =
    deliveredDate;

  // Return/Replacement timeline begins on the simulated
  // Delivered date, never before it.
  const returnTimelineRequestDate =
    status === "DELIVERED" && returnRequested
      ? deliveredDate.toISOString()
      : null;

  // ================= CANCEL ORDER =================

  const handleCancelOrder = () => {
    if (!order) return;

    if (
      [
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ].includes(status)
    ) {
      alert(
        "This order cannot be cancelled now."
      );

      return;
    }

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    const updatedOrder = {
      ...order,
      status: "CANCELLED",
      cancelledDate:
        new Date().toISOString(),
    };

    updateOrderInStorage(updatedOrder);

    setStatus("CANCELLED");

    alert(
      "Order Cancelled Successfully"
    );
  };

  // ================= BUY AGAIN =================

  const handleBuyAgain = () => {
    if (!order) return;

    const orderItems =
      Array.isArray(order.items)
        ? order.items
        : [];

    if (orderItems.length === 0) {
      alert("No Products Found");
      return;
    }

    let currentCart = [];

    try {
      const savedCart = JSON.parse(
        localStorage.getItem("cart")
      );

      currentCart =
        Array.isArray(savedCart)
          ? savedCart
          : [];
    } catch {
      currentCart = [];
    }

    orderItems.forEach((product) => {
      const existingProduct =
        currentCart.find(
          (cartItem) =>
            String(cartItem.id) ===
            String(product.id)
        );

      if (existingProduct) {
        existingProduct.quantity =
          (Number(
            existingProduct.quantity
          ) || 1) +
          (Number(product.quantity) || 1);
      } else {
        currentCart.push({
          ...product,
          quantity:
            Number(product.quantity) || 1,
        });
      }
    });

    localStorage.setItem(
      "cart",
      JSON.stringify(currentCart)
    );

    window.dispatchEvent(
      new Event("storage")
    );

    navigate("/cart");
  };

  // ================= RATING =================

  const handleRating = (
    selectedRating
  ) => {
    if (!order) return;

    const updatedOrder = {
      ...order,
      rating: selectedRating,
    };

    updateOrderInStorage(updatedOrder);

    setRating(selectedRating);

    alert(
      `Thank you for giving ${selectedRating} star rating!`
    );
  };

  // ================= RETURN IMAGE =================

  const handleReturnImage = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      setReturnImage(null);
      return;
    }

    if (
      !file.type.startsWith("image/")
    ) {
      alert(
        "Please select an image file."
      );

      return;
    }

    setReturnImage(file);
  };

  // ================= RETURN REQUEST =================

  const handleReturnRequest = async () => {
    if (!order) return;

    // Return/Replacement is allowed only after the order is delivered.
    if (status !== "DELIVERED") {
      alert(
        "Return/Replacement can only be requested after the order is delivered."
      );
      return;
    }

    if (!selectedAction) {
      alert("Please Select Return or Replacement.");
      return;
    }

    if (!returnReason.trim()) {
      alert("Please Select Return Reason");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/returns",
        null,
        {
          params: {
            orderId: order.id,
            action: selectedAction,
            reason: returnReason,
            comment: returnComment,
            pickupPartner:
              deliveryBoy?.partner ||
              order?.deliveryBoy?.partner ||
              "Ekart Logistics",
          },
        }
      );

      const savedReturn = response.data;

      const demoStart =
        new Date().toISOString();

      localStorage.setItem(
        `shopsphere_return_demo_start_${order.id}`,
        demoStart
      );

      setReturnDemoStartedAt(
        demoStart
      );

      setReturnRequested(true);

      setSelectedAction(
        savedReturn.action || selectedAction
      );

      setReturnReason(
        savedReturn.reason || returnReason
      );

      setReturnComment(
        savedReturn.comment || returnComment
      );

      setCurrentReturnStep(
        getReturnStep(savedReturn.status)
      );

      setPickupPartner(
        savedReturn.pickupPartner || ""
      );

      setPickupExecutive(
        savedReturn.pickupExecutive || ""
      );

      setPickupNumber(
        savedReturn.pickupNumber || ""
      );

      setPickupOTP(
        savedReturn.pickupOTP || ""
      );

      setPickupDate(
        formatPickupDate(
          savedReturn.pickupDate
        )
      );

      // Keep the latest backend object in React state.
      const updatedOrder = {
        ...order,
        returnRequest: savedReturn,
      };

      updateOrderInStorage(updatedOrder);

      setShowReturnModal(false);

      // Image is intentionally not uploaded here because the
      // current Spring Boot endpoint does not accept multipart files.
      // The selected image is still shown in the form before submit.

      alert(
        `${selectedAction} Request Submitted Successfully`
      );
    } catch (error) {
      console.error(
        "Return Request Error:",
        error
      );

      let message =
        "Unable to submit return request.";

      if (error?.response?.data) {
        if (typeof error.response.data === "string") {
          message = error.response.data;
        } else if (error.response.data.message) {
          message = error.response.data.message;
        }
      }

      alert(message);
    }
  };

  // ================= DOWNLOAD INVOICE =================

  const handleDownloadInvoice = () => {
    if (!order) return;

    const items =
      Array.isArray(order.items)
        ? order.items
        : [];

    const address =
      order.address || {};

    const invoiceWindow =
      window.open("", "_blank");

    if (!invoiceWindow) {
      alert(
        "Please allow popups to download invoice."
      );

      return;
    }

    const productsHTML = items
      .map((item) => {
        const price =
          Number(item.price) || 0;

        const quantity =
          Number(item.quantity) || 1;

        const total =
          price * quantity;

        return `
          <tr>
            <td>${item.name || "Product"}</td>
            <td>${quantity}</td>
            <td>₹${price.toLocaleString(
              "en-IN"
            )}</td>
            <td>₹${total.toLocaleString(
              "en-IN"
            )}</td>
          </tr>
        `;
      })
      .join("");

    invoiceWindow.document.write(`
      <!DOCTYPE html>

      <html>

      <head>

        <title>ShopSphere Invoice</title>

        <style>

          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #212529;
          }

          .header {
            display: flex;
            justify-content: space-between;
            border-bottom: 2px solid #0d6efd;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }

          .brand {
            color: #0d6efd;
          }

          .section {
            margin-bottom: 30px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th,
          td {
            padding: 12px;
            border: 1px solid #dee2e6;
            text-align: left;
          }

          th {
            background: #f8f9fa;
          }

          .total {
            text-align: right;
            margin-top: 30px;
            font-size: 22px;
            font-weight: bold;
          }

          .footer {
            margin-top: 50px;
            text-align: center;
            color: #6c757d;
          }

        </style>

      </head>

      <body>

        <div class="header">

          <div>

            <h1 class="brand">
              ShopSphere
            </h1>

            <p>Tax Invoice</p>

          </div>

          <div>

            <p>
              <strong>
                Order ID:
              </strong>

              #${order.id}
            </p>

            <p>
              <strong>
                Order Date:
              </strong>

              ${
                order.orderDate
                  ? new Date(
                      order.orderDate
                    ).toLocaleDateString(
                      "en-IN"
                    )
                  : "Not Available"
              }

            </p>

          </div>

        </div>

        <div class="section">

          <h3>
            Delivery Address
          </h3>

          <p>
            ${address.name || "Customer"}
          </p>

          <p>
            ${
              address.address ||
              "Address Not Available"
            }
          </p>

          <p>
            ${address.city || ""}
            ${address.pincode || ""}
          </p>

          <p>
            ${address.phone || ""}
          </p>

        </div>

        <div class="section">

          <h3>
            Order Items
          </h3>

          <table>

            <thead>

              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>

            </thead>

            <tbody>

              ${productsHTML}

            </tbody>

          </table>

        </div>

        <div class="total">

          Total Amount:

          ₹${(
            Number(
              order.totalAmount
            ) || 0
          ).toLocaleString("en-IN")}

        </div>

        <div class="footer">

          Thank you for shopping with ShopSphere.

        </div>

        <script>

          window.onload = function () {
            window.print();
          };

        </script>

      </body>

      </html>
    `);

    invoiceWindow.document.close();
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "650px",
        }}
      >
        <div className="text-center">

          <div
            className="spinner-border text-primary mb-3"
            role="status"
          />

          <h5>
            Loading Order Details...
          </h5>

        </div>
      </div>
    );
  }

  // ================= ORDER NOT FOUND =================

  if (!order) {
    return (
      <div
        className="container text-center py-5"
        style={{
          minHeight: "650px",
        }}
      >

        <div
          style={{
            fontSize: "80px",
          }}
        >
          📦
        </div>

        <h2 className="fw-bold mt-3">
          Order Not Found
        </h2>

        <p className="text-muted">
          We could not find this order.
        </p>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            navigate("/orders")
          }
        >
          View My Orders
        </button>

      </div>
    );
  }

  // ================= VALUES =================

  const items =
    Array.isArray(order.items)
      ? order.items
      : [];

  const address =
    order.address || {};

  const totalAmount =
    Number(order.totalAmount) || 0;

  // ================= RETURN =================

  return (
    <div
      className="bg-light py-5"
      style={{
        minHeight: "800px",
      }}
    >

      <div className="container">

        {/* PAGE HEADER */}

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

          <div>

            <button
              type="button"
              className="btn btn-outline-secondary mb-3"
              onClick={() =>
                navigate("/orders")
              }
            >
              ← Back To Orders
            </button>

            <h1 className="fw-bold mb-1">
              Track Your Order
            </h1>

            <p className="text-muted mb-0">
              Order #{order.id}
            </p>

          </div>

          <div className="d-flex flex-wrap gap-2">

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={
                handleDownloadInvoice
              }
            >
              🧾 Download Invoice
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={
                handleBuyAgain
              }
            >
              🛒 Buy Again
            </button>

          </div>

        </div>

        {/* ORDER SUMMARY */}

        <div className="card border-0 shadow-sm rounded-4">

          <div className="card-body p-4">

            <div className="row g-4">

              <div className="col-lg-8">

                <h4 className="fw-bold mb-4">
                  Order Items
                </h4>

                {items.map(
                  (item, index) => {
                    const quantity =
                      Number(
                        item.quantity
                      ) || 1;

                    const price =
                      Number(
                        item.price
                      ) || 0;

                    return (
                      <div
                        key={`${item.id}-${index}`}
                        className={`d-flex align-items-center gap-3 py-3 ${
                          index !==
                          items.length - 1
                            ? "border-bottom"
                            : ""
                        }`}
                      >

                        <div
  className="border rounded-3 p-2 bg-white d-flex justify-content-center align-items-center"
  style={{
    width: "150px",
    height: "150px",
    flexShrink: 0,
    cursor: "pointer",
  }}
  onClick={() =>
    navigate(`/product/${item.id}`)
  }
>
  <ProductImage
    product={item}
    height="130px"
  />
</div>
                        <div className="flex-grow-1">

                          <h5 className="fw-bold">
                            {item.name}
                          </h5>

                          <p className="text-muted mb-1">
                            Quantity:{" "}
                            {quantity}
                          </p>

                          <p className="mb-0">
                            ₹
                            {price.toLocaleString(
                              "en-IN"
                            )}{" "}
                            × {quantity}
                          </p>

                        </div>

                        <div className="text-end">

                          <small className="text-muted">
                            Item Total
                          </small>

                          <h5 className="fw-bold">
                            ₹
                            {(
                              price *
                              quantity
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </h5>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

              <div className="col-lg-4">

                <div className="bg-light border rounded-4 p-4 h-100">

                  <h5 className="fw-bold mb-4">
                    Order Information
                  </h5>

                  <div className="mb-3">

                    <small className="text-muted">
                      Total Amount
                    </small>

                    <h4 className="fw-bold text-success">
                      ₹
                      {totalAmount.toLocaleString(
                        "en-IN"
                      )}
                    </h4>

                  </div>

                  <div className="mb-3">

                    <small className="text-muted">
                      Payment Method
                    </small>

                    <div className="fw-semibold">

                      {order.paymentMethod ===
                      "COD"
                        ? "Cash On Delivery"
                        : "Online Payment"}

                    </div>

                  </div>

                  <div className="mb-3">

                    <small className="text-muted">
                      Current Status
                    </small>

                    <div className="mt-1">

                      <span
                        className={`badge ${
                          status ===
                          "DELIVERED"
                            ? "bg-success"
                            : status ===
                              "CANCELLED"
                            ? "bg-danger"
                            : "bg-primary"
                        }`}
                      >
                        {status.replaceAll(
                          "_",
                          " "
                        )}
                      </span>

                    </div>

                  </div>

                  <hr />

                  <h6 className="fw-bold">
                    Delivery Address
                  </h6>

                  <p className="fw-semibold mb-1">
                    {address.name ||
                      "Customer"}
                  </p>

                  <p className="text-muted mb-1">
                    {address.address ||
                      "Address Not Available"}
                  </p>

                  <p className="text-muted mb-1">

                    {address.city}

                    {address.city &&
                      address.pincode &&
                      " - "}

                    {address.pincode}

                  </p>

                  {address.phone && (
                    <p className="text-muted mb-0">
                      Phone:{" "}
                      {address.phone}
                    </p>
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ORDER TIMELINE */}

        <OrderTimeline
          status={status}
          orderedDate={orderedDate}
          packedDate={packedDate}
          shippedDate={shippedDate}
          outForDeliveryDate={
            outForDeliveryDate
          }
          deliveredDate={
            deliveredDate
          }
          expectedDelivery={
            expectedDelivery
          }
        />

        {/* DELIVERY DETAILS */}

        {status !== "CANCELLED" &&
          deliveryBoy && (

            <DeliveryDetails
              status={status}
              deliveryBoy={
                deliveryBoy
              }
              deliveryOTP={
                deliveryOTP
              }
              trackingId={
                trackingId
              }
            />

          )}

        {/* CANCEL ORDER */}

        {["CONFIRMED", "PACKED"].includes(
          status
        ) && (

          <div className="card border-0 shadow-sm rounded-4 mt-4">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

                <div>

                  <h5 className="fw-bold mb-1">
                    Need To Cancel Your Order?
                  </h5>

                  <p className="text-muted mb-0">
                    Cancellation is available before the order is shipped.
                  </p>

                </div>

                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={
                    handleCancelOrder
                  }
                >
                  Cancel Order
                </button>

              </div>

            </div>

          </div>

        )}

        {/* RETURN REFUND */}

        {status === "DELIVERED" && (

          <ReturnRefund
            returnData={order?.returnRequest}
            returnRequested={returnRequested}
  setShowReturnModal={setShowReturnModal}
  RETURN_STEPS={RETURN_STEPS}
  currentReturnStep={currentReturnStep}
  pickupPartner={
    deliveryBoy?.partner || pickupPartner
  }
  pickupExecutive={pickupExecutive}
  pickupNumber={pickupNumber}
  pickupOTP={pickupOTP}
  pickupDate={
    returnDemoStageDates?.pickupScheduled ||
    pickupDate
  }
  returnRequestDate={returnTimelineRequestDate}
  demoStageDates={returnDemoStageDates}
/>
        )}

        {/* RATING */}

        {status === "DELIVERED" && (

          <div className="card border-0 shadow-sm rounded-4 mt-4">

            <div className="card-body text-center p-4">

              <h4 className="fw-bold">
                Rate Your Shopping Experience
              </h4>

              <p className="text-muted">
                Your feedback helps us improve ShopSphere.
              </p>

              <div
                className="d-flex justify-content-center gap-2 my-4"
                style={{
                  fontSize: "40px",
                }}
              >

                {[1, 2, 3, 4, 5].map(
                  (star) => (

                    <button
                      key={star}
                      type="button"
                      className="btn border-0 p-0"
                      style={{
                        fontSize:
                          "40px",
                      }}
                      onClick={() =>
                        handleRating(
                          star
                        )
                      }
                    >
                      {star <= rating
                        ? "⭐"
                        : "☆"}
                    </button>

                  )
                )}

              </div>

              {rating > 0 && (

                <div className="alert alert-success mb-0">

                  Thank you! You rated this order{" "}

                  <strong>
                    {rating}/5
                  </strong>

                </div>

              )}

            </div>

          </div>

        )}

      </div>

      {/* RETURN MODAL */}

      {showReturnModal && (

        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            background:
              "rgba(0, 0, 0, 0.6)",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={() =>
            setShowReturnModal(false)
          }
        >

          <div
            className="card border-0 shadow-lg rounded-4"
            style={{
              width: "100%",
              maxWidth: "650px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="card-header bg-white p-4">

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <h4 className="fw-bold mb-1">
                    Return / Replace Product
                  </h4>

                  <small className="text-muted">
                    Submit your request below.
                  </small>

                </div>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setShowReturnModal(
                      false
                    )
                  }
                />

              </div>

            </div>

            <div className="card-body p-4">

              <div className="mb-4">

                <label className="form-label fw-semibold">
                  Select Action
                </label>

                <select
                  className="form-select"
                  value={
                    selectedAction
                  }
                  onChange={(e) =>
                    setSelectedAction(
                      e.target.value
                    )
                  }
                >

                  <option value="" disabled>
                    Select Action
                  </option>

                  <option value="RETURN">
                    Return Product
                  </option>

                  <option value="REPLACEMENT">
                    Replace Product
                  </option>

                </select>

              </div>

              <div className="mb-4">

                <label className="form-label fw-semibold">
                  Reason
                </label>

                <select
                  className="form-select"
                  value={returnReason}
                  onChange={(e) =>
                    setReturnReason(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select Reason
                  </option>

                  <option value="DAMAGED">
                    Product Damaged
                  </option>

                  <option value="WRONG_PRODUCT">
                    Wrong Product Received
                  </option>

                  <option value="DEFECTIVE">
                    Product Is Defective
                  </option>

                  <option value="NOT_AS_EXPECTED">
                    Product Not As Expected
                  </option>

                  <option value="SIZE_ISSUE">
                    Size Issue
                  </option>

                  <option value="OTHER">
                    Other Reason
                  </option>

                </select>

              </div>

              <div className="mb-4">

                <label className="form-label fw-semibold">
                  Additional Comments
                </label>

                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Describe the problem with the product..."
                  value={
                    returnComment
                  }
                  onChange={(e) =>
                    setReturnComment(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="mb-4">

                <label className="form-label fw-semibold">
                  Upload Product Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={
                    handleReturnImage
                  }
                />

                {returnImage && (

                  <small className="text-success d-block mt-2">
                    Selected:{" "}
                    {returnImage.name}
                  </small>

                )}

              </div>

              <div className="alert alert-info">

                <strong>
                  Return Policy:
                </strong>{" "}

                The product must be eligible for return and should be in acceptable condition.

              </div>

            </div>

            <div className="card-footer bg-white p-4">

              <div className="d-flex justify-content-end gap-2">

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setShowReturnModal(
                      false
                    )
                  }
                >
                  Close
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={
                    handleReturnRequest
                  }
                >
                  Submit Request
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default TrackOrder;