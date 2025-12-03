# PaymentControllerApi

All URIs are relative to *http://localhost:8080/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**handleCallback**](#handlecallback) | **GET** /payment/callback | |
|[**initPayment**](#initpayment) | **POST** /payment/init/{orderId} | |

# **handleCallback**
> object handleCallback()


### Example

```typescript
import {
    PaymentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentControllerApi(configuration);

let params: { [key: string]: string; }; // (default to undefined)

const { status, data } = await apiInstance.handleCallback(
    params
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **params** | **{ [key: string]: string; }** |  | defaults to undefined|


### Return type

**object**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **initPayment**
> object initPayment()


### Example

```typescript
import {
    PaymentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentControllerApi(configuration);

let orderId: number; // (default to undefined)

const { status, data } = await apiInstance.initPayment(
    orderId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **orderId** | [**number**] |  | defaults to undefined|


### Return type

**object**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

