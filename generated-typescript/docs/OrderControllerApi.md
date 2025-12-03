# OrderControllerApi

All URIs are relative to *http://localhost:8080/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createOrder**](#createorder) | **POST** /orders | |
|[**deleteOrder**](#deleteorder) | **DELETE** /orders/{id} | |
|[**getAllOrders**](#getallorders) | **GET** /orders | |
|[**getOrderById**](#getorderbyid) | **GET** /orders/{id} | |
|[**getOrdersByUser**](#getordersbyuser) | **GET** /orders/user/{userId} | |
|[**updateStatus**](#updatestatus) | **PATCH** /admin/orders/{id}/status | |

# **createOrder**
> object createOrder(orderDTO)


### Example

```typescript
import {
    OrderControllerApi,
    Configuration,
    OrderDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderControllerApi(configuration);

let orderDTO: OrderDTO; //

const { status, data } = await apiInstance.createOrder(
    orderDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **orderDTO** | **OrderDTO**|  | |


### Return type

**object**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteOrder**
> object deleteOrder()


### Example

```typescript
import {
    OrderControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteOrder(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


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

# **getAllOrders**
> object getAllOrders()


### Example

```typescript
import {
    OrderControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderControllerApi(configuration);

const { status, data } = await apiInstance.getAllOrders();
```

### Parameters
This endpoint does not have any parameters.


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

# **getOrderById**
> object getOrderById()


### Example

```typescript
import {
    OrderControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getOrderById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


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

# **getOrdersByUser**
> object getOrdersByUser()


### Example

```typescript
import {
    OrderControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderControllerApi(configuration);

let userId: number; // (default to undefined)

const { status, data } = await apiInstance.getOrdersByUser(
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**number**] |  | defaults to undefined|


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

# **updateStatus**
> object updateStatus()


### Example

```typescript
import {
    OrderControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderControllerApi(configuration);

let id: number; // (default to undefined)
let status: string; // (default to undefined)

const { status, data } = await apiInstance.updateStatus(
    id,
    status
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|
| **status** | [**string**] |  | defaults to undefined|


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

