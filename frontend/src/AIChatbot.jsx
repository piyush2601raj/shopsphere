import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";

import { getProductById, addToCart } from "./dataService";

function AIChatbot() {
    const navigate = useNavigate();

    // =====================================================
    // CHATBOT STATE
    // =====================================================

    const [isOpen, setIsOpen] = useState(false);

    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([
        {
            role: "ai",
            content:
                "Hello! I'm ShopSphere AI. How can I help you today?",
            products: []
        }
    ]);

    const [loading, setLoading] = useState(false);

    const [addingProductId, setAddingProductId] =
        useState(null);

    const [cartMessage, setCartMessage] =
        useState({});

    // =====================================================
    // WISHLIST STATE
    // =====================================================

    const [wishlist, setWishlist] = useState([]);

    const [wishlistMessage, setWishlistMessage] =
        useState({});

    // =====================================================
    // LOAD WISHLIST
    // =====================================================

    useEffect(() => {
        const savedWishlist =
            JSON.parse(
                localStorage.getItem("wishlist")
            ) || [];

        setWishlist(savedWishlist);
    }, []);


    // =====================================================
    // QUICK SUGGESTIONS
    // =====================================================

    const quickSuggestions = [
        "Samsung mobile under 50000",
        "Laptop under 70000",
        "Headphones",
        "Gaming products",
        "Best deals"
    ];


    // =====================================================
    // IMAGE HELPER
    // =====================================================

    const getProductImage = (product) => {

        if (!product) {
            return "/Products/fallback.jpg";
        }

        const possibleImages = [
            product.image,
            product.imageUrl,
            product.imageURL
        ];

        for (let image of possibleImages) {

            if (
                !image ||
                typeof image !== "string"
            ) {
                continue;
            }

            image = image.trim();

            if (
                !image ||
                image === "null" ||
                image === "undefined"
            ) {
                continue;
            }


            // =================================================
            // EXTERNAL URL
            // =================================================

            if (
                image.startsWith("http://") ||
                image.startsWith("https://")
            ) {
                return image;
            }


            // =================================================
            // DATA URL
            // =================================================

            if (
                image.startsWith("data:")
            ) {
                return image;
            }


            // =================================================
            // BLOB URL
            // =================================================

            if (
                image.startsWith("blob:")
            ) {
                return image;
            }


            // =================================================
            // ALREADY LOCAL PATH
            // =================================================

            if (
                image.startsWith("/")
            ) {
                return image;
            }


            // =================================================
            // ONLY FILENAME
            // Example:
            // laptop.png
            //
            // becomes:
            // /Products/laptop.png
            // =================================================

            return `/Products/${image}`;
        }


        // =====================================================
        // FINAL FALLBACK
        // =====================================================

        return "/Products/fallback.jpg";
    };


    // =====================================================
    // SEND MESSAGE
    // =====================================================

    const sendMessage = async (customMessage = null) => {

        if (loading) {
            return;
        }


        const userMessage =
            customMessage !== null
                ? customMessage.trim()
                : message.trim();


        if (!userMessage) {
            return;
        }


        // =====================================================
        // SHOW USER MESSAGE
        // =====================================================

        setMessages(prev => [
            ...prev,
            {
                role: "user",
                content: userMessage,
                products: []
            }
        ]);


        setMessage("");

        setLoading(true);


        try {

            // =================================================
            // GET LOGGED-IN USER ID
            // =================================================

            let userId =
                localStorage.getItem("userId");


            // =================================================
            // FALLBACK USER STORAGE
            // =================================================

            if (!userId) {

                const storedUser =
                    localStorage.getItem("user") ||
                    localStorage.getItem("currentUser") ||
                    localStorage.getItem("loggedInUser");

                if (storedUser) {

                    try {

                        const parsedUser =
                            JSON.parse(storedUser);

                        userId =
                            parsedUser?.id ??
                            parsedUser?.userId ??
                            parsedUser?.user?.id ??
                            parsedUser?.user?.userId;

                    } catch (error) {

                        console.warn(
                            "Could not parse stored user information:",
                            error
                        );
                    }
                }
            }


            // =================================================
            // NORMALIZE USER ID
            // =================================================

            if (
                userId !== null &&
                userId !== undefined &&
                userId !== ""
            ) {
                userId = String(userId).trim();
            }


            // =================================================
            // DEBUG LOCAL STORAGE
            // =================================================

            console.log(
                "========== SHOPSPHERE LOGIN DEBUG =========="
            );

            console.log(
                "USER ID FROM localStorage =",
                localStorage.getItem("userId")
            );

            console.log(
                "FINAL AI USER ID =",
                userId
            );

            console.log(
                "CURRENT USER OBJECT =",
                localStorage.getItem("user")
            );

            console.log(
                "CURRENT USER STORAGE =",
                localStorage.getItem("currentUser")
            );

            console.log(
                "LOGGED IN USER STORAGE =",
                localStorage.getItem("loggedInUser")
            );

            console.log(
                "============================================"
            );


            // =================================================
            // CREATE API PARAMETERS
            // =================================================

            const params = {
                message: userMessage
            };


            // =================================================
            // ADD USER ID ONLY WHEN AVAILABLE
            // =================================================

            if (
                userId !== null &&
                userId !== undefined &&
                userId !== ""
            ) {
                params.userId = userId;
            }


            console.log(
                "AI CHAT REQUEST PARAMS =",
                params
            );


            // =================================================
            // CALL AI BACKEND
            // =================================================

            const response =
    await axios.get(
        "https://shopsphere-backend-production-c62b.up.railway.app/api/ai/chat",
        {
            params: params
        }
    );


            // =================================================
            // DEBUG AI RESPONSE
            // =================================================

            console.log(
                "AI RESPONSE =",
                response.data
            );


            // =================================================
            // AI MESSAGE
            // =================================================

            const aiMessage =
                response.data?.message || "";


            // =================================================
            // PRODUCT IDS
            // =================================================

            const productIds =
                Array.isArray(
                    response.data?.productIds
                )
                    ? response.data.productIds
                    : [];


            console.log(
                "AI PRODUCT IDS =",
                productIds
            );


            // =================================================
            // GET ACTUAL PRODUCTS
            // =================================================

            const productResults =
                await Promise.all(

                    productIds.map(
                        async (id) => {

                            try {

                                const product =
                                    await getProductById(id);


                                console.log(
                                    "PRODUCT FROM getProductById:",
                                    product
                                );


                                return product;

                            } catch (error) {

                                console.error(
                                    "Failed to fetch product:",
                                    id,
                                    error
                                );


                                return null;
                            }
                        }
                    )
                );


            // =================================================
            // REMOVE NULL PRODUCTS
            // =================================================

            const products =
                productResults.filter(
                    product =>
                        product !== null
                );


            console.log(
                "CHATBOT PRODUCTS =",
                products
            );


            // =================================================
            // DEBUG PRODUCT IMAGES
            // =================================================

            products.forEach(
                product => {

                    console.log(
                        "CHATBOT PRODUCT IMAGE:",
                        {
                            id: product?.id,
                            name: product?.name,
                            image: product?.image,
                            imageUrl: product?.imageUrl,
                            imageURL: product?.imageURL,
                            finalImage:
                                getProductImage(product)
                        }
                    );
                }
            );


            // =================================================
            // ADD AI RESPONSE
            // =================================================

            setMessages(prev => [
                ...prev,
                {
                    role: "ai",
                    content: aiMessage,
                    products: products
                }
            ]);

        } catch (error) {

            console.error(
                "AI chatbot error:",
                error
            );


            // =================================================
            // ERROR MESSAGE
            // =================================================

            setMessages(prev => [
                ...prev,
                {
                    role: "ai",
                    content:
                        "Sorry, I couldn't process your request right now.",
                    products: []
                }
            ]);

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // QUICK SUGGESTION CLICK
    // =====================================================

    const handleSuggestionClick = (suggestion) => {

        if (loading) {
            return;
        }

        sendMessage(suggestion);
    };


    // =====================================================
    // CLEAR CHAT
    // =====================================================

    const clearChat = () => {

        if (loading) {
            return;
        }

        setMessages([
            {
                role: "ai",
                content:
                    "Hello! I'm ShopSphere AI. How can I help you today?",
                products: []
            }
        ]);

        setMessage("");

        setCartMessage({});
        setWishlistMessage({});
    };


    // =====================================================
    // ENTER KEY
    // =====================================================

    const handleKeyDown = (e) => {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            sendMessage();
        }
    };


    // =====================================================
    // VIEW PRODUCT
    // =====================================================

    const handleViewProduct = (product) => {

        navigate(
            `/product/${product.id}`
        );

        setIsOpen(false);
    };


    // =====================================================
    // ADD TO CART
    // =====================================================

    const handleAddToCart = async (
        product
    ) => {

        try {

            setAddingProductId(
                product.id
            );


            await addToCart(product);

            // Notify Navbar / other components about the cart change.
            window.dispatchEvent(
                new Event("cartChanged")
            );

            setCartMessage(
                prev => ({
                    ...prev,
                    [product.id]:
                        "Added to cart ✓"
                })
            );

        } catch (error) {

            console.error(
                "Add to cart error:",
                error
            );


            setCartMessage(
                prev => ({
                    ...prev,
                    [product.id]:
                        "Failed to add"
                })
            );

        } finally {

            setAddingProductId(null);
        }
    };


    // =====================================================
    // TOGGLE WISHLIST
    // =====================================================

    const handleToggleWishlist = (product) => {

        if (!product?.id) {
            return;
        }

        const productId =
            Number(product.id);

        const existingWishlist =
            JSON.parse(
                localStorage.getItem("wishlist")
            ) || [];

        const alreadyExists =
            existingWishlist.some(
                (item) =>
                    Number(item.id) === productId
            );

        let updatedWishlist;

        if (alreadyExists) {

            updatedWishlist =
                existingWishlist.filter(
                    (item) =>
                        Number(item.id) !== productId
                );

            setWishlistMessage(
                (prev) => ({
                    ...prev,
                    [productId]:
                        "Removed from wishlist"
                })
            );

        } else {

            updatedWishlist = [
                ...existingWishlist,
                product
            ];

            setWishlistMessage(
                (prev) => ({
                    ...prev,
                    [productId]:
                        "Added to wishlist ❤️"
                })
            );
        }

        localStorage.setItem(
            "wishlist",
            JSON.stringify(updatedWishlist)
        );

        setWishlist(updatedWishlist);

        // Notify Navbar / other components about the wishlist change.
        window.dispatchEvent(
            new Event("wishlistChanged")
        );

        // Keep the existing storage event as well.
        window.dispatchEvent(
            new Event("storage")
        );
    };

    // =====================================================
    // CHECK WISHLIST
    // =====================================================

    const isInWishlist = (productId) => {

        return wishlist.some(
            (item) =>
                Number(item.id) ===
                Number(productId)
        );
    };

    // =====================================================
    // PRODUCT CARD
    // =====================================================

    const ProductCard = ({
        product
    }) => {

        const image =
            getProductImage(product);


        return (

            <div
                style={{
                    border:
                        "1px solid #ddd",

                    borderRadius:
                        "10px",

                    padding:
                        "10px",

                    marginTop:
                        "10px",

                    background:
                        "#fff"
                }}
            >

                {/* =================================================
                    PRODUCT IMAGE
                ================================================= */}

                <div
                    style={{
                        width: "100%",
                        height: "130px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#fafafa",
                        borderRadius: "10px",
                        overflow: "hidden",
                        position: "relative"
                    }}
                >

                    {/* =================================================
                        WISHLIST BUTTON
                    ================================================= */}

                    <button
                        onClick={() =>
                            handleToggleWishlist(product)
                        }
                        title={
                            isInWishlist(product?.id)
                                ? "Remove from Wishlist"
                                : "Add to Wishlist"
                        }
                        style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            border: "1px solid #e5e7eb",
                            background: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            fontSize: "18px",
                            zIndex: 5,
                            boxShadow:
                                "0 2px 8px rgba(0,0,0,0.12)"
                        }}
                    >
                        {isInWishlist(product?.id)
                            ? "❤️"
                            : "🤍"}
                    </button>

                    <img
                        src={image}

                        alt={
                            product?.name ||
                            "Product"
                        }

                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            display: "block"
                        }}

                        onError={(e) => {

                            if (
                                e.currentTarget.dataset
                                    .fallbackApplied === "true"
                            ) {
                                return;
                            }


                            e.currentTarget.dataset
                                .fallbackApplied = "true";


                            console.warn(
                                "Product image unavailable. Using fallback:",
                                {
                                    productId:
                                        product?.id,

                                    productName:
                                        product?.name,

                                    failedImage:
                                        e.currentTarget.src
                                }
                            );


                            e.currentTarget.src =
                                "/Products/fallback.jpg";
                        }}
                    />

                </div>


                {/* =================================================
                    PRODUCT NAME
                ================================================= */}

                <div
                    style={{
                        fontWeight: "600",
                        marginTop: "8px",
                        fontSize: "14px",
                        lineHeight: "1.4"
                    }}
                >
                    {product?.name}
                </div>


                {/* =================================================
                    BRAND
                ================================================= */}

                {product?.brand && (

                    <div
                        style={{
                            fontSize: "12px",
                            color: "#666",
                            marginTop: "3px"
                        }}
                    >
                        {product.brand}
                    </div>

                )}


                {/* =================================================
                    PRICE
                ================================================= */}

                <div
                    style={{
                        fontWeight: "700",
                        fontSize: "16px",
                        marginTop: "6px"
                    }}
                >
                    ₹
                    {Number(
                        product?.price || 0
                    ).toLocaleString(
                        "en-IN"
                    )}
                </div>


                {/* =================================================
                    ORIGINAL PRICE + DISCOUNT
                ================================================= */}

                {product?.originalPrice &&
                    Number(
                        product.originalPrice
                    ) >
                    Number(
                        product.price || 0
                    ) && (

                        <div
                            style={{
                                display: "flex",
                                gap: "6px",
                                alignItems:
                                    "center",
                                marginTop: "3px"
                            }}
                        >

                            <span
                                style={{
                                    textDecoration:
                                        "line-through",
                                    color:
                                        "#888",
                                    fontSize:
                                        "11px"
                                }}
                            >
                                ₹
                                {Number(
                                    product.originalPrice
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </span>


                            {product?.discount >
                                0 && (

                                <span
                                    style={{
                                        color:
                                            "green",
                                        fontSize:
                                            "11px",
                                        fontWeight:
                                            "600"
                                    }}
                                >
                                    {product.discount}%
                                    OFF
                                </span>

                            )}

                        </div>

                    )}


                {/* =================================================
                    RATING
                ================================================= */}

                <div
                    style={{
                        fontSize: "12px",
                        marginTop: "5px"
                    }}
                >

                    ⭐{" "}
                    {product?.rating ||
                        "No rating"}

                    {product?.reviews !==
                        undefined &&
                        ` (${product.reviews} reviews)`
                    }

                </div>


                {/* =================================================
                    STOCK
                ================================================= */}

                <div
                    style={{
                        fontSize: "12px",
                        marginTop: "3px"
                    }}
                >
                    Stock:{" "}
                    {product?.stock ??
                        "N/A"}
                </div>


                {/* =================================================
                    SELLER
                ================================================= */}

                {product?.seller && (

                    <div
                        style={{
                            fontSize: "11px",
                            color: "#666",
                            marginTop: "3px"
                        }}
                    >
                        Seller:{" "}
                        {product.seller}
                    </div>

                )}


                {/* =================================================
                    DELIVERY
                ================================================= */}

                {product?.delivery && (

                    <div
                        style={{
                            fontSize: "11px",
                            color: "green",
                            marginTop: "3px"
                        }}
                    >
                        🚚{" "}
                        {product.delivery}
                    </div>

                )}


                {/* =================================================
                    BUTTONS
                ================================================= */}

                <div
                    style={{
                        display: "flex",
                        gap: "6px",
                        marginTop: "10px"
                    }}
                >

                    {/* =================================================
                        VIEW PRODUCT
                    ================================================= */}

                    <button
                        onClick={() =>
                            handleViewProduct(
                                product
                            )
                        }

                        style={{
                            flex: 1,
                            padding: "8px",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            background: "#eee",
                            color: "#111",
                            fontWeight: "500"
                        }}
                    >
                        View Product
                    </button>


                    {/* =================================================
                        ADD TO CART
                    ================================================= */}

                    <button
                        onClick={() =>
                            handleAddToCart(
                                product
                            )
                        }

                        disabled={
                            addingProductId ===
                            product.id
                        }

                        style={{
                            flex: 1,
                            padding: "8px",
                            border: "none",
                            borderRadius: "6px",
                            cursor:
                                addingProductId ===
                                product.id
                                    ? "not-allowed"
                                    : "pointer",
                            background: "#111",
                            color: "#fff",
                            fontWeight: "500"
                        }}
                    >

                        {addingProductId ===
                        product.id
                            ? "Adding..."
                            : "Add to Cart"}

                    </button>

                </div>


                {/* =================================================
                    CART STATUS
                ================================================= */}

                {cartMessage[
                    product.id
                ] && (

                    <div
                        style={{
                            fontSize: "12px",
                            color: "green",
                            marginTop: "6px",
                            textAlign: "center"
                        }}
                    >
                        {
                            cartMessage[
                                product.id
                            ]
                        }
                    </div>

                )}

                {/* =================================================
                    WISHLIST STATUS
                ================================================= */}

                {wishlistMessage[
                    product.id
                ] && (

                    <div
                        style={{
                            fontSize: "12px",
                            color: isInWishlist(product.id)
                                ? "#dc2626"
                                : "#16a34a",
                            marginTop: "5px",
                            textAlign: "center",
                            fontWeight: "500"
                        }}
                    >
                        {
                            wishlistMessage[
                                product.id
                            ]
                        }
                    </div>

                )}

            </div>
        );
    };


    // =====================================================
    // CHATBOT UI
    // =====================================================

    return (

        <>

            {/* =================================================
                CHATBOT BUTTON
            ================================================= */}

            {!isOpen && (

                <button
                    onClick={() =>
                        setIsOpen(true)
                    }

                    style={{
                        position: "fixed",
                        bottom: "25px",
                        right: "25px",
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        border: "none",
                        background: "#111",
                        color: "#fff",
                        fontSize: "25px",
                        cursor: "pointer",
                        zIndex: 9999,
                        boxShadow:
                            "0 4px 15px rgba(0,0,0,0.25)"
                    }}
                >
                    🤖
                </button>

            )}


            {/* =================================================
                CHAT WINDOW
            ================================================= */}

            {isOpen && (

                <div
                    style={{
                        position: "fixed",
                        bottom: "25px",
                        right: "25px",
                        width: "380px",
                        height: "550px",
                        background: "#fff",
                        borderRadius: "15px",
                        boxShadow:
                            "0 5px 30px rgba(0,0,0,0.25)",
                        zIndex: 9999,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden"
                    }}
                >


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div
                        style={{
                            background: "#111",
                            color: "#fff",
                            padding: "15px",
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems:
                                "center"
                        }}
                    >

                        <div>

                            <div
                                style={{
                                    fontWeight: "700",
                                    fontSize: "17px"
                                }}
                            >
                                ShopSphere AI
                            </div>


                            <div
                                style={{
                                    fontSize: "11px",
                                    opacity: 0.7
                                }}
                            >
                                Your shopping assistant
                            </div>

                        </div>


                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px"
                            }}
                        >

                            {/* =================================================
                                CLEAR CHAT
                            ================================================= */}

                            <button
                                onClick={
                                    clearChat
                                }

                                disabled={loading}

                                title="Clear chat"

                                style={{
                                    background:
                                        "transparent",
                                    border: "none",
                                    color: "#fff",
                                    fontSize: "13px",
                                    cursor:
                                        loading
                                            ? "not-allowed"
                                            : "pointer",
                                    opacity:
                                        loading
                                            ? 0.5
                                            : 1
                                }}
                            >
                                Clear
                            </button>


                            {/* =================================================
                                CLOSE
                            ================================================= */}

                            <button
                                onClick={() =>
                                    setIsOpen(false)
                                }

                                style={{
                                    background:
                                        "transparent",
                                    border: "none",
                                    color: "#fff",
                                    fontSize: "22px",
                                    cursor: "pointer"
                                }}
                            >
                                ×
                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        MESSAGES
                    ================================================= */}

                    <div
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            padding: "12px",
                            background: "#f7f7f7"
                        }}
                    >


                        {/* =================================================
                            QUICK SUGGESTIONS
                        ================================================= */}

                        {messages.length === 1 &&
                            !loading && (

                            <div
                                style={{
                                    marginBottom:
                                        "12px"
                                }}
                            >

                                <div
                                    style={{
                                        fontSize:
                                            "12px",
                                        color:
                                            "#666",
                                        marginBottom:
                                            "7px"
                                    }}
                                >
                                    Try asking:
                                </div>


                                <div
                                    style={{
                                        display:
                                            "flex",
                                        flexWrap:
                                            "wrap",
                                        gap: "6px"
                                    }}
                                >

                                    {quickSuggestions.map(
                                        suggestion => (

                                            <button
                                                key={
                                                    suggestion
                                                }

                                                onClick={() =>
                                                    handleSuggestionClick(
                                                        suggestion
                                                    )
                                                }

                                                disabled={
                                                    loading
                                                }

                                                style={{
                                                    padding:
                                                        "7px 10px",
                                                    border:
                                                        "1px solid #ddd",
                                                    borderRadius:
                                                        "20px",
                                                    background:
                                                        "#fff",
                                                    cursor:
                                                        loading
                                                            ? "not-allowed"
                                                            : "pointer",
                                                    fontSize:
                                                        "11px",
                                                    color:
                                                        "#111"
                                                }}
                                            >
                                                {suggestion}
                                            </button>

                                        )
                                    )}

                                </div>

                            </div>

                        )}


                        {/* =================================================
                            ALL MESSAGES
                        ================================================= */}

                        {messages.map(
                            (msg, index) => (

                                <div
                                    key={index}
                                    style={{
                                        marginBottom:
                                            "12px"
                                    }}
                                >

                                    {/* =================================================
                                        MESSAGE
                                    ================================================= */}

                                    <div
                                        style={{
                                            maxWidth:
                                                "90%",

                                            marginLeft:
                                                msg.role ===
                                                "user"
                                                    ? "auto"
                                                    : "0",

                                            background:
                                                msg.role ===
                                                "user"
                                                    ? "#111"
                                                    : "#fff",

                                            color:
                                                msg.role ===
                                                "user"
                                                    ? "#fff"
                                                    : "#111",

                                            padding:
                                                "10px",

                                            borderRadius:
                                                "10px",

                                            fontSize:
                                                "13px",

                                            lineHeight:
                                                "1.5",

                                            overflowX:
                                                "auto"
                                        }}
                                    >

                                        <ReactMarkdown
                                            components={{

                                                table:
                                                    ({ children }) => (

                                                        <div
                                                            style={{
                                                                overflowX:
                                                                    "auto",
                                                                marginTop:
                                                                    "8px",
                                                                marginBottom:
                                                                    "8px"
                                                            }}
                                                        >

                                                            <table
                                                                style={{
                                                                    width:
                                                                        "100%",
                                                                    borderCollapse:
                                                                        "collapse",
                                                                    fontSize:
                                                                        "12px",
                                                                    background:
                                                                        "#fff"
                                                                }}
                                                            >
                                                                {children}
                                                            </table>

                                                        </div>
                                                    ),


                                                thead:
                                                    ({ children }) => (
                                                        <thead>
                                                            {children}
                                                        </thead>
                                                    ),


                                                tbody:
                                                    ({ children }) => (
                                                        <tbody>
                                                            {children}
                                                        </tbody>
                                                    ),


                                                tr:
                                                    ({ children }) => (
                                                        <tr>
                                                            {children}
                                                        </tr>
                                                    ),


                                                th:
                                                    ({ children }) => (

                                                        <th
                                                            style={{
                                                                border:
                                                                    "1px solid #ddd",
                                                                padding:
                                                                    "7px",
                                                                background:
                                                                    "#f1f1f1",
                                                                textAlign:
                                                                    "left",
                                                                fontWeight:
                                                                    "600",
                                                                color:
                                                                    "#111"
                                                            }}
                                                        >
                                                            {children}
                                                        </th>

                                                    ),


                                                td:
                                                    ({ children }) => (

                                                        <td
                                                            style={{
                                                                border:
                                                                    "1px solid #ddd",
                                                                padding:
                                                                    "7px",
                                                                verticalAlign:
                                                                    "top",
                                                                color:
                                                                    "#111"
                                                            }}
                                                        >
                                                            {children}
                                                        </td>

                                                    ),


                                                ul:
                                                    ({ children }) => (

                                                        <ul
                                                            style={{
                                                                paddingLeft:
                                                                    "20px",
                                                                marginTop:
                                                                    "6px",
                                                                marginBottom:
                                                                    "6px"
                                                            }}
                                                        >
                                                            {children}
                                                        </ul>

                                                    ),


                                                ol:
                                                    ({ children }) => (

                                                        <ol
                                                            style={{
                                                                paddingLeft:
                                                                    "20px",
                                                                marginTop:
                                                                    "6px",
                                                                marginBottom:
                                                                    "6px"
                                                            }}
                                                        >
                                                            {children}
                                                        </ol>

                                                    ),


                                                li:
                                                    ({ children }) => (

                                                        <li
                                                            style={{
                                                                marginBottom:
                                                                    "4px"
                                                            }}
                                                        >
                                                            {children}
                                                        </li>

                                                    ),


                                                p:
                                                    ({ children }) => (

                                                        <p
                                                            style={{
                                                                marginTop:
                                                                    "5px",
                                                                marginBottom:
                                                                    "5px"
                                                            }}
                                                        >
                                                            {children}
                                                        </p>

                                                    ),


                                                strong:
                                                    ({ children }) => (
                                                        <strong>
                                                            {children}
                                                        </strong>
                                                    ),


                                                h1:
                                                    ({ children }) => (

                                                        <h1
                                                            style={{
                                                                fontSize:
                                                                    "18px",
                                                                margin:
                                                                    "8px 0"
                                                            }}
                                                        >
                                                            {children}
                                                        </h1>

                                                    ),


                                                h2:
                                                    ({ children }) => (

                                                        <h2
                                                            style={{
                                                                fontSize:
                                                                    "16px",
                                                                margin:
                                                                    "8px 0"
                                                            }}
                                                        >
                                                            {children}
                                                        </h2>

                                                    ),


                                                h3:
                                                    ({ children }) => (

                                                        <h3
                                                            style={{
                                                                fontSize:
                                                                    "15px",
                                                                margin:
                                                                    "8px 0"
                                                            }}
                                                        >
                                                            {children}
                                                        </h3>

                                                    )

                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>

                                    </div>


                                    {/* =================================================
                                        PRODUCT CARDS
                                    ================================================= */}

                                    {msg.role === "ai" &&
                                        msg.products &&
                                        msg.products.length >
                                            0 && (

                                        <div
                                            style={{
                                                marginTop:
                                                    "5px"
                                            }}
                                        >

                                            {msg.products.map(
                                                product => (

                                                    <ProductCard
                                                        key={
                                                            product.id
                                                        }

                                                        product={
                                                            product
                                                        }
                                                    />

                                                )
                                            )}

                                        </div>

                                    )}

                                </div>

                            )
                        )}


                        {/* =================================================
                            LOADING
                        ================================================= */}

                        {loading && (

                            <div
                                style={{
                                    background:
                                        "#fff",
                                    padding:
                                        "10px",
                                    borderRadius:
                                        "10px",
                                    width:
                                        "fit-content",
                                    fontSize:
                                        "13px"
                                }}
                            >
                                ShopSphere AI is
                                thinking...
                            </div>

                        )}

                    </div>


                    {/* =================================================
                        INPUT
                    ================================================= */}

                    <div
                        style={{
                            padding: "10px",
                            borderTop:
                                "1px solid #ddd",
                            display: "flex",
                            gap: "7px"
                        }}
                    >

                        <input
                            value={message}

                            onChange={(e) =>
                                setMessage(
                                    e.target.value
                                )
                            }

                            onKeyDown={
                                handleKeyDown
                            }

                            placeholder=
                                "Ask ShopSphere AI..."

                            disabled={loading}

                            style={{
                                flex: 1,
                                padding: "10px",
                                border:
                                    "1px solid #ccc",
                                borderRadius:
                                    "7px",
                                outline: "none"
                            }}
                        />


                        {/* =================================================
                            SEND BUTTON
                        ================================================= */}

                        <button
                            onClick={() =>
                                sendMessage()
                            }

                            disabled={loading}

                            style={{
                                padding:
                                    "10px 14px",
                                border: "none",
                                borderRadius:
                                    "7px",
                                background:
                                    "#111",
                                color:
                                    "#fff",
                                cursor:
                                    loading
                                        ? "not-allowed"
                                        : "pointer"
                            }}
                        >
                            {loading
                                ? "..."
                                : "Send"}
                        </button>

                    </div>

                </div>

            )}

        </>
    );
}

export default AIChatbot;