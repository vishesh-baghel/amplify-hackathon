/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Autocomplete,
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  Text,
  TextAreaField,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import {
  getOverrideProps,
  useDataStoreBinding,
} from "@aws-amplify/ui-react/internal";
import { Inventory, Product } from "../models";
import { fetchByPath, validateField } from "./utils";
import { DataStore } from "aws-amplify";
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button
            size="small"
            variation="link"
            isDisabled={hasError}
            onClick={addItem}
          >
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function InventoryUpdateForm(props) {
  const {
    id: idProp,
    inventory: inventoryModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    quantity: "",
    location: "",
    lastUpdated: "",
    productID: undefined,
  };
  const [quantity, setQuantity] = React.useState(initialValues.quantity);
  const [location, setLocation] = React.useState(initialValues.location);
  const [lastUpdated, setLastUpdated] = React.useState(
    initialValues.lastUpdated
  );
  const [productID, setProductID] = React.useState(initialValues.productID);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = inventoryRecord
      ? { ...initialValues, ...inventoryRecord, productID }
      : initialValues;
    setQuantity(cleanValues.quantity);
    setLocation(
      typeof cleanValues.location === "string"
        ? cleanValues.location
        : JSON.stringify(cleanValues.location)
    );
    setLastUpdated(cleanValues.lastUpdated);
    setProductID(cleanValues.productID);
    setCurrentProductIDValue(undefined);
    setCurrentProductIDDisplayValue("");
    setErrors({});
  };
  const [inventoryRecord, setInventoryRecord] =
    React.useState(inventoryModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? await DataStore.query(Inventory, idProp)
        : inventoryModelProp;
      setInventoryRecord(record);
      const productIDRecord = record ? await record.productID : undefined;
      setProductID(productIDRecord);
    };
    queryData();
  }, [idProp, inventoryModelProp]);
  React.useEffect(resetStateValues, [inventoryRecord, productID]);
  const [currentProductIDDisplayValue, setCurrentProductIDDisplayValue] =
    React.useState("");
  const [currentProductIDValue, setCurrentProductIDValue] =
    React.useState(undefined);
  const productIDRef = React.createRef();
  const productRecords = useDataStoreBinding({
    type: "collection",
    model: Product,
  }).items;
  const getDisplayValue = {
    productID: (r) => `${r?.name ? r?.name + " - " : ""}${r?.id}`,
  };
  const validations = {
    quantity: [],
    location: [{ type: "JSON" }],
    lastUpdated: [],
    productID: [{ type: "Required" }],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          quantity,
          location,
          lastUpdated,
          productID,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value.trim() === "") {
              modelFields[key] = undefined;
            }
          });
          const modelFieldsToSave = {
            quantity: modelFields.quantity,
            lastUpdated: modelFields.lastUpdated,
            productID: modelFields.productID,
            location: modelFields.location
              ? JSON.parse(modelFields.location)
              : modelFields.location,
          };
          await DataStore.save(
            Inventory.copyOf(inventoryRecord, (updated) => {
              Object.assign(updated, modelFieldsToSave);
            })
          );
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "InventoryUpdateForm")}
      {...rest}
    >
      <TextField
        label="Quantity"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={quantity}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              quantity: value,
              location,
              lastUpdated,
              productID,
            };
            const result = onChange(modelFields);
            value = result?.quantity ?? value;
          }
          if (errors.quantity?.hasError) {
            runValidationTasks("quantity", value);
          }
          setQuantity(value);
        }}
        onBlur={() => runValidationTasks("quantity", quantity)}
        errorMessage={errors.quantity?.errorMessage}
        hasError={errors.quantity?.hasError}
        {...getOverrideProps(overrides, "quantity")}
      ></TextField>
      <TextAreaField
        label="Location"
        isRequired={false}
        isReadOnly={false}
        value={location}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              quantity,
              location: value,
              lastUpdated,
              productID,
            };
            const result = onChange(modelFields);
            value = result?.location ?? value;
          }
          if (errors.location?.hasError) {
            runValidationTasks("location", value);
          }
          setLocation(value);
        }}
        onBlur={() => runValidationTasks("location", location)}
        errorMessage={errors.location?.errorMessage}
        hasError={errors.location?.hasError}
        {...getOverrideProps(overrides, "location")}
      ></TextAreaField>
      <TextField
        label="Last updated"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={lastUpdated}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              quantity,
              location,
              lastUpdated: value,
              productID,
            };
            const result = onChange(modelFields);
            value = result?.lastUpdated ?? value;
          }
          if (errors.lastUpdated?.hasError) {
            runValidationTasks("lastUpdated", value);
          }
          setLastUpdated(value);
        }}
        onBlur={() => runValidationTasks("lastUpdated", lastUpdated)}
        errorMessage={errors.lastUpdated?.errorMessage}
        hasError={errors.lastUpdated?.hasError}
        {...getOverrideProps(overrides, "lastUpdated")}
      ></TextField>
      <ArrayField
        lengthLimit={1}
        onChange={async (items) => {
          let value = items[0];
          if (onChange) {
            const modelFields = {
              quantity,
              location,
              lastUpdated,
              productID: value,
            };
            const result = onChange(modelFields);
            value = result?.productID ?? value;
          }
          setProductID(value);
          setCurrentProductIDValue(undefined);
        }}
        currentFieldValue={currentProductIDValue}
        label={"Product id"}
        items={productID ? [productID] : []}
        hasError={errors?.productID?.hasError}
        errorMessage={errors?.productID?.errorMessage}
        getBadgeText={(value) =>
          value
            ? getDisplayValue.productID(
                productRecords.find((r) => r.id === value)
              )
            : ""
        }
        setFieldValue={(value) => {
          setCurrentProductIDDisplayValue(
            value
              ? getDisplayValue.productID(
                  productRecords.find((r) => r.id === value)
                )
              : ""
          );
          setCurrentProductIDValue(value);
        }}
        inputFieldRef={productIDRef}
        defaultFieldValue={""}
      >
        <Autocomplete
          label="Product id"
          isRequired={true}
          isReadOnly={false}
          placeholder="Search Product"
          value={currentProductIDDisplayValue}
          options={productRecords
            .filter(
              (r, i, arr) =>
                arr.findIndex((member) => member?.id === r?.id) === i
            )
            .map((r) => ({
              id: r?.id,
              label: getDisplayValue.productID?.(r),
            }))}
          onSelect={({ id, label }) => {
            setCurrentProductIDValue(id);
            setCurrentProductIDDisplayValue(label);
            runValidationTasks("productID", label);
          }}
          onClear={() => {
            setCurrentProductIDDisplayValue("");
          }}
          defaultValue={productID}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.productID?.hasError) {
              runValidationTasks("productID", value);
            }
            setCurrentProductIDDisplayValue(value);
            setCurrentProductIDValue(undefined);
          }}
          onBlur={() => runValidationTasks("productID", currentProductIDValue)}
          errorMessage={errors.productID?.errorMessage}
          hasError={errors.productID?.hasError}
          ref={productIDRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "productID")}
        ></Autocomplete>
      </ArrayField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || inventoryModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || inventoryModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
