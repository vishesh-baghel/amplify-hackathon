import React, { useEffect } from "react";
import style from "./Dashboard.module.css";
import SideBar from "../../ui-components/SideBar";
import { Button, Card, Heading, View, Alert } from "@aws-amplify/ui-react";
import CustomerCreateForm from "../../ui-components/CustomerCreateForm";
import CustomerSummary from "../CustomerSummary/CustomerSummary";
import ProductSummary from "../ProductSummary/ProductSummary";
import OrderSummary from "../OrderSummary/OrderSummary";
import ProductCreateForm from "../../ui-components/ProductCreateForm";
import OrderCreateForm from "../../ui-components/OrderCreateForm";
import Stat from "../../ui-components/Stat";
import { DataStore } from "@aws-amplify/datastore";
import { Customer, Order, AuditLogs } from "../../models";
import { Notifications, Analytics, AWSPinpointProvider } from "aws-amplify";
import AddProduct from "../AddProduct/AddProduct";
import { Product } from "../../models";
import { Storage } from "aws-amplify";
import { Buffer } from "buffer";
import ActivityLogs from "../ActivityLogs/ActivityLogs";

function Dashboard() {
  const [showProductCreateForm, setShowProductCreateForm] =
    React.useState(false);
  const [showCustomerCreateForm, setShowCustomerCreateForm] =
    React.useState(false);
  const [showOrderCreateForm, setShowOrderCreateForm] = React.useState(false);
  const [showHome, setShowHome] = React.useState(true);
  const [showCustomerSummary, setShowCustomerSummary] = React.useState(false);
  const [showProductSummary, setShowProductSummary] = React.useState(false);
  const [showOrderSummary, setShowOrderSummary] = React.useState(false);
  const [salesValue, setSalesValue] = React.useState("");
  const [customerValue, setCustomerValue] = React.useState("");
  const [orderValue, setOrderValue] = React.useState("");
  const [salesValueChange, setSalesValueChange] = React.useState("");
  const [customerValueChange, setCustomerValueChange] = React.useState("");
  const [orderValueChange, setOrderValueChange] = React.useState("");

  const [showProductCreateSuccessAlert, setShowProductCreateSuccessAlert] =
    React.useState(false);
  const [showProductCreateFailureAlert, setShowProductCreateFailureAlert] =
    React.useState(false);
  const [showCustomerCreateSuccessAlert, setShowCustomerCreateSuccessAlert] =
    React.useState(false);
  const [showCustomerCreateFailureAlert, setShowCustomerCreateFailureAlert] =
    React.useState(false);
  const [showOrderCreateSuccessAlert, setShowOrderCreateSuccessAlert] =
    React.useState(false);
  const [showOrderCreateFailureAlert, setShowOrderCreateFailureAlert] =
    React.useState(false);

  const { InAppMessaging } = Notifications;
  const myFirstEvent = {
    name: "My_first_event",
    attributes: { color: "red" },
  };

  useEffect(() => {
    InAppMessaging.syncMessages();
  }, []);

  const handleHomeButton = () => {
    setShowHome(true);
    setShowCustomerSummary(false);
    setShowOrderSummary(false);
    setShowProductSummary(false);
  };

  const handleCustomerSummaryButton = () => {
    setShowCustomerSummary(true);
    setShowHome(false);
    setShowOrderSummary(false);
    setShowProductSummary(false);
  };

  const handleProductSummaryButton = () => {
    setShowProductSummary(true);
    setShowHome(false);
    setShowCustomerSummary(false);
    setShowOrderSummary(false);
  };

  const handleOrderSummaryButton = () => {
    setShowOrderSummary(true);
    setShowHome(false);
    setShowCustomerSummary(false);
    setShowProductSummary(false);
  };

  React.useEffect(() => {
    fetchCustomerData();
    fetchOrderData();
  }, [customerValue, orderValue]);

  const fetchCustomerData = async () => {
    const customerModels = await DataStore.query(Customer);
    setCustomerValue(customerModels.length);
    calculateCustomerValueChange();
    console.log("triggered");
  };

  const fetchOrderData = async () => {
    const orderModels = await DataStore.query(Order);
    setOrderValue(orderModels.length);
    calculateOrderValueChange();
    calculateTotalSales(orderModels);
  };

  const calculateTotalSales = (models) => {
    let totalSales = 0;
    models.forEach((model) => {
      totalSales += model.totalAmount;
    });
    setSalesValue(`$${totalSales}`);
    calculateSalesValueChange();
  };

  const calculateCustomerValueChange = () => {
    const change = Math.floor(Math.random() * 10);
    const isPositive = Math.floor(Math.random() * 2);
    if (isPositive) {
      setCustomerValueChange(`+${change}%`);
    } else {
      setCustomerValueChange(`-${change}%`);
    }
  };

  const calculateOrderValueChange = () => {
    const change = Math.floor(Math.random() * 10);
    const isPositive = Math.floor(Math.random() * 2);
    if (isPositive) {
      setOrderValueChange(`+${change}%`);
    } else {
      setOrderValueChange(`-${change}%`);
    }
  };

  const calculateSalesValueChange = () => {
    const change = Math.floor(Math.random() * 10);
    const isPositive = Math.floor(Math.random() * 2);
    if (isPositive) {
      setSalesValueChange(`+${change}%`);
    } else {
      setSalesValueChange(`-${change}%`);
    }
  };

  const closeModel = () => {
    setShowProductCreateForm(false);
    setShowCustomerCreateForm(false);
    setShowOrderCreateForm(false);
  };

  setTimeout(() => {
    setShowProductCreateSuccessAlert(false);
    setShowProductCreateFailureAlert(false);
    setShowCustomerCreateSuccessAlert(false);
    setShowCustomerCreateFailureAlert(false);
    setShowOrderCreateSuccessAlert(false);
    setShowOrderCreateFailureAlert(false);
  }, 3000);

  const alertProductCreateSuccess = () => {
    return (
      <Alert
        style={{
          position: "fixed",
          top: "3%",
          left: "40%",
          width: "fit-content",
          height: "3rem",
          zIndex: "9999",
          justifyContent: "center",
          alignItems: "center",
        }}
        isDismissible={true}
        hasIcon={true}
        variation="success"
      >
        Product created successfully!
      </Alert>
    );
  };

  const alertProductCreateFailure = () => {
    return (
      <Alert
        style={{
          position: "fixed",
          top: "3%",
          left: "40%",
          width: "fit-content",
          height: "3rem",
          zIndex: "9999",
          justifyContent: "center",
          alignItems: "center",
        }}
        isDismissible={true}
        hasIcon={true}
        variation="error"
      >
        Product creation failed!
      </Alert>
    );
  };

  const alertCustomerCreateSuccess = () => {
    return (
      <Alert
        style={{
          position: "fixed",
          top: "3%",
          left: "40%",
          width: "fit-content",
          height: "3rem",
          zIndex: "9999",
          justifyContent: "center",
          alignItems: "center",
        }}
        isDismissible={true}
        hasIcon={true}
        variation="success"
      >
        Customer created successfully!
      </Alert>
    );
  };

  const alertCustomerCreateFailure = () => {
    return (
      <Alert
        style={{
          position: "fixed",
          top: "3%",
          left: "40%",
          width: "fit-content",
          height: "3rem",
          zIndex: "9999",
          justifyContent: "center",
          alignItems: "center",
        }}
        isDismissible={true}
        hasIcon={true}
        variation="error"
      >
        Customer creation failed!
      </Alert>
    );
  };

  const alertOrderCreateSuccess = () => {
    return (
      <Alert
        style={{
          position: "fixed",
          top: "3%",
          left: "40%",
          width: "fit-content",
          height: "3rem",
          zIndex: "9999",
          justifyContent: "center",
          alignItems: "center",
        }}
        isDismissible={true}
        hasIcon={true}
        variation="success"
      >
        Order created successfully!
      </Alert>
    );
  };

  const alertOrderCreateFailure = () => {
    return (
      <Alert
        style={{
          position: "fixed",
          top: "3%",
          left: "40%",
          width: "fit-content",
          height: "3rem",
          zIndex: "9999",
          justifyContent: "center",
          alignItems: "center",
        }}
        isDismissible={true}
        hasIcon={true}
        variation="error"
      >
        Order creation failed!
      </Alert>
    );
  };

  useEffect(() => {
    const listener = InAppMessaging.onMessageReceived(myMessageReceivedHandler);
    return () => listener.remove();
  }, []);

  useEffect(() => {
    const displayListener = InAppMessaging.onMessageDisplayed(
      myMessageDisplayedHandler
    );
    return () => displayListener.remove();
  }, []);

  const myMessageReceivedHandler = (message) => {
    console.log(message);
  };

  const myMessageDisplayedHandler = (message) => {
    console.log("Message displayed", message);
  };

  const downloadProductImages = async (products) => {
    products.forEach(async (product) => {
      await Storage.get(`${product.productImages[0]}`, {
        level: "public",
      })
        .then((result) => {
          console.log(result);
        })
        .catch((err) => console.log(err));
    });
  };

  const [auditLogs, setAuditLogs] = React.useState([]);

  useEffect(() => {
    const customerSub = DataStore.observe(Customer).subscribe((msg) => {
      setAuditLogs((prev) => [...prev, msg]);
    });

    const orderSub = DataStore.observe(Order).subscribe((msg) => {
      setAuditLogs((prev) => [...prev, msg]);
    });

    const productSub = DataStore.observe(Product).subscribe((msg) => {
      setAuditLogs((prev) => [...prev, msg]);
    });

    return () => {
      customerSub.unsubscribe();
      orderSub.unsubscribe();
      productSub.unsubscribe();
    };
  }, []);

  useEffect(() => {
    auditLogs.forEach((log) => {
      DataStore.save(
        new AuditLogs({
          modelName: log.modelName,
          operationType: log.opType,
        })
      );
    });
  }, []);

  return (
    <View className={style.container}>
      <SideBar
        className={style.sidebar}
        height={"100%"}
        HomeButtonHandler={handleHomeButton}
        CustomerButtonHandler={handleCustomerSummaryButton}
        ProductButtonHandler={handleProductSummaryButton}
        OrderButtonHandler={handleOrderSummaryButton}
      />
      {showHome && (
        <>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
            }}
          >
            <Heading
              style={{
                display: "flex",
                alignContent: "left",
                marginTop: "1rem",
              }}
              level={3}
            >
              Admin Dashboard
            </Heading>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "left",
                gap: "1rem",
              }}
            >
              <Button
                style={{
                  width: "11rem",
                  height: "3rem",
                  marginTop: "2rem",
                }}
                onClick={() => {
                  setShowProductCreateForm(!showProductCreateForm);
                  setShowCustomerCreateForm(false);
                  setShowOrderCreateForm(false);
                }}
              >
                Add Product
              </Button>
              <Button
                style={{
                  width: "11rem",
                  height: "3rem",
                  marginTop: "2rem",
                }}
                onClick={() => {
                  setShowCustomerCreateForm(!showCustomerCreateForm);
                  setShowProductCreateForm(false);
                  setShowOrderCreateForm(false);
                }}
              >
                Add Customer
              </Button>
              <Button
                style={{
                  width: "11rem",
                  height: "3rem",
                  marginTop: "2rem",
                }}
                onClick={() => {
                  setShowOrderCreateForm(!showOrderCreateForm);
                  setShowCustomerCreateForm(false);
                  setShowProductCreateForm(false);
                }}
              >
                Add Order
              </Button>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "left",
                marginTop: "2rem",
              }}
            >
              <Heading
                style={{
                  display: "flex",
                  alignContent: "left",
                }}
                level={3}
              >
                Summary
              </Heading>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "left",
                  justifyContent: "left",
                  marginTop: "2rem",
                }}
              >
                <Button
                  style={{
                    width: "6rem",
                    height: "1.5rem",
                    border: "1px solid black",
                  }}
                  onClick={() => {
                    fetchCustomerData();
                    fetchOrderData();
                  }}
                >
                  Refresh
                </Button>
                <Stat
                  lable={"Total Sales"}
                  value={salesValue}
                  percentageChange={salesValueChange}
                  padding={"1rem 0 1rem 0"}
                />
                <Stat
                  lable={"Total Customers"}
                  value={customerValue}
                  percentageChange={customerValueChange}
                  padding={"1rem 0 1rem 0"}
                />
                <Stat
                  lable={"Total Orders"}
                  value={orderValue}
                  percentageChange={orderValueChange}
                  padding={"1rem 0 1rem 0"}
                />
              </View>
            </View>
            <View
              style={{
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(5px)",
                zIndex: "9998",
                display:
                  showProductCreateForm ||
                  showCustomerCreateForm ||
                  showOrderCreateForm
                    ? "flex"
                    : "none",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {showProductCreateForm && (
                <View style={{ zIndex: "9999" }}>
                  <Card variation="elevated">
                    <AddProduct
                      closeModal={() => {
                        setShowProductCreateForm(false);
                      }}
                    />
                  </Card>
                </View>
              )}
              {showCustomerCreateForm && (
                <View style={{ zIndex: "9999" }}>
                  <Card variation="elevated">
                    <View>
                      <View
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Heading level={3}>Add Customer</Heading>
                        <Button
                          style={{
                            width: "4rem",
                            height: "2rem",
                            margin: "0 0 0 1rem",
                          }}
                          onClick={closeModel}
                        >
                          Close
                        </Button>
                      </View>
                      <CustomerCreateForm
                        onSuccess={() => {
                          setShowCustomerCreateSuccessAlert(true);
                          setShowCustomerCreateForm(false);
                        }}
                        onError={() => {
                          setShowCustomerCreateFailureAlert(true);
                          setShowCustomerCreateForm(false);
                        }}
                      />
                    </View>
                  </Card>
                </View>
              )}
              {showOrderCreateForm && (
                <View style={{ zIndex: "9999" }}>
                  <Card variation="elevated">
                    <View>
                      <View
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Heading level={3}>Add Order</Heading>
                        <Button
                          style={{
                            width: "4rem",
                            height: "2rem",
                            margin: "0 0 0 4rem",
                          }}
                          onClick={closeModel}
                        >
                          Close
                        </Button>
                      </View>
                      <OrderCreateForm
                        onSuccess={() => {
                          setShowOrderCreateSuccessAlert(true);
                          setShowOrderCreateForm(false);
                        }}
                        onError={() => {
                          setShowOrderCreateFailureAlert(true);
                          setShowOrderCreateForm(false);
                        }}
                      />
                    </View>
                  </Card>
                </View>
              )}
            </View>
          </View>
          <View>
            <Button
              onClick={() => {
                const userInfo = {
                  address: "visheshbaghel99@gmail.com",
                };
                InAppMessaging.identifyUser("2323", userInfo);
                Analytics.record(myFirstEvent)
                  .then(() => console.log("recorded"))
                  .catch((err) => console.log(err));
              }}
            >
              Record Analytics Event
            </Button>

            <Button
              onClick={() => {
                const userInfo = {
                  address: "visheshbaghel99@gmail.com",
                };
                InAppMessaging.identifyUser("2323", userInfo);
                InAppMessaging.dispatchEvent(myFirstEvent)
                  .then(() => console.log("dispatched"))
                  .catch((err) => console.log(err));
              }}
            >
              Send In-App Messaging Event
            </Button>
            <Button
              onClick={async () => {
                let obj = {
                  firstname: "vishesh",
                  lastname: "baghel",
                };
                let data = {
                  Bucket:
                    "ecommerceappca7f386258834b109bcf533779c27846122736-staging",
                  Key: "auditLogs.json",
                  Body: JSON.stringify(obj),
                };
                await Storage.put(data)
                  .then((result) => {
                    console.log(result.key);
                  })
                  .catch((err) => console.log(err));
              }}
            >
              save audit logs
            </Button>
            <Button
              onClick={async () => {
                const params = {
                  bucket:
                    "your-ecommerceappca7f386258834b109bcf533779c27846122736-name",
                  key: "auditLogs.json",
                };
                Storage.get(params)
                  .then((result) => {
                    const data = result.Body.toString("utf-8");
                    const jsonObject = JSON.parse(data);
                    console.log(jsonObject);
                  })
                  .catch((err) => console.log(err));
              }}
            >
              get audit logs
            </Button>
          </View>
        </>
      )}
      {showCustomerSummary && <CustomerSummary />}
      {showProductSummary && <ProductSummary />}
      {showOrderSummary && <OrderSummary />}
      {showProductCreateSuccessAlert && alertProductCreateSuccess()}
      {showProductCreateFailureAlert && alertProductCreateFailure()}
      {showCustomerCreateSuccessAlert && alertCustomerCreateSuccess()}
      {showCustomerCreateFailureAlert && alertCustomerCreateFailure()}
      {showOrderCreateSuccessAlert && alertOrderCreateSuccess()}
      {showOrderCreateFailureAlert && alertOrderCreateFailure()}
      <ActivityLogs />
    </View>
  );
}

export default Dashboard;
